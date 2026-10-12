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
- Blog próprio com artigos completos (hoje linkam ao site original).
- E-mail transacional (Resend) para resposta automática de contato.
- Painel admin simples para ler contatos recebidos.
