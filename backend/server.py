from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContatoCreate(BaseModel):
    nome: str
    email: str
    whatsapp: str
    empresa: str = ""
    mensagem: str
    lgpd: bool

class DiagnosticoCreate(BaseModel):
    nome: str
    empresa: str
    cargo: str
    website: str
    whatsapp: str
    email: str
    desafio: str
    servico: str = ""
    investimento: str = ""
    mensagem: str
    lgpd: bool

class AnalyzeRequest(BaseModel):
    site: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

@api_router.post("/contato")
async def create_contato(input: ContatoCreate):
    doc = input.model_dump()
    doc["criado_em"] = datetime.now(timezone.utc).isoformat()
    result = await db.contatos.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}

@api_router.post("/diagnostico")
async def create_diagnostico(input: DiagnosticoCreate):
    doc = input.model_dump()
    doc["criado_em"] = datetime.now(timezone.utc).isoformat()
    result = await db.diagnosticos.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}

@api_router.post("/seo/analyze")
async def seo_analyze(input: AnalyzeRequest):
    import httpx
    import re
    from urllib.parse import urlparse
    from fastapi import HTTPException

    raw = input.site.strip()
    if not raw:
        raise HTTPException(status_code=400, detail="Informe um domínio ou URL HTTP/HTTPS válido.")
    url = raw if raw.startswith(("http://", "https://")) else "https://" + raw
    host = urlparse(url).netloc
    if not host or "." not in host:
        raise HTTPException(status_code=400, detail="Informe um domínio ou URL HTTP/HTTPS válido.")

    try:
        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0 (compatible; EXEKUTAAnalyzer/1.0)"},
        ) as http:
            resp = await http.get(url)
        resp.raise_for_status()
    except Exception:
        raise HTTPException(status_code=502, detail="Não foi possível acessar o site informado.")

    html = resp.text
    final_url = str(resp.url)
    is_https = final_url.startswith("https://")

    def clean(s):
        return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()

    title_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    title = clean(title_m.group(1)) if title_m else ""
    desc_m = (
        re.search(r'<meta[^>]+name=["\']description["\'][^>]*content=["\'](.*?)["\']', html, re.I | re.S)
        or re.search(r'<meta[^>]+content=["\'](.*?)["\'][^>]*name=["\']description["\']', html, re.I | re.S)
    )
    description = clean(desc_m.group(1)) if desc_m else ""
    h1s = [clean(x) for x in re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.I | re.S) if clean(x)]
    h2_count = len([clean(x) for x in re.findall(r"<h2[^>]*>(.*?)</h2>", html, re.I | re.S) if clean(x)])
    img_tags = re.findall(r"<img\b[^>]*>", html, re.I)
    imgs = len(img_tags)
    imgs_alt = len([t for t in img_tags if re.search(r'\balt=["\'][^"\']+["\']', t, re.I)])
    viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', html, re.I))
    canonical = bool(re.search(r'<link[^>]+rel=["\']canonical["\']', html, re.I))
    og = bool(re.search(r'<meta[^>]+property=["\']og:', html, re.I))
    robots_meta = re.search(r'<meta[^>]+name=["\']robots["\'][^>]*content=["\'](.*?)["\']', html, re.I | re.S)
    noindex = bool(robots_meta and "noindex" in robots_meta.group(1).lower())

    def st(ok, warn=False):
        return "ok" if ok else ("warning" if warn else "critical")

    checks = [
        {"id": "https", "label": "HTTPS ativo", "status": st(is_https), "detail": final_url.split("/")[2] if is_https else "Recomendado migrar para HTTPS"},
        {"id": "title", "label": "Title tag", "status": st(bool(title) and 15 <= len(title) <= 65, bool(title)), "detail": title[:120] or "Nenhuma tag <title> encontrada"},
        {"id": "description", "label": "Meta description", "status": st(bool(description) and 50 <= len(description) <= 165, bool(description)), "detail": (description[:120] + ("..." if len(description) > 120 else "")) or "Nenhuma meta description encontrada"},
        {"id": "h1", "label": "H1 único", "status": st(len(h1s) == 1, 1 <= len(h1s) <= 2), "detail": h1s[0][:120] if h1s else "Nenhum H1 na página"},
        {"id": "h2", "label": "Estrutura de títulos (H2)", "status": st(h2_count >= 1), "detail": f"{h2_count} H2 encontrados"},
        {"id": "alt", "label": "Imagens com alt", "status": st(imgs == 0 or imgs_alt / imgs >= 0.8, imgs > 0 and imgs_alt / imgs >= 0.5), "detail": f"{imgs_alt}/{imgs} imagens com alt" if imgs else "Nenhuma imagem na página"},
        {"id": "viewport", "label": "Viewport mobile", "status": st(viewport), "detail": "Meta viewport presente" if viewport else "Meta viewport ausente"},
        {"id": "canonical", "label": "URL canônica", "status": st(canonical), "detail": "Canonical presente" if canonical else "Canonical ausente"},
        {"id": "og", "label": "Open Graph", "status": st(og, True), "detail": "Tags OG presentes" if og else "Tags OG ausentes"},
        {"id": "robots", "label": "Indexação liberada", "status": st(not noindex), "detail": "Sem noindex" if not noindex else "Página marcada como noindex"},
    ]

    weights = {"ok": 1, "warning": 0.5, "critical": 0}
    score = round(100 * sum(weights[c["status"]] for c in checks) / len(checks))

    doc = {
        "site": host,
        "score": score,
        "criado_em": datetime.now(timezone.utc).isoformat(),
    }
    await db.seo_analyses.insert_one(doc)

    return {"ok": True, "url": final_url, "title": title, "description": description, "h1s": h1s[:3], "score": score, "checks": checks}

