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
