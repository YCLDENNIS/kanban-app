export const personalInfo = {
  name: "Peace Maker",
  title: "DC 影集英雄 · 和平使者 (Christopher Smith)",
  subtitle: "I cherish peace with all my heart. No matter what it takes.",
  status: "🕊️ 正在執行和平守護任務中",
  location: "Project Butterfly · 美國",
  email: "peacemaker@projectbutterfly.dc",
  phone: "+1 (555) 019-PEACE",
  avatar: "/peacemaker.jpg",
  bioShort: "全心全意珍視和平的 DC 超級英雄。配備多功能特製鍍鉻頭盔與極限戰術身手，以及最忠誠的白頭海鵰搭檔 Eagly。",
  bioDetailed: [
    "嗨！我是 Christopher Smith，但大家通常直接稱呼我為「Peace Maker（和平使者）」。",
    "作為 DC 同名影集的靈魂主角，我擁有多頂特製的鍍鉻頭盔（包含聲波脈衝、X光掃描、力場防護等超強戰術功能），以及一隻甚至懂得給人擁抱的忠誠寵物鷹 Eagly！",
    "在經歷了自殺突擊隊與 Project Butterfly 的各項極限任務後，我結識了 11th Street Kids 團隊，深刻體會到信念、友誼與救贖的真諦。只要世界需要和平，我隨時準備好挺身而出！"
  ],
  stats: [
    { label: "特製戰術頭盔", value: "8+", unit: "頂" },
    { label: "全球和平守護", value: "100%", unit: "" },
    { label: "最佳搭檔", value: "Eagly", unit: "老鷹" },
    { label: "熱血重金屬魂", value: "100%", unit: "" }
  ],
  socials: [
    { name: "GitHub", url: "https://github.com", icon: "Github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
    { name: "Email", url: "mailto:peacemaker@projectbutterfly.dc", icon: "Mail" },
    { name: "X (Twitter)", url: "https://twitter.com", icon: "Twitter" }
  ]
};

export const skillsData = [
  {
    category: "前端開發 (Frontend)",
    icon: "Layout",
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript / JavaScript", level: 90 },
      { name: "Tailwind CSS / SCSS", level: 90 },
      { name: "Vue.js / Nuxt", level: 75 },
      { name: "State Management (Redux/Zustand)", level: 85 },
      { name: "Web Performance & SEO", level: 85 }
    ]
  },
  {
    category: "後端與雲端 (Backend & Cloud)",
    icon: "Server",
    skills: [
      { name: "Node.js / Express / NestJS", level: 88 },
      { name: "Python / FastAPI", level: 80 },
      { name: "PostgreSQL / MySQL / MongoDB", level: 85 },
      { name: "RESTful API / GraphQL", level: 90 },
      { name: "Docker / CI/CD Pipeline", level: 80 },
      { name: "AWS / Vercel Cloud Services", level: 80 }
    ]
  },
  {
    category: "工具與工作流 (Tools & Workflow)",
    icon: "Wrench",
    skills: [
      { name: "Git / GitHub Actions", level: 90 },
      { name: "Vite / Webpack", level: 85 },
      { name: "Figma / UI Prototyping", level: 78 },
      { name: "Jest / Vitest / Playwright", level: 80 },
      { name: "Agile / Scrum 開發敏捷", level: 85 }
    ]
  }
];

export const projectsData = [
  {
    id: 1,
    title: "OmniFlow - 團隊敏捷協作與知識庫平台",
    description: "結合即時協同編輯、看板任務管理與 AI 智慧摘要的一站式工作空間，支援數千人團隊高併發溝通。",
    tags: ["React", "TypeScript", "Node.js", "WebSocket", "Tailwind CSS", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com/project1",
    githubUrl: "https://github.com/example/omniflow",
    featured: true
  },
  {
    id: 2,
    title: "ApexPay - 現代化多幣別金融數據儀表板",
    description: "高互動性財務分析儀表板，具備毫秒級市場匯率串接、資產分佈視覺化圖表與自動化警報機制。",
    tags: ["React", "Chart.js", "FastAPI", "Redis", "Docker"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com/project2",
    githubUrl: "https://github.com/example/apexpay",
    featured: true
  },
  {
    id: 3,
    title: "DevPulse - 開發者智慧程式碼審查助手",
    description: "利用大型語言模型進行自動化 PR 審查、安全弱點分析與程式碼重構建議的開發者生產力工具。",
    tags: ["React", "Python", "OpenAI API", "GitHub API", "Vite"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com/project3",
    githubUrl: "https://github.com/example/devpulse",
    featured: true
  },
  {
    id: 4,
    title: "Zenith Commerce - 極速響應式精品電商平台",
    description: "具備無頭電商（Headless CMS）架構、首頁秒開 SSR 優化與客製化購物車體驗。",
    tags: ["Next.js", "Stripe", "GraphQL", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    demoUrl: "https://example.com/project4",
    githubUrl: "https://github.com/example/zenith-commerce",
    featured: false
  }
];

export const experienceData = [
  {
    role: "資深全端工程師 (Senior Full Stack Engineer)",
    company: "星創雲端數位科技 (NovaTech Cloud)",
    period: "2023 - 至今",
    location: "台北，台灣",
    description: "主導核心 SaaS 產品架構現代化重構，帶領 5 人前端團隊優化核心頁面加載速度 45%，並建立端對端自動化測試流程。",
    highlights: ["導入 React 19 與微前端架構", "建置微服務 RESTful & GraphQL 閘道器", "輔導初中階工程師程式碼品質"]
  },
  {
    role: "前端工程師 (Frontend Developer)",
    company: "群曜數位互動 (Synapse Interactive)",
    period: "2021 - 2023",
    location: "台北，台灣",
    description: "負責多個大型企業客戶的 Web 應用系統開發，設計高擴展性的 UI Design System 元件庫，提升後續團隊交付效率 30%。",
    highlights: ["實作動態視覺化數據儀表板", "全面重構舊有專案遷移至 TypeScript", "與 UI/UX 設計師協同打造元件規範"]
  },
  {
    role: "資訊工程學士 (B.S. in Computer Science)",
    company: "國立大學資訊工程學系",
    period: "2017 - 2021",
    location: "台灣",
    description: "主修軟體工程、分散式系統與人機介面互動。在學期間連續兩年榮獲全國大專黑客松優等獎。",
    highlights: ["畢業專題獲得校級最佳設計獎", "擔任校內技術社團創辦人兼講師"]
  }
];
