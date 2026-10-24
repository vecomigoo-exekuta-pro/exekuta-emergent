# PRD — EXEKUTA (Redesign Editorial)

## Problem statement
"https://exekuta.com.br/ com base desse site recrie com todas as paginas, quero um site novo e mais bonito" — recreate the EXEKUTA site (Brazilian data-driven SEO agency) with all pages, in a more beautiful modern execution. User confirmed: "sim, mas bonito".

## Art direction
Swiss high-contrast monochrome editorial: black #000, white, acid accent #E2FE00. Bricolage Grotesque (display; trocada de Syne por ficar esticada — feedback do usuário) + Archivo (body) + JetBrains Mono (labels). Grain overlay, hairline borders, outlined display numbers, kinetic hero with masked line-by-line reveal, slow editorial marquee, lenis smooth scroll, framer-motion reveals, hero parallax + rotating X mark (original SVG logo, also favicon).

## User personas
- Dono de PME no Rio de Janeiro buscando visibilidade no Google → quer diagnóstico.
- Visitante avaliando agência → navega serviços, cases, sobre (fundador) e insights.

## Pages / routes
1. `/` Home — hero cinético, marquee, 3 pilares, prévia de serviços (5 pilares), faixa de imagem com parallax, método (5 etapas), diferenciais, FAQ acordeão, CTA.
2. `/servicos` — 5 categorias com todos os serviços reais (Desenvolvimento / Marketing & Performance / SEO & Google / Automação & IA / Suporte & Infraestrutura).
3. `/sobre` — missão, 6 valores, método detalhado, fundador Alessandro Pimentel (CEO & Founder).
4. `/cases` — 8 cases reais (Wishclean, Rio Quadras, Terraplanagem Rio, Sinteko, Loca Rental, Rio Pintura, Rio Elétrica, Synteco) com link para o site original.
5. `/insights` — 3 artigos reais linkando para os originais.
6. `/contato` — formulário (Nome, E-mail, WhatsApp, Empresa, Mensagem, LGPD) + WhatsApp + telefone +55 21 2038-1079.

## Backend
- FastAPI `POST /api/contato` → grava em MongoDB (collection `contatos`), validação Pydantic. Testado via curl e via UI (toast de sucesso).

## Implemented (2026-10-12)
- Todas as 6 páginas + navbar glass + menu mobile fullscreen + footer com wordmark gigante + botão flutuante de WhatsApp.
- Lenis smooth scroll, framer-motion reveals, marquee, parallax de hero e de imagem.
- Formulário de contato end-to-end (UI → API → MongoDB).
- Favicon SVG original (marca X angular) + logo no navbar/footer.

## Implemented (2026-10-12, 2a iteração)
- Página de detalhe por case em `/cases/:slug` com Desafio / Solução / Resultados (conteúdo real dos cases publicados), tags de serviços, domínio quando confirmado, link para a publicação original, navegação "próximo case" e CTA final.
- Cards da listagem de cases agora abrem a página interna do case (antes: link externo).

## Implemented (2026-10-12, 3a iteração — base premium do usuário)
- Identidade oficial adotada do pacote exekuta-site-premium: verde #B7FF00, fundo #050605, logos oficiais (horizontal, angular, símbolo circular no favicon) e capturas reais de cases.
- Novas páginas: /metodo, /diagnostico (formulário completo → POST /api/diagnostico), /analise-seo (analisador SEO real → POST /api/seo/analyze, 10 verificações + score), /servicos/:slug (6 detalhes), /insights/:slug (3 artigos completos do pacote), 404.
- Home reconstruída na estrutura do pacote: hero com analisador rápido, ticker Analisar→Otimizar, marquee, showcases, outcomes, pilares, 6 serviços, método, diferenciais, cases com screenshots, painel de performance SVG, FAQ (7 perguntas reais), CTA.
- Conteúdo 100% real do pacote (manifesto "Não fazemos marketing. Executamos crescimento.", Instagram @exekuta.agencia).

## Implemented (2026-10-12, 4a iteração — imagens reais de serviços)
- Fotos reais (Unsplash) nos 6 serviços de SEO (cards da home e de /servicos em grayscale com cor no hover), faixa de imagem nos detalhes /servicos/:slug e imagem por categoria no catálogo completo (5 pilares). 11 imagens verificadas carregando, nenhuma quebrada.

## Implemented (2026-10-12, 5a iteração — vídeo no hero)
- Hero da home com vídeo de fundo (equipe trabalhando, stock Pexels): WebM/VP9 (1,9 MB) + MP4/H.264 de fallback, servidos localmente, autoplay mudo em loop, poster e overlays escuros + grid para legibilidade. Reprodução verificada (currentTime avançando).

