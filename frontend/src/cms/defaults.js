// Conteúdo padrão do site — usado como fallback quando o CMS não tem override.
// Espelha os textos atuais das páginas (não altera visual).

export const BRAND = {
  companyName: "EXEKUTA",
  tagline: "Performance, Estratégia, Resultados",
  logoUrl: "/brand/logo-exekuta-horizontal.png",
  logoFooterUrl: "/brand/logo-exekuta-horizontal.png",
  faviconUrl: "/favicon.svg",
  shortDescription: "Estratégia de SEO, execução técnica e crescimento orientado por dados.",
  instagramUrl: "https://www.instagram.com/exekuta.agencia/",
};

export const FOOTER = {
  address: "Rio de Janeiro · Brasil",
  phone: "+55 21 2038-1079",
  whatsappUrl:
    "https://wa.me/552120381079?text=Ol%C3%A1%2C%20conheci%20a%20EXEKUTA%20pelo%20site%20e%20gostaria%20de%20solicitar%20um%20diagn%C3%B3stico%20de%20SEO.",
  email: "",
  instagramUrl: "https://www.instagram.com/exekuta.agencia/",
  copyright: "© EXEKUTA — Todos os direitos reservados",
  institutionalText: "Estratégia de SEO, execução técnica e crescimento orientado por dados.",
  signatureLine1: "Não fazemos marketing.",
  signatureLine2: "Executamos crescimento.",
};

export const HOME = {
  heroEyebrow: "SEO • Performance • Crescimento",
  heroTitle1: "SEO que gera",
  heroTitle2: "resultados reais.",
  heroLead:
    "Estratégia avançada, execução técnica e foco total em crescimento orgânico para marcas que não querem apenas aparecer — querem ocupar posições, gerar oportunidades e crescer com consistência.",
  heroCta1: "Solicitar diagnóstico",
  heroCta2: "Ver cases",
  showcaseTitle: "Análise, planejamento e execução no mesmo fluxo.",
  showcaseLead:
    "O trabalho de SEO precisa sair da abstração: leitura de cenário, priorização, documentação e acompanhamento contínuo em um mesmo fluxo de execução.",
  showcaseItems:
    "Diagnóstico com leitura técnica e comercial\nPlanejamento com prioridades documentadas\nExecução acompanhada por indicadores e contexto",
  outcomesTitle: "SEO não é apenas posição. É crescimento com direção.",
  outcomesLead:
    "Aparecer é um sinal. O valor surge quando a presença orgânica atrai demanda relevante, sustenta uma experiência clara e contribui para uma ação de negócio.",
  pilaresTitle: "Três pilares. Uma disciplina de crescimento.",
  pilaresLead:
    "A estratégia define a direção. A execução transforma prioridade em entrega. Os resultados realimentam o próximo ciclo.",
  servicesTitle: "Da direção estratégica à melhoria contínua.",
  servicesLead:
    "Cada frente resolve um tipo de barreira. O diagnóstico mostra quais delas realmente merecem prioridade.",
  methodTitle: "Um processo que reduz ruído e aumenta clareza.",
  diffTitle: "Não entregamos tarefas. Construímos performance.",
  diffLead:
    "O trabalho precisa indicar por que uma ação existe, como será validada e qual decisão pode surgir depois dela.",
  casesTitle: "Projetos reais já cadastrados no portfólio.",
  dashTitle: "Menos vaidade. Mais sinal para decidir.",
  dashLead:
    "Visibilidade, páginas estratégicas, saúde técnica e conversões precisam ser lidas em conjunto. O painel demonstra a arquitetura visual sem usar dados de clientes.",
  aboutTitle: "Precisão na análise. Disciplina na execução.",
  aboutLead:
    "A EXEKUTA traduz mecanismos de busca, dados e estratégia digital em uma operação de crescimento orgânico. Um compromisso simples: dar direção ao esforço e contexto aos resultados.",
  insightsTitle: "Conhecimento que melhora a próxima decisão.",
  faqTitle: "Respostas claras para decisões responsáveis.",
  ctaTitle: "Não fazemos marketing. Executamos crescimento.",
  ctaLead:
    "Descubra onde sua empresa está perdendo visibilidade e quais oportunidades podem ser transformadas em crescimento.",
  marqueeItems: "Não fazemos marketing • Executamos crescimento • Estratégia • Execução • Resultados",
  ticker: "Analisar • Planejar • Executar • Medir • Otimizar",
};

export const ABOUT = {
  sobreTitle1: "Execução é o que transforma",
  sobreTitle2: "estratégia em crescimento.",
  sobreLead:
    "A EXEKUTA é uma agência de SEO orientada por dados. Seu posicionamento une análise profunda, execução técnica e acompanhamento responsável para transformar visibilidade em crescimento com direção.",
  nomeLead1:
    "A marca expressa capacidade de execução. Não basta identificar uma oportunidade ou apresentar um gráfico: o valor aparece quando a estratégia se transforma em prioridade clara, implementação consistente e aprendizado mensurável.",
  nomeLead2:
    "Por isso, a comunicação evita promessas absolutas e concentra atenção no processo que pode ser controlado: analisar, planejar, executar, medir e otimizar.",
  fundadorBio:
    "À frente da EXEKUTA, Alessandro une análise profunda, execução técnica e acompanhamento responsável — uma abordagem que conecta SEO ao negócio, garantindo que cada ação tenha um papel definido dentro de uma arquitetura e jornada.",
};

export const PLANOS = [
  {
    id: "bronze",
    nome: "Bronze",
    preco: "R$ 890/mês",
    destaque: false,
    entregas: [
      "Diagnóstico e Auditoria Técnica Inicial",
      "SEO Técnico: tags, meta-descrições, sitemap, Schema.org e mobile",
      "Relatórios periódicos de métricas e posicionamento",
    ],
  },
  {
    id: "prata",
    nome: "Prata",
    preco: "R$ 1.490/mês",
    destaque: false,
    entregas: [
      "Diagnóstico e Auditoria Técnica Inicial",
      "SEO Técnico: tags, meta-descrições, sitemap, Schema.org e mobile",
      "Estratégia de Conteúdo e Palavras-Chave",
      "Relatórios periódicos de métricas e posicionamento",
    ],
  },
  {
    id: "ouro",
    nome: "Ouro",
    preco: "R$ 2.490/mês",
    destaque: true,
    entregas: [
      "Diagnóstico e Auditoria Técnica Inicial",
      "SEO Técnico: tags, meta-descrições, sitemap, Schema.org e mobile",
      "Estratégia de Conteúdo e Palavras-Chave",
      "Link Building",
      "Relatórios periódicos de métricas e posicionamento",
    ],
  },
  {
    id: "diamante",
    nome: "Diamante",
    preco: "R$ 3.990/mês",
    destaque: false,
    entregas: [
      "Diagnóstico e Auditoria Técnica Inicial",
      "SEO Técnico: tags, meta-descrições, sitemap, Schema.org e mobile",
      "Estratégia de Conteúdo e Palavras-Chave",
      "Link Building",
      "Otimização para IA e buscas generativas (AEO/GEO)",
      "Relatórios periódicos de métricas e posicionamento",
    ],
  },
];