# ============ ADMIN & CMS ============
import bcrypt
import jwt
from datetime import timedelta
from typing import Any
from bson import ObjectId
from fastapi import Request, UploadFile, File, HTTPException
from fastapi.responses import Response, JSONResponse
from motor.motor_asyncio import AsyncIOMotorGridFSBucket

JWT_ALGORITHM = "HS256"
CMS_SCOPES = {"brand", "footer", "home", "about", "faq", "services", "cases"}
fs_bucket = AsyncIOMotorGridFSBucket(db)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_admin_token(email: str) -> str:
    payload = {
        "sub": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def require_admin(request: Request) -> str:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
        return payload.get("sub", "")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada. Faça login novamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")


class AdminLogin(BaseModel):
    email: str
    password: str


class CmsSave(BaseModel):
    data: Any


@api_router.post("/admin/login")
async def admin_login(input: AdminLogin, request: Request):
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{input.email.lower().strip()}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until"):
        locked_until = attempt["locked_until"]
        if isinstance(locked_until, str):
            locked_until = datetime.fromisoformat(locked_until)
        if locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Muitas tentativas. Tente novamente em alguns minutos.")

    admin = await db.admin_users.find_one({"email": input.email.lower().strip()})
    if not admin or not verify_password(input.password, admin.get("password_hash", "")):
        count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"count": count}
        if count >= 5:
            update = {"count": 0, "locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    await db.login_attempts.delete_one({"identifier": identifier})
    return {"ok": True, "token": create_admin_token(admin["email"]), "email": admin["email"]}


@api_router.get("/admin/me")
async def admin_me(request: Request):
    email = await require_admin(request)
    return {"ok": True, "email": email}


async def get_content_version() -> int:
    meta = await db.cms_meta.find_one({"key": "version"})
    return (meta or {}).get("v", 0)


async def bump_content_version() -> int:
    await db.cms_meta.update_one({"key": "version"}, {"$inc": {"v": 1}}, upsert=True)
    meta = await db.cms_meta.find_one({"key": "version"})
    return (meta or {}).get("v", 0)


@api_router.get("/cms/public")
async def cms_public():
    docs = {}
    async for d in db.cms_content.find({}):
        docs[d["scope"]] = d.get("data")
    version = await get_content_version()
    return JSONResponse(
        content={"v": version, "content": docs},
        headers={"Cache-Control": "no-store, must-revalidate"},
    )


@api_router.get("/admin/cms")
async def admin_get_cms(request: Request):
    await require_admin(request)
    docs = {}
    async for d in db.cms_content.find({}):
        docs[d["scope"]] = d.get("data")
    version = await get_content_version()
    return {"ok": True, "content": docs, "v": version}


@api_router.put("/admin/cms/{scope}")
async def admin_save_cms(scope: str, input: CmsSave, request: Request):
    await require_admin(request)
    if scope not in CMS_SCOPES:
        raise HTTPException(status_code=400, detail="Escopo inválido")
    now = datetime.now(timezone.utc).isoformat()
    existing = await db.cms_content.find_one({"scope": scope})
    if existing:
        await db.cms_backups.insert_one({"scope": scope, "data": existing.get("data"), "backup_at": now})
    await db.cms_content.update_one(
        {"scope": scope}, {"$set": {"data": input.data, "updated_at": now}}, upsert=True
    )
    version = await bump_content_version()
    return {"ok": True, "v": version}


@api_router.post("/admin/cache/clear")
async def admin_cache_clear(request: Request):
    await require_admin(request)
    version = await bump_content_version()
    return {"ok": True, "v": version}


@api_router.get("/admin/cms/backups/{scope}")
async def admin_backups(scope: str, request: Request):
    await require_admin(request)
    items = []
    async for b in db.cms_backups.find({"scope": scope}).sort("backup_at", -1).limit(20):
        items.append({"id": str(b["_id"]), "backup_at": b.get("backup_at"), "data": b.get("data")})
    return {"ok": True, "backups": items}


@api_router.post("/admin/cms/backups/{scope}/{backup_id}/restore")
async def admin_restore(scope: str, backup_id: str, request: Request):
    await require_admin(request)
    try:
        bid = ObjectId(backup_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Backup inválido")
    b = await db.cms_backups.find_one({"_id": bid, "scope": scope})
    if not b:
        raise HTTPException(status_code=404, detail="Backup não encontrado")
    now = datetime.now(timezone.utc).isoformat()
    existing = await db.cms_content.find_one({"scope": scope})
    if existing:
        await db.cms_backups.insert_one({"scope": scope, "data": existing.get("data"), "backup_at": now})
    await db.cms_content.update_one(
        {"scope": scope}, {"$set": {"data": b.get("data"), "updated_at": now}}, upsert=True
    )
    version = await bump_content_version()
    return {"ok": True, "v": version}


ALLOWED_MEDIA = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml", "image/gif"}


@api_router.post("/admin/upload")
async def admin_upload(request: Request, file: UploadFile = File(...)):
    await require_admin(request)
    if file.content_type not in ALLOWED_MEDIA:
        raise HTTPException(status_code=400, detail="Formato não suportado (PNG, JPG, WEBP, SVG ou GIF)")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Arquivo maior que 5 MB")
    fid = await fs_bucket.upload_from_stream(
        file.filename or "imagem", data, metadata={"contentType": file.content_type}
    )
    return {"ok": True, "id": str(fid), "url": f"/api/media/{fid}"}


@api_router.get("/admin/media")
async def admin_media_list(request: Request):
    await require_admin(request)
    items = []
    async for f in db["fs.files"].find({}).sort("uploadDate", -1).limit(200):
        items.append({
            "id": str(f["_id"]),
            "filename": f.get("filename"),
            "contentType": (f.get("metadata") or {}).get("contentType", "image/png"),
            "url": f"/api/media/{f['_id']}",
        })
    return {"ok": True, "items": items}


@api_router.delete("/admin/media/{media_id}")
async def admin_media_delete(media_id: str, request: Request):
    await require_admin(request)
    try:
        await fs_bucket.delete(ObjectId(media_id))
    except Exception:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    return {"ok": True}


@api_router.get("/media/{media_id}")
async def media_get(media_id: str):
    try:
        oid = ObjectId(media_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    try:
        stream = await fs_bucket.open_download_stream(oid)
    except Exception:
        raise HTTPException(status_code=404, detail="Imagem não encontrada")
    data = await stream.read()
    ct = (stream.metadata or {}).get("contentType", "image/png")
    return Response(content=data, media_type=ct, headers={"Cache-Control": "public, max-age=31536000, immutable"})


@app.on_event("startup")
async def seed_admin_user():
    try:
        await db.admin_users.create_index("email", unique=True)
        await db.login_attempts.create_index("identifier")
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
        admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
        existing = await db.admin_users.find_one({"email": admin_email})
        if existing is None:
            await db.admin_users.insert_one({
                "email": admin_email,
                "password_hash": hash_password(admin_password),
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
            })
            logger.info(f"Admin user criado: {admin_email}")
        elif not verify_password(admin_password, existing["password_hash"]):
            await db.admin_users.update_one(
                {"email": admin_email},
                {"$set": {"password_hash": hash_password(admin_password)}},
            )
            logger.info(f"Senha do admin atualizada a partir do .env: {admin_email}")
    except Exception as e:
        logger.error(f"seed_admin: {e}")

# ============ CHATBOT SEMIAUTOMÁTICO DE CAPTAÇÃO DE LEADS ============
import re
from emergentintegrations.llm.chat import LlmChat, UserMessage

CHAT_MODES = {"auto", "semiauto", "manual"}

DEFAULT_CHAT_CONFIG = {
    "mode": "semiauto",
    "welcome": "Olá! Seja bem-vindo à EXEKUTA. Posso ajudar você a identificar oportunidades para melhorar o desempenho orgânico do seu site, atrair visitantes qualificados e desenvolver uma estratégia digital orientada a resultados. O que você gostaria de melhorar?",
    "quickReplies": [
        "Quero melhorar o SEO do meu site.",
        "Preciso aumentar meu tráfego orgânico.",
        "Quero melhorar os conteúdos do meu site ou blog.",
        "Preciso de análise de dados ou automação.",
        "Quero conhecer os serviços da EXEKUTA.",
        "Quero falar com um especialista.",
    ],
    "faqs": [
        {"q": "Quero melhorar o SEO do meu site.", "a": "Ótimo! O diagnóstico da EXEKUTA começa pela leitura do cenário: dados, técnica, conteúdo e concorrência. Me conta: qual é a URL do seu site e qual resultado você espera alcançar?"},
        {"q": "Preciso aumentar meu tráfego orgânico.", "a": "Tráfego orgânico cresce quando estratégia, técnica e conteúdo operam no mesmo fluxo. Me diga qual é o seu objetivo comercial (mais leads, mais vendas, mais autoridade?) e qual é a maior dificuldade hoje."},
        {"q": "Quero melhorar os conteúdos do meu site ou blog.", "a": "Conteúdo eficaz segue a intenção de busca e a jornada comercial. Me conta qual é o site e o que você já produz hoje — assim consigo indicar o próximo passo adequado."},
        {"q": "Preciso de análise de dados ou automação.", "a": "Análise e automação reduzem tarefas manuais e orientam decisões por indicadores. Qual processo hoje consome mais tempo da sua equipe?"},
        {"q": "Quero conhecer os serviços da EXEKUTA.", "a": "Atuamos em 5 pilares: Desenvolvimento; Marketing & Performance (tráfego pago, marketing digital, analytics); SEO & Google (estratégia, técnico, on-page, local, autoridade digital); Automação & IA; e Suporte & Infraestrutura. Qual deles se aproxima do seu cenário?"},
        {"q": "Quero falar com um especialista.", "a": "Sem problemas! Já sinalizei o atendimento humano. Se quiser, deixe seu nome e um e-mail ou WhatsApp — um especialista da EXEKUTA retorna em seguida."},
    ],
}


async def get_chat_config():
    cfg = await db.chat_config.find_one({"key": "chatbot"})
    if not cfg or not cfg.get("data"):
        await db.chat_config.update_one({"key": "chatbot"}, {"$set": {"data": DEFAULT_CHAT_CONFIG}}, upsert=True)
        return DEFAULT_CHAT_CONFIG
    return {**DEFAULT_CHAT_CONFIG, **cfg["data"]}


EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"\+?\d{0,3}[\s-]?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}")
URL_RE = re.compile(r"(https?://[^\s]+|www\.[^\s]+|(?:[a-z0-9-]+\.)+(?:com|com\.br|br|net|org|io|co)(?:/[^\s]*)?)", re.I)
HUMAN_RE = re.compile(r"especialista|humano|atendente|pessoa real|pessoa\b|falar com algu", re.I)
COMMERCIAL_RE = re.compile(r"pre[çc]o|or[çc]amento|proposta|desconto|quanto custa|valor do projeto", re.I)


async def upsert_chat_lead(conv, patch: dict):
    lead = conv.get("lead") or {}
    changed = False
    for k, v in patch.items():
        if v and not lead.get(k):
            lead[k] = v
            changed = True
    lead_id = conv.get("lead_id")
    now = datetime.now(timezone.utc).isoformat()
    if lead_id:
        await db.chat_leads.update_one({"_id": ObjectId(lead_id)}, {"$set": {**lead, "updated_at": now}})
    elif changed:
        doc = {
            "nome": lead.get("nome", ""),
            "empresa": lead.get("empresa", ""),
            "site": lead.get("site", ""),
            "email": lead.get("email", ""),
            "telefone": lead.get("telefone", ""),
            "servico": lead.get("servico", ""),
            "objetivo": lead.get("objetivo", ""),
            "dificuldade": lead.get("dificuldade", ""),
            "prazo": lead.get("prazo", ""),
            "origem": "chatbot",
            "status": lead.get("status", "novo"),
            "consent": lead.get("consent", False),
            "conversation_id": str(conv["_id"]),
            "session_id": conv.get("session_id"),
            "created_at": now,
            "updated_at": now,
        }
        res = await db.chat_leads.insert_one(doc)
        lead_id = str(res.inserted_id)
        await db.chat_conversations.update_one({"_id": conv["_id"]}, {"$set": {"lead_id": lead_id, "lead": {**lead, "status": doc["status"], "consent": lead.get("consent", False)}}})
        return lead, lead_id
    await db.chat_conversations.update_one({"_id": conv["_id"]}, {"$set": {"lead": lead}})
    return lead, lead_id


async def ai_reply(conv, config, user_text):
    api_key = os.environ.get("EMERGENT_LLM_KEY", "")
    if not api_key:
        return None
    try:
        history = "\n".join(
            f"{'Visitante' if m['role'] == 'user' else 'Assistente'}: {m['text']}"
            for m in conv.get("messages", [])[-10:]
        )
        system = (
            "Você é o assistente comercial virtual da EXEKUTA, agência de SEO orientada por dados "
            "(Rio de Janeiro, Brasil). Regras absolutas: responda APENAS em português do Brasil, com no máximo "
            "3 frases curtas e objetivas. Use somente informações verificadas abaixo — NUNCA invente preços, "
            "descontos, prazos, resultados garantidos, estudos de caso, depoimentos ou clientes. Se perguntarem "
            "valores/prazos/proposta, diga que o diagnóstico define o escopo e que um especialista fará essa "
            "conversa. Serviços (5 pilares): Desenvolvimento (sites, landing pages, e-commerce); Marketing & "
            "Performance (tráfego pago, marketing digital, analytics); SEO & Google (estratégia, técnico, "
            "on-page, local, autoridade digital); Automação & IA; Suporte & Infraestrutura (manutenção, "
            "performance, segurança). Método: Diagnóstico → Estratégia → Execução → Monitoramento → Escala. "
            "Próximo passo sempre: solicitar diagnóstico pelo site ou falar com especialista. LGPD: só peça "
            "dados de contato explicando o motivo e com consentimento. Se o visitante pedir atendimento "
            "humano, diga que sinalizou para um especialista.\n\nConversa recente:\n" + history
        )
        chat = LlmChat(api_key=api_key, session_id=f"exk-chat-{conv['_id']}", system_message=system).with_model("openai", "gpt-5.4")
        reply = await chat.send_message(UserMessage(text=user_text))
        return (reply or "").strip()[:900] or None
    except Exception as e:
        logger.warning(f"chatbot IA indisponível: {e}")
        return None


class ChatStartIn(BaseModel):
    sessionId: str


class ChatMessageIn(BaseModel):
    sessionId: str
    text: str


class ChatAdminReply(BaseModel):
    text: str


class ChatModeIn(BaseModel):
    mode: str


class ChatConfigIn(BaseModel):
    data: Any
_rate_limit = {}


@api_router.post("/chat/start")
async def chat_start(input: ChatStartIn):
    sid = (input.sessionId or "")[:64]
    if not sid:
        raise HTTPException(status_code=400, detail="Sessão inválida")
    config = await get_chat_config()
    conv = await db.chat_conversations.find_one({"session_id": sid})
    if not conv:
        doc = {
            "session_id": sid,
            "mode": config.get("mode", "semiauto"),
            "status": "ativo",
            "needs_human": False,
            "lead": {},
            "lead_id": None,
            "messages": [{"role": "bot", "text": config.get("welcome", ""), "at": datetime.now(timezone.utc).isoformat()}],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        res = await db.chat_conversations.insert_one(doc)
        conv = await db.chat_conversations.find_one({"_id": res.inserted_id})
    return {
        "ok": True,
        "conversationId": str(conv["_id"]),
        "mode": conv.get("mode"),
        "messages": conv.get("messages", []),
        "quickReplies": config.get("quickReplies", []),
        "lead": conv.get("lead", {}),
    }


@api_router.post("/chat/message")
async def chat_message(input: ChatMessageIn):
    text = (input.text or "").strip()[:1000]
    if not text:
        raise HTTPException(status_code=400, detail="Mensagem vazia")
    conv = await db.chat_conversations.find_one({"session_id": (input.sessionId or "")[:64]})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversa não encontrada. Recarregue o chat.")
    config = await get_chat_config()
    now = datetime.now(timezone.utc).isoformat()

    # proteção simples contra abuso
    key = conv["session_id"]
    hits = [t for t in _rate_limit.get(key, []) if now[:17] == t[:17]]
    if len(hits) >= 25:
        raise HTTPException(status_code=429, detail="Muitas mensagens em sequência. Aguarde alguns instantes.")
    _rate_limit[key] = hits + [now]

    lead_patch = {}
    if m := EMAIL_RE.search(text):
        lead_patch["email"] = m.group(0)
    if m := URL_RE.search(text.replace("https://", "").replace("http://", "")):
        lead_patch["site"] = m.group(0)
    if m := PHONE_RE.search(text):
        cand = m.group(0)
        if len(re.sub(r"\D", "", cand)) >= 10:
            lead_patch["telefone"] = cand
    lead, lead_id = await upsert_chat_lead(conv, lead_patch)

    update = {"$push": {"messages": {"role": "user", "text": text, "at": now}}, "$set": {"updated_at": now}}
    await db.chat_conversations.update_one({"_id": conv["_id"]}, update)
    conv = await db.chat_conversations.find_one({"_id": conv["_id"]})

    mode = conv.get("mode", "semiauto")
    reply = None
    needs_human = False

    if mode == "manual":
        await db.chat_conversations.update_one({"_id": conv["_id"]}, {"$set": {"needs_human": True}})
        return {"ok": True, "reply": None, "mode": mode, "needsHuman": True, "quickReplies": []}

    if HUMAN_RE.search(text):
        reply = config["faqs"][-1]["a"] if config.get("faqs") else "Já sinalizei o atendimento humano para um especialista da EXEKUTA."
        needs_human = True
        if lead_id:
            await db.chat_leads.update_one({"_id": ObjectId(lead_id)}, {"$set": {"status": "atendimento_humano"}})
    elif COMMERCIAL_RE.search(text):
        reply = "Entendo a intenção! Valores e propostas são definidos pelo time comercial da EXEKUTA depois do diagnóstico — eu não passo valores em nome da agência. Já sinalizei para um especialista continuar essa conversa com você."
        needs_human = True
        await upsert_chat_lead(conv, {"dificuldade": text})
    else:
        best, best_score = None, 0
        for faq in config.get("faqs", []):
            words = [w for w in re.findall(r"[a-zà-ú0-9]{4,}", text.lower()) if w not in {"quero", "preciso", "meu", "minha", "para", "como", "muito"}]
            score = sum(1 for w in words if w in faq["q"].lower())
            if score > best_score:
                best, best_score = faq["a"], score
        if best:
            reply = best
        else:
            reply = await ai_reply(conv, config, text)
        if not reply:
            reply = "Boa pergunta! Não tenho essa resposta aprovada em meu material, mas posso te ajudar com: SEO, conteúdo, tráfego orgânico, análise de dados e automação. Se preferir, sinalizo o atendimento com um especialista da EXEKUTA."
            if mode == "semiauto":
                needs_human = True

    msg_update = {
        "$push": {"messages": {"role": "bot", "text": reply, "at": datetime.now(timezone.utc).isoformat()}},
        "$set": {"needs_human": needs_human, "updated_at": datetime.now(timezone.utc).isoformat()},
    }
    await db.chat_conversations.update_one({"_id": conv["_id"]}, msg_update)
    return {"ok": True, "reply": reply, "mode": mode, "needsHuman": needs_human, "quickReplies": config.get("quickReplies", [])}


@api_router.get("/chat/history/{session_id}")
async def chat_history(session_id: str):
    conv = await db.chat_conversations.find_one({"session_id": session_id[:64]})
    if not conv:
        return {"ok": True, "messages": [], "mode": "semiauto"}
    return {"ok": True, "messages": conv.get("messages", []), "mode": conv.get("mode"), "needsHuman": conv.get("needs_human", False)}


@api_router.get("/admin/chat/config")
async def admin_chat_config(request: Request):
    await require_admin(request)
    return {"ok": True, "config": await get_chat_config()}


@api_router.put("/admin/chat/config")
async def admin_chat_config_save(input: ChatConfigIn, request: Request):
    await require_admin(request)
    data = input.data if isinstance(input.data, dict) else {}
    if data.get("mode") not in CHAT_MODES:
        data["mode"] = "semiauto"
    await db.chat_config.update_one({"key": "chatbot"}, {"$set": {"data": data}}, upsert=True)
    await bump_content_version()
    return {"ok": True}


@api_router.get("/admin/chat/conversations")
async def admin_chat_list(request: Request):
    await require_admin(request)
    out = []
    async for c in db.chat_conversations.find({}).sort("updated_at", -1).limit(200):
        out.append({
            "id": str(c["_id"]),
            "mode": c.get("mode"),
            "needs_human": c.get("needs_human", False),
            "status": c.get("status"),
            "lead": c.get("lead", {}),
            "messages_count": len(c.get("messages", [])),
            "last_message": (c.get("messages") or [{}])[-1].get("text", "")[:120],
            "updated_at": c.get("updated_at"),
        })
    return {"ok": True, "items": out}


@api_router.get("/admin/chat/conversations/{conversation_id}")
async def admin_chat_detail(conversation_id: str, request: Request):
    await require_admin(request)
    c = await db.chat_conversations.find_one({"_id": ObjectId(conversation_id)})
    if not c:
        raise HTTPException(status_code=404, detail="Conversa não encontrada")
    return {
        "ok": True,
        "id": str(c["_id"]),
        "mode": c.get("mode"),
        "needs_human": c.get("needs_human", False),
        "lead": c.get("lead", {}),
        "messages": c.get("messages", []),
    }


@api_router.post("/admin/chat/conversations/{conversation_id}/reply")
async def admin_chat_reply(conversation_id: str, input: ChatAdminReply, request: Request):
    await require_admin(request)
    text = (input.text or "").strip()[:1000]
    if not text:
        raise HTTPException(status_code=400, detail="Resposta vazia")
    now = datetime.now(timezone.utc).isoformat()
    await db.chat_conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$push": {"messages": {"role": "admin", "text": text, "at": now}},
         "$set": {"mode": "manual", "needs_human": False, "updated_at": now}},
    )
    await db.chat_leads.update_one({"conversation_id": conversation_id}, {"$set": {"status": "atendimento_humano"}})
    return {"ok": True}


@api_router.post("/admin/chat/conversations/{conversation_id}/mode")
async def admin_chat_mode(conversation_id: str, input: ChatModeIn, request: Request):
    await require_admin(request)
    if input.mode not in CHAT_MODES:
        raise HTTPException(status_code=400, detail="Modo inválido")
    await db.chat_conversations.update_one(
        {"_id": ObjectId(conversation_id)}, {"$set": {"mode": input.mode, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"ok": True}


@api_router.post("/admin/chat/conversations/{conversation_id}/qualify")
async def admin_chat_qualify(conversation_id: str, request: Request):
    await require_admin(request)
    body = await request.json()
    status = body.get("status")
    if status not in {"qualificado", "nao_qualificado"}:
        raise HTTPException(status_code=400, detail="Status inválido")
    lead_id = None
    conv = await db.chat_conversations.find_one({"_id": ObjectId(conversation_id)}, {"lead_id": 1})
    if conv:
        lead_id = conv.get("lead_id")
    if lead_id:
        await db.chat_leads.update_one({"_id": ObjectId(lead_id)}, {"$set": {"status": status}})
    await db.chat_conversations.update_one({"_id": ObjectId(conversation_id)}, {"$set": {"status": status}})
    return {"ok": True}


@api_router.get("/admin/chat/leads")
async def admin_chat_leads(request: Request, search: str = "", status: str = "", servico: str = ""):
    await require_admin(request)
    query = {}
    if status:
        query["status"] = status
    if servico:
        query["servico"] = {"$regex": re.escape(servico), "$options": "i"}
    if search:
        rx = {"$regex": re.escape(search), "$options": "i"}
        query["$or"] = [{"nome": rx}, {"empresa": rx}, {"site": rx}, {"email": rx}, {"telefone": rx}]
    out = []
    async for l in db.chat_leads.find(query).sort("created_at", -1).limit(500):
        out.append({
            "id": str(l["_id"]),
            "nome": l.get("nome", ""),
            "empresa": l.get("empresa", ""),
            "site": l.get("site", ""),
            "email": l.get("email", ""),
            "telefone": l.get("telefone", ""),
            "servico": l.get("servico", ""),
            "objetivo": l.get("objetivo", ""),
            "dificuldade": l.get("dificuldade", ""),
            "prazo": l.get("prazo", ""),
            "status": l.get("status", "novo"),
            "consent": l.get("consent", False),
            "conversation_id": l.get("conversation_id"),
            "created_at": l.get("created_at"),
        })
    return {"ok": True, "items": out}


@api_router.get("/admin/chat/leads/export")
async def admin_chat_leads_export(request: Request):
    await require_admin(request)
    import csv
    import io
    buf = io.StringIO()
    writer = csv.writer(buf, delimiter=";")
    writer.writerow(["id", "nome", "empresa", "site", "email", "telefone", "servico", "objetivo", "dificuldade", "prazo", "status", "consentimento", "criado_em"])
    async for l in db.chat_leads.find({}).sort("created_at", -1):
        writer.writerow([
            str(l["_id"]), l.get("nome", ""), l.get("empresa", ""), l.get("site", ""),
            l.get("email", ""), l.get("telefone", ""), l.get("servico", ""),
            l.get("objetivo", ""), l.get("dificuldade", ""), l.get("prazo", ""),
            l.get("status", ""), "sim" if l.get("consent") else "não", l.get("created_at", ""),
        ])
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads-exekuta.csv", "Cache-Control": "no-store"},
    )


@api_router.delete("/admin/chat/leads/{lead_id}")
async def admin_chat_lead_delete(lead_id: str, request: Request):
    await require_admin(request)
    l = await db.chat_leads.find_one({"_id": ObjectId(lead_id)})
    if not l:
        raise HTTPException(status_code=404, detail="Lead não encontrado")
    if l.get("conversation_id"):
        await db.chat_conversations.update_one(
            {"_id": ObjectId(l["conversation_id"])},
            {"$set": {"lead": {}, "lead_id": None, "anonimizado": True, "updated_at": datetime.now(timezone.utc).isoformat()}},
        )
    await db.chat_leads.delete_one({"_id": ObjectId(lead_id)})
    return {"ok": True}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