## Bugfix (2026-10-12) — "Link is not defined" no build de produção
- Causa: Contato.jsx e Insights.jsx usavam `Link` / `ArrowUpRight` sem importação (quebrou o build minificado).
- Correção: importações adicionadas; auditoria completa com oxlint (0 erros no src) e `yarn build` de produção executado com sucesso (EXIT:0). Nota: react-router-dom instalado na v7.18.4 — API compatível (BrowserRouter/Routes/Route/Link/NavLink/useParams/useSearchParams), sem conflito com react-scripts 5.0.1 + CRACO 7.1.0. deployment_agent: PASS, sem blockers.

## Implemented (2026-10-12, 6a iteração — CMS administrativo)
- Painel protegido em /admin (login JWT 12h, bcrypt, lockout 5 tentativas/15min; seed admin via .env; credenciais em test_credentials.md).
- CMS com fallback: GET /api/cms/public (Cache-Control 60s + sessionStorage 5min) entrega overrides por escopo (brand, footer, home, about, faq, services, cases); sem override, o site usa os textos atuais estáticos como padrão — visual, rotas e SEO intactos.
- Editores: Marca (nome, descrição, logo, logo rodapé, favicon, Instagram), Rodapé (endereço, telefone, WhatsApp, e-mail, redes, copyright, textos), Home (hero, ticker, marquee, títulos/leads de todas as seções, checklist), Sobre, FAQ (adicionar/remover/ordenar), Serviços (nome, descrição, imagem, ordem, ativar/desativar, criar), Cases (criar/editar, imagem, descrição, ordem, ativar/desativar).
- Biblioteca de imagens: upload ≤5MB (PNG/JPG/WEBP/SVG/GIF) em GridFS servido em /api/media/{id} com cache imutável; picker "Biblioteca" nos campos de imagem.
- Backup automático: cada salvamento arquiva a versão anterior em cms_backups (aba Backup lista e restaura; restaurar também gera backup).
- deployment_agent: PASS. Site público verificado idêntico após CMS (hero, marquee, 6 serviços, 7 FAQs, cases).

## Bugfix (2026-10-12) — cache de conteúdo não atualizava
- Causa: cache de 5 min no navegador (sessionStorage) + resposta cacheável seguravam edições do CMS.
- Correção: /api/cms/public agora é no-store e devolve versão incrementada a cada salvamento/restauração; frontend busca sempre fresco por carregamento de página (site continua renderizando estático na hora — SEO/perf mantidos); botão "Publicar atualizações" no painel incrementa a versão sob demanda. Testado: v 0→1 no PUT, →2 no clear, toast de confirmação.
- Nota de operação: edições feitas no preview não vão para o site no ar (bancos separados); para editar conteúdo no site ao vivo, use o /admin do próprio site no ar.

