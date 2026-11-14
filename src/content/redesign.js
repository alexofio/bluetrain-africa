/**
 * Copy for the 2026 redesign sections (menu, Bluetrain Way, departures, creators, journey).
 * English and Swahili share one shape. Have a native-speaking editor review the Swahili before launch.
 */
export const whatsapp = { label: "+255 718 003 368", href: "https://wa.me/255718003368" };

const en = {
  menu: {
    open: "Open menu",
    close: "Close menu",
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Creators", href: "#creators" },
      { label: "Informed", href: "#/informed" },
    ],
    secondary: [
      { label: "Markets", href: "#where" },
      { label: "Company profile", href: "/company-profile/" },
      { label: "All case studies", href: "#/work" },
      { label: "Careers", href: "mailto:info@bluetrain.co.tz?subject=Careers" },
      { label: "Client portal ↗", href: "https://portal.bluetrain.africa", external: true },
    ],
    talk: "Talk to us",
    latest: "Latest case study",
    read: "Read the case study",
    whatsapp: "WhatsApp",
  },
  hero: { kicker: "● Departure · Dar es Salaam · Since 2021" },
  way: {
    kicker: "● The Bluetrain way",
    live: "In progress",
    cards: [
      { client: "UNICEF", title: "First Foods Tanzania", body: "A 14-month demand-generation campaign for child nutrition, Aug 2026 – Sep 2027." },
      { client: "Equinor", title: "Tanzania LNG listening", body: "Social listening and media monitoring through a live client dashboard." },
      { client: "TBL · Castle Lite", title: "Castle Lite Unlocks 2026", body: "A unique-code promotion with weekly draws and live campaign reporting." },
    ],
  },
  departures: {
    kicker: "● Outcomes, not outputs",
    heading: "Departures.",
    active: "Active campaigns · live from the Bluetrain Portal",
    site: "Campaign site ↗",
  },
  creators: {
    kicker: "● Creators · Next Gen Influencer",
    heading: "People influence people.",
    body: "We match brands with creators who move their audience — from micro-influencer platforms to nationwide partnerships, managed end to end.",
    request: "Request creators",
    signup: "Creator sign-up · coming soon",
    reels: [
      { tag: "Influencer management", title: "Wakishua wa Tigo", body: "A nationwide youth platform voiced by five micro-influencers." },
      { tag: "Creator partnership", title: "Shell Tanzania × creator", body: "The right creator meets the right brand." },
      { tag: "Brand localisation", title: "Jack Daniel's · Make It Count", body: "Localisation, creative and influencer management." },
    ],
    roster: "Next Gen Influencer roster · coming soon",
  },
  journey: {
    kicker: "● The journey so far · About",
    heading: "Built in Tanzania. Thinking regionally.",
    timeline: [
      { year: "2021", text: "Founded in Dar es Salaam" },
      { year: "2023", text: "Brought Seebait and Eskimi together on one platform" },
      { year: "2024", text: "Expanded to Kenya" },
      { year: "2025", text: "Expanded to South Africa" },
      { year: "2026", text: "New home at Dar Village Office Park" },
      { year: "2026–27", text: "Stanford Seed Transformation Program" },
    ],
    valuesLabel: "Our five values",
    values: ["Peace of Mind", "Diligence in Service", "Honesty & Transparency", "Care & Empathy", "Curiosity"],
    crewLabel: "The crew",
    partnersLabel: "Partners",
  },
  budget: { label: "Currency", note: "Shown in your market's currency; switch to USD any time. Indicative bands." },
  footer: { whatsapp: "WhatsApp" },
};

