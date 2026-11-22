/**
 * Copy for the 2026 redesign sections (menu, Bluetrain Way, departures, creators, journey).
 * English and Swahili share one shape. Have a native-speaking editor review the Swahili before launch.
 */
/** The influencer site (Bluetrain Influencer Portal). "#join" opens the create-profile form. */
export const creatorPortal = { home: "https://influencers.bluetrain.africa/", join: "https://influencers.bluetrain.africa/#join", guide: "https://influencers.bluetrain.africa/#guide" };
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
    signup: "Creator sign-up",
    reels: [
      { tag: "Influencer management", title: "Wakishua wa Tigo", body: "A nationwide youth platform voiced by five micro-influencers." },
      { tag: "Creator partnership", title: "Shell Tanzania × creator", body: "The right creator meets the right brand." },
      { tag: "Brand localisation", title: "Jack Daniel's · Make It Count", body: "Localisation, creative and influencer management." },
    ],
    roster: "Next Gen Influencer roster · coming soon",
  },
  creatorsPage: {
    title: "For creators",
    description: "Join Bluetrain's creator network: create your profile, get campaign offers from brands, sign on your phone and get paid by mobile money or bank.",
    kicker: "● For creators · Next Gen Influencer",
    heading: "Create with the brands you'd choose yourself.",
    body: "Create your profile once. When a brand's campaign fits you, we put you forward. You see the fee before you say yes, sign on your phone, and follow your payment through to paid.",
    join: "Create your profile",
    signin: "I already have a profile",
    joinNote: "Free to join · No password: you sign in with a code sent to your phone",
    stepsKicker: "● How it works",
    stepsHeading: "From profile to paid, in five steps.",
    steps: [
      { title: "Create your profile", body: "Your name, your mobile number and your city. Then add your social accounts, what you post about and a short bio." },
      { title: "We review it", body: "A Bluetrain influencer manager checks your profile. Once it's live, we can put you forward when a brief fits." },
      { title: "Get an offer", body: "If a brand approves you, you get an SMS. Sign in to see the brand, what you'd deliver, the dates and your fee. Accept it or decline it." },
      { title: "Sign and post", body: "Sign the contract on your phone with your name and an SMS code. You get your own tracked link, the hashtags and the campaign content." },
      { title: "Report and get paid", body: "Add your posts and their numbers. Send your invoice from the campaign page and see where it stands, through to paid." },
    ],
    guide: "Read the full guide",
    needKicker: "● What you need",
    needHeading: "Three things to start.",
    needs: [
      { title: "You're 18 or older", body: "You confirm your age when you create your profile." },
      { title: "A Tanzanian mobile number", body: "It's how you sign in, sign contracts and confirm your payment details. Other countries will follow." },
      { title: "At least one social account", body: "Instagram, TikTok, Facebook, YouTube, X, LinkedIn, Snapchat, Threads, WhatsApp, Telegram, a blog or a podcast." },
    ],
    faqKicker: "● Good to know",
    faqHeading: "Questions creators ask.",
    faqs: [
      { q: "Does joining mean I'll get campaigns?", a: "No. A profile makes you visible to Bluetrain's influencer managers. You're put forward when a brand's brief fits your audience and what you post about, and the brand makes the final choice." },
      { q: "How do I get paid?", a: "By mobile money (M-Pesa, Mixx by Yas, Airtel Money, Halopesa or T-Pesa) or to a bank account. Each offer says how the fee is paid: all on completion, or a deposit on signing and the balance on completion. Tax the law requires us to withhold is taken off, and you see the amount you'll receive before you send your invoice." },
      { q: "Who sees my profile?", a: "Bluetrain's influencer team. A brand first sees you without your name: your networks, what you post about, your city and a follower range. Your name and accounts show only once that brand approves you." },
      { q: "Can I say no to an offer?", a: "Yes. You see the brand, the work and the fee first, and you can decline. Nothing is agreed until you sign." },
      { q: "Is it in Kiswahili?", a: "Yes. The creator portal and its SMS are in Kiswahili and English; you can switch at any time. Contracts are in English for now." },
      { q: "Can I take a break?", a: "Yes. Pause your profile whenever you like and resume it when you're ready." },
    ],
    closeHeading: "Ready when you are.",
    closeBody: "It takes a few minutes to set up.",
    brandsKicker: "● For brands",
    brandsHeading: "Looking for creators for a campaign?",
    brandsBody: "Tell us about the brief. We'll come back with a shortlist that fits.",
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
  pass: { title: (m) => `Boarding pass · ${m}-min discovery call · Google Meet`, from: "From", you: "You", to: "To", growth: "Growth", with: "With", date: "Date", seat: "Seat", continue: "Continue", confirmed: "Confirmed" },
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
    signup: "Usajili wa watayarishi",
    reels: [
      { tag: "Usimamizi wa washawishi", title: "Wakishua wa Tigo", body: "Jukwaa la vijana la kitaifa likiongozwa na washawishi wadogo watano." },
      { tag: "Ushirikiano na mtayarishi", title: "Shell Tanzania × mtayarishi", body: "Mtayarishi sahihi akutana na chapa sahihi." },
      { tag: "Kuifanya chapa iwe ya kienyeji", title: "Jack Daniel's · Make It Count", body: "Ubunifu, tafsiri na usimamizi wa washawishi." },
    ],
    roster: "Orodha ya Next Gen Influencer · inakuja hivi karibuni",
  },
  creatorsPage: {
    title: "Kwa watayarishi",
    description: "Jiunge na mtandao wa watayarishi wa Bluetrain: tengeneza wasifu wako, pata ofa za kampeni kutoka kwa chapa, saini kwa simu yako na ulipwe kwa pesa kwa simu au benki.",
    kicker: "● Kwa watayarishi · Next Gen Influencer",
    heading: "Fanya kazi na chapa ambazo ungezichagua mwenyewe.",
    body: "Tengeneza wasifu wako mara moja. Kampeni ya chapa ikikufaa, tunakupendekeza. Unaona malipo kabla ya kukubali, unasaini kwa simu yako, na unafuatilia malipo yako hadi yanapolipwa.",
    join: "Tengeneza wasifu wako",
    signin: "Tayari nina wasifu",
    joinNote: "Kujiunga ni bure · Hakuna nenosiri: unaingia kwa msimbo unaotumwa kwenye simu yako",
    stepsKicker: "● Jinsi inavyofanya kazi",
    stepsHeading: "Kutoka wasifu hadi malipo, kwa hatua tano.",
    steps: [
      { title: "Tengeneza wasifu wako", body: "Jina lako, namba yako ya simu na mji wako. Kisha ongeza akaunti zako za mitandao ya kijamii, mada unazochapisha na maelezo mafupi kukuhusu." },
      { title: "Tunaupitia", body: "Meneja wa washawishi wa Bluetrain anakagua wasifu wako. Ukishakuwa hewani, tunaweza kukupendekeza pale kampeni inapokufaa." },
      { title: "Pata ofa", body: "Chapa ikikuidhinisha, unapata SMS. Ingia uone chapa, kazi utakayofanya, tarehe na malipo yako. Ikubali au ikatae." },
      { title: "Saini na uchapishe", body: "Saini mkataba kwa simu yako kwa jina lako na msimbo wa SMS. Unapata kiungo chako cha kufuatilia, hashtag na maudhui ya kampeni." },
      { title: "Ripoti na ulipwe", body: "Ongeza machapisho yako na takwimu zake. Tuma ankara yako kwenye ukurasa wa kampeni na uone ilipofikia, hadi inapolipwa." },
    ],
    guide: "Soma mwongozo kamili",
    needKicker: "● Unachohitaji",
    needHeading: "Mambo matatu ili kuanza.",
    needs: [
      { title: "Una miaka 18 au zaidi", body: "Unathibitisha umri wako unapotengeneza wasifu wako." },
      { title: "Namba ya simu ya Tanzania", body: "Ndiyo unayoitumia kuingia, kusaini mikataba na kuthibitisha taarifa zako za malipo. Nchi nyingine zitafuata." },
      { title: "Angalau akaunti moja ya mtandao wa kijamii", body: "Instagram, TikTok, Facebook, YouTube, X, LinkedIn, Snapchat, Threads, WhatsApp, Telegram, blogu au podikasti." },
    ],
    faqKicker: "● Vizuri kujua",
    faqHeading: "Maswali ya watayarishi.",
    faqs: [
      { q: "Je, kujiunga kunamaanisha nitapata kampeni?", a: "Hapana. Wasifu unakufanya uonekane kwa mameneja wa washawishi wa Bluetrain. Unapendekezwa pale kampeni ya chapa inapoendana na hadhira yako na mada unazochapisha, na chapa ndiyo hufanya uamuzi wa mwisho." },
      { q: "Ninalipwaje?", a: "Kwa pesa kwa simu (M-Pesa, Mixx by Yas, Airtel Money, Halopesa au T-Pesa) au kwenye akaunti ya benki. Kila ofa inaeleza jinsi malipo yanavyolipwa: yote kazi ikikamilika, au malipo ya awali unaposaini na salio kazi ikikamilika. Kodi ya zuio inayotakiwa na sheria inakatwa, na unaona kiasi utakachopokea kabla ya kutuma ankara yako." },
      { q: "Nani anaona wasifu wangu?", a: "Timu ya washawishi ya Bluetrain. Chapa inakuona kwanza bila jina lako: mitandao yako, mada unazochapisha, mji wako na kiwango cha wafuasi. Jina lako na akaunti zako vinaonekana tu pale chapa hiyo inapokuidhinisha." },
      { q: "Naweza kukataa ofa?", a: "Ndiyo. Unaona chapa, kazi na malipo kwanza, na unaweza kukataa. Hakuna kilichokubaliwa hadi usaini." },
      { q: "Je, ipo kwa Kiswahili?", a: "Ndiyo. Portal ya watayarishi na SMS zake zipo kwa Kiswahili na Kiingereza; unaweza kubadilisha wakati wowote. Mikataba ipo kwa Kiingereza kwa sasa." },
      { q: "Naweza kupumzika?", a: "Ndiyo. Sitisha wasifu wako wakati wowote na uuendeleze ukiwa tayari." },
    ],
    closeHeading: "Tuko tayari ukiwa tayari.",
    closeBody: "Inachukua dakika chache kuanza.",
    brandsKicker: "● Kwa chapa",
    brandsHeading: "Unatafuta watayarishi kwa ajili ya kampeni?",
    brandsBody: "Tueleze kuhusu kampeni yako. Tutarudi na orodha fupi inayokufaa.",
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
  pass: { title: (m) => `Tiketi · mazungumzo ya dakika ${m} · Google Meet`, from: "Kutoka", you: "Wewe", to: "Kwenda", growth: "Ukuaji", with: "Na", date: "Tarehe", seat: "Kiti", continue: "Endelea", confirmed: "Imethibitishwa" },
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