## Implemented (2026-10-14 — PWA instalável "Ex Pro")
- Manifesto (name/short_name "Ex Pro", standalone, fundo #050605, ícones any + maskable 192/512 gerados da logo oficial do site, atalhos para Diagnóstico e Análise SEO).
- Service worker (public/sw.js, cache expro-v1): precache do shell; navegação network-first com fallback offline; assets do site cache-first; /api/ e vídeos sempre pela rede (CMS e formulários nunca ficam presos em cache). Registro via script no index.html.
- index.html ajustado: manifest, theme-color #050605, apple-touch-icon, metas iOS/Android.
- Verificado no preview: SW ativado, manifesto válido com 4 ícones, design público intocado.

## Implemented (2026-10-16 — identidade visual oficial aplicada)
- Paleta exata da marca em todos os tokens: fundo #050708 (Preto Carbono), superfícies/cards/painéis #101415 (Grafite Tecnológico), acento #B7FF00 (Verde Neon, CTAs/links/destaques), textos principais #F5F5F5 (Branco Claro), textos secundários #8A8F91 (Cinza Técnico — todos os tons zinc substituídos).
- Nova logo oficial "EX.EKUTA — Agência de SEO" (enviada pelo usuário) aplicada no menu, rodapé e arte do hero. Verificado computacionalmente: body rgb(5,7,8), cards rgb(16,20,21), h1 rgb(245,245,245), acentos rgb(183,255,0), sem overflow desktop/mobile.

## Bugfix (2026-10-16) — salvamento de imagens no painel
- Causa: MediaPicker usava `require()` inválido no bundle do navegador (quebrava a aba Marca e os campos de imagem) e não havia upload direto no campo.
- Correção: MediaPicker reescrito com 3 formas — colar URL, "Enviar do computador" (upload imediato → URL aplicada) e Biblioteca; preview com fundo xadrez para transparência PNG/SVG; hint de formatos; botão Remover. Aplicado a TODOS os campos de imagem (logo principal, logo rodapé, favicon, serviços, cases). Backend aceita image/jpg também.
- Testado no navegador: upload de PNG aplicou a URL no campo automaticamente, salvou com backup, e /api/cms/public refletiu; SVG também testado. Restaurado o brand com a logo oficial. deployment_agent: PASS.

## Implemented (2026-10-16, 2a iteração — chatbot semiautomático de leads)
- Widget flutuante no site (ícone discreto acima do WhatsApp): boas-vindas, opções rápidas, indicador de digitação, histórico persistente no MongoDB (sobrevive a reload), aviso "Assistente virtual" e LGPD; respota do WhatsApp não alterada (reposicionado 0,5rem acima).
- Modos automático/semiautomático (padrão)/manual controláveis por conversa no painel; modo manual pausa o bot; respostas comerciais (preço/orçamento) sempre sinalizam especialista.
- IA gpt-5.4 (EMERGENT_LLM_KEY no servidor via .env, emergentintegrations) com prompt restrito ao material verificado — sem inventar preços/prazos/resultados; fallback para respostas predefinidas se IA indisponível.
- Captação progressiva: e-mail, telefone e URL extraídos por regex; lead criado no MongoDB (nome, empresa, site, e-mail, telefone, serviço, objetivo, dificuldade, prazo, status, consentimento LGPD, histórico da conversa).
- Painel: aba Chatbot (Conversas com resposta como especialista + mudança de modo + qualificação; Leads com busca/filtros/export CSV/exclusão de dados pessoais; Configuração com modo, mensagem inicial e FAQs aprovadas).
- Testado: fluxo completo por API (start → FAQ → captura → comercial sinaliza humano → manual bloqueia bot → admin responde → CSV) e por navegador (widget mobile, painel desktop). Site público sem alterações visuais.

## Backlog (P2+)
- Analisador de 10 páginas com relatório (pacote usa Supabase; versão atual analisa 1 página).
- Páginas legais (Privacidade, Termos, Cookies) do pacote.
- E-mail transacional (Resend) para resposta automática de contatos.
- Painel admin simples para ler contatos e diagnósticos recebidos.

## Bugfix (2026-10-17) — desbloqueio do chatbot
- Erro de lint bloqueante corrigido: `Input` não estava importado em ChatbotPanel.jsx (o componente já existia em FieldsEditor.jsx; adicionado ao import). Projeto inteiro com oxlint: 0 erros.
- Melhoria de captação: HUMAN_RE agora reconhece "pessoa" além de "pessoa real" — mensagens como "quero falar com uma pessoa" setam needs_human e exibem a faixa "SINALIZADO PARA ATENDIMENTO HUMANO" no widget (antes a resposta prometia o especialista, mas o painel não destacava a conversa).
- Verificado por API (start → FAQ responde → humano sinalizado → conversas no /admin com 1 lead visível) e por screenshot desktop (1440px) + mobile (390px): widget abre, responde, sinaliza, sem overflow e sem alteração no design público.

## Implemented (2026-10-17 — Loja de Artes Gráficas)
- Decisões do usuário: catálogo + pedido via WhatsApp (sem pagamento online), produtos digitais E impressos físicos, carrinho completo, gestão no /admin. Subdomínio: loja nasce em /loja; após o Deploy, apontar loja.exekuta.com.br no DNS.
- Backend (server.py, seção LOJA): GET /api/loja/products + /{slug} + /config (público); POST /api/loja/order (recalcula preços no servidor, valida LGPD/nome/WhatsApp/endereço condicional para impressos, gera código EXK-XXXX sequencial e link wa.me com resumo completo); admin Bearer: CRUD de produtos (slug único com índice, tipo digital|fisico, preço, preço promocional, ordem, ativo, imagem via MediaPicker, arquivo de entrega), GET/PUT config (nome_loja, whatsapp), lista de pedidos + mudança de status (novo|pago|producao|entregue|cancelado). 4 produtos de exemplo semeados no startup se coleção vazia.
- Frontend: /loja (LojaPage: hero, filtros Todos/Digitais/Impressos, grid, modal de produto com quantidade); CartContext (localStorage); CartDrawer (carrinho → checkout com endereço condicional e LGPD → sucesso com código + botão wa.me). Link "LOJA" no menu (NAV). Menu desktop agora xl (>=1280px) para acomodar o 8º link; abaixo disso, menu mobile em tela cheia.
- Admin: aba Loja com Produtos/Pedidos/Configuração.
- Testes: 19/19 pytest em /app/backend/tests/test_loja.py; fluxos Playwright 100% (catálogo, filtros, modal, carrinho+persistência, checkout digital e físico, sucesso com wa.me, admin CRUD+status, nav 1440/1024/390 sem overflow). Resíduos de teste limpos (0 pedidos, 4 produtos).

## Backlog (P2+) — atualizado 2026-10-17
- Modularizar server.py (1188 linhas): mover bloco LOJA para /app/backend/routers/loja.py.
- Pagamento online na loja (Stripe/Pix) se o usuário quiser depois.
- Entrega automática de arquivos digitais após confirmação de pagamento.
- Analisador de 10 páginas com relatório; páginas legais; e-mail transacional (Resend); painel de contatos/diagnósticos.

## Implemented (2026-10-23 — Atualização completa de SEO, domínio confirmado: https://www.exekuta.com.br)
- Head estático (public/index.html): title/description da home, canonical, robots, OG completo (og-exekuta.jpg 1200x630), Twitter card, JSON-LD Organization+WebSite, noscript com conteúdo real, apple-mobile-web-app-title corrigido ("Ex Pro"→"EXEKUTA"), lang pt-BR.
- SEO por rota sem novas dependências: src/components/Seo.jsx (title/description/canonical/robots/og/twitter no cliente; prerender de bots captura no deploy) + wrapper Meta no App.js com constantes *_SEO para todas as rotas estáticas; ServicoDetail/CaseDetail/ArtigoDetail com meta por item e noindex em não-encontrado; noindex em /admin e 404.
- Nova página /criacao-de-sites (Criação de Sites Profissionais no Rio de Janeiro): hero, tipos (institucional/landing/e-commerce), problema/para quem, processo 4 passos, FAQ visível (4 Q&As), CTA; JSON-LD @graph Service+BreadcrumbList+FAQPage; links internos do Footer e do catálogo /servicos (item Criação de Sites → href /criacao-de-sites).
- SEO técnico: robots.txt (grupos * + crawlers de IA, Disallow /api/ e /admin, Sitemap), sitemap.xml com 28 URLs (rotas estáticas + 8 cases + 3 insights, sem URLs de preview), llms.txt. Títulos exclusivos por rota verificados (24 rotas, zero duplicatas); /servicos/seo-tecnico = "Otimização de Sites e SEO Técnico | EXEKUTA", /servicos/seo-local = "SEO Local no Rio de Janeiro | EXEKUTA" (rotas existentes usadas, evitando canibalização com novas páginas).
- Testes: testing agent iter 2 (24 rotas, noindex 100%, JSON-LD sem invenções, sem overflow 1440/390, regressão de contato/análise/loja/chatbot/admin OK). Pendências externas: redeploy + toggle de prerender de bots + Google Search Console.

## Implemented (2026-10-24 — Planos de Gestão de Sites com SEO)
- Decisão do usuário: preços de exemplo mensais editáveis (Bronze R$ 890/mês, Prata R$ 1.490/mês, Ouro R$ 2.490/mês, Diamante R$ 3.990/mês) — todos editáveis no /admin sem depender do agente.
- Distribuição progressiva das 6 entregas: Bronze = Diagnóstico/Auditoria + SEO Técnico (tags, meta, sitemap, Schema.org, mobile) + Relatórios; Prata = +Estratégia de Conteúdo e Palavras-Chave; Ouro = +Link Building (selo Destaque); Diamante = +Otimização para IA e buscas generativas (AEO/GEO).
- Home: seção home-planos entre FAQ e CTA (4 cards resumidos, link +N entregas → /planos-seo, CTA proposta → /contato). Página /planos-seo: hero, 4 cards completos, nota de escopo, CTA diagnóstico/análise; JSON-LD OfferCatalog (4 Offers BRL) + BreadcrumbList; title/canonical únicos; sitemap 29 URLs; llms.txt; footer link "Planos de SEO".
- Admin: aba Planos (PlanosEditor) edita nome/preço/destaque/entregas (uma por linha) via escopo CMS "planos" (CMS_SCOPES atualizado no server.py), com backup automático de versão.
- Testes: testing agent iter 3 — 100% backend e frontend, zero bugs; edição admin→site→reversão validada (v25→v26 restaurado). CMS atual: v26 com valores originais.