const sw = {
  menu: {
    open: "Fungua menyu",
    close: "Funga menyu",
    links: [
      { label: "Kazi", href: "#work" },
      { label: "Huduma", href: "#services" },
      { label: "Kuhusu", href: "#about" },
      { label: "Watayarishi", href: "#creators" },
      { label: "Informed", href: "#/informed" },
    ],
    secondary: [
      { label: "Masoko", href: "#where" },
      { label: "Wasifu wa kampuni", href: "/company-profile/" },
      { label: "Kazi zote", href: "#/work" },
      { label: "Ajira", href: "mailto:info@bluetrain.co.tz?subject=Careers" },
      { label: "Portal ya wateja ↗", href: "https://portal.bluetrain.africa", external: true },
    ],
    talk: "Ongea nasi",
    latest: "Kazi ya hivi karibuni",
    read: "Soma zaidi",
    whatsapp: "WhatsApp",
  },
  hero: { kicker: "● Kuondoka · Dar es Salaam · Tangu 2021" },
  way: {
    kicker: "● Njia ya Bluetrain",
    live: "Inaendelea",
    cards: [
      { client: "UNICEF", title: "First Foods Tanzania", body: "Kampeni ya miezi 14 ya kuhamasisha lishe ya watoto, Ago 2026 – Sep 2027." },
      { client: "Equinor", title: "Ufuatiliaji wa Tanzania LNG", body: "Ufuatiliaji wa mitandao ya kijamii na vyombo vya habari kupitia dashibodi hai." },
      { client: "TBL · Castle Lite", title: "Castle Lite Unlocks 2026", body: "Promosheni ya misimbo ya kipekee yenye droo za kila wiki na ripoti hai." },
    ],
  },
  departures: {
    kicker: "● Matokeo, si kazi tu",
    heading: "Safari zetu.",
    active: "Kampeni zinazoendelea · moja kwa moja kutoka Bluetrain Portal",
    site: "Tovuti ya kampeni ↗",
  },
  creators: {
    kicker: "● Watayarishi · Next Gen Influencer",
    heading: "Watu huwashawishi watu.",
    body: "Tunaunganisha chapa na watayarishi wanaogusa hadhira yao — kuanzia majukwaa ya washawishi wadogo hadi ushirikiano wa kitaifa, tukisimamia kila hatua.",
    request: "Omba watayarishi",
    signup: "Usajili wa watayarishi · inakuja hivi karibuni",
    reels: [
      { tag: "Usimamizi wa washawishi", title: "Wakishua wa Tigo", body: "Jukwaa la vijana la kitaifa likiongozwa na washawishi wadogo watano." },
      { tag: "Ushirikiano na mtayarishi", title: "Shell Tanzania × mtayarishi", body: "Mtayarishi sahihi akutana na chapa sahihi." },
      { tag: "Kuifanya chapa iwe ya kienyeji", title: "Jack Daniel's · Make It Count", body: "Ubunifu, tafsiri na usimamizi wa washawishi." },
    ],
    roster: "Orodha ya Next Gen Influencer · inakuja hivi karibuni",
  },
  journey: {
    kicker: "● Safari yetu · Kuhusu",
    heading: "Tumejengwa Tanzania. Tunafikiri kikanda.",
    timeline: [
      { year: "2021", text: "Ilianzishwa Dar es Salaam" },
      { year: "2023", text: "Tuliunganisha Seebait na Eskimi kwenye jukwaa moja" },
      { year: "2024", text: "Tulipanuka hadi Kenya" },
      { year: "2025", text: "Tulipanuka hadi Afrika Kusini" },
      { year: "2026", text: "Ofisi mpya Dar Village Office Park" },
      { year: "2026–27", text: "Stanford Seed Transformation Program" },
    ],
    valuesLabel: "Maadili yetu matano",
    values: ["Amani ya Moyo", "Bidii katika Huduma", "Uaminifu na Uwazi", "Kujali na Huruma", "Udadisi"],
    crewLabel: "Timu yetu",
    partnersLabel: "Washirika",
  },
  budget: { label: "Sarafu", note: "Inaonyeshwa kwa sarafu ya soko lako; badilisha kuwa USD wakati wowote. Viwango ni makadirio." },
  footer: { whatsapp: "WhatsApp" },
};

export const redesign = { en, sw };

/** Leadership shown until the Portal HR feed (/team) is live. */
export const crewFallback = [
  { name: "Sakri Omari Haji", title: "Managing Director" },
  { name: "Alextair Ofio", title: "Founder & Lead Strategist" },
  { name: "Neema Nyamubi", title: "General Manager" },
  { name: "Joel Kihwele", title: "Operations Manager" },
  { name: "Mussa Mondosha", title: "Finance Manager" },
];

export const partners = ["Reli", "Redefine", "Erudite", "Seebait", "Eskimi", "DStv Media Sales"];

/** Budget bands per currency (index 0–3 line up with the English USD bands sent to the team). */
export const budgetBands = {
  TZS: ["Under TZS 25M", "TZS 25M–65M", "TZS 65M–200M", "TZS 200M+"],
  KES: ["Under KES 1.3M", "KES 1.3M–3.2M", "KES 3.2M–9.7M", "KES 9.7M+"],
  ZAR: ["Under R170k", "R170k–R420k", "R420k–R1.3M", "R1.3M+"],
  ZMW: ["Under K190k", "K190k–K480k", "K480k–K1.4M", "K1.4M+"],
  USD: ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+"],
};

/** Visitor's market currency from their time zone (no network call). Other countries see USD. */
export function localCurrency() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Africa/Dar_es_Salaam") return "TZS";
    if (tz === "Africa/Nairobi") return "KES";
    if (tz === "Africa/Johannesburg") return "ZAR";
    if (tz === "Africa/Lusaka") return "ZMW";
  } catch { /* fall through */ }
  return "USD";
}
