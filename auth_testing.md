# Auth Testing Playbook — EXEKUTA Admin CMS

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.admin_users.find().pretty()          # admin seed com hash bcrypt ($2b$)
db.cms_content.find({scope:"home"})     # overrides do CMS
db.cms_backups.find().sort({backup_at:-1})  # backups automáticos
```
Indexes: admin_users.email (unique), login_attempts.identifier.

## Step 2: API Testing
```
# login do admin (retorna token JWT 12h)
curl -s -X POST {API}/api/admin/login -H "Content-Type: application/json" \
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'

# endpoint protegido
TOKEN=...
curl -s {API}/api/admin/me -H "Authorization: Bearer $TOKEN"

# salvar override (gera backup da versão anterior)
curl -s -X PUT {API}/api/admin/cms/home -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"data":{"heroLead":"novo texto"}}'

# público com cache
curl -s -D- {API}/api/cms/public | head -20   # Cache-Control: public, max-age=60

# upload de imagem (GridFS) + listagem + deleção
curl -s -X POST {API}/api/admin/upload -H "Authorization: Bearer $TOKEN" -F "file=@/path/img.png"
curl -s {API}/api/admin/media -H "Authorization: Bearer $TOKEN"
```

## Step 3: Frontend
- /admin sem token → tela de login; com token → painel com abas (Marca, Rodapé, Home, Sobre, FAQ, Serviços, Cases, Imagens, Backup).
- Site público busca /api/cms/public (cache 60s + sessionStorage 5min) e faz merge sobre o conteúdo estático (fallback padrão).
