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
