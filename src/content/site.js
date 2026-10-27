/**
 * Bluetrain Africa — shared configuration + English content.
 * English copy is verbatim from bluetrain-website-copy.md unless marked
 * "// BRIEF" (from the redesign brief), "// ADDED" (requested later) or "// PLACEHOLDER".
 * Swahili lives in ./sw.js with the identical shape.
 */

// VITE_PORTAL_API lets a local preview talk to a local portal (npm run dev with VITE_PORTAL_API=http://localhost:8787/api/public).
const PORTAL_API = (typeof import.meta !== "undefined" && import.meta.env?.VITE_PORTAL_API) || "https://portal.bluetrain.africa/api/public";

export const config = {
  // Discovery-call booking page on this site (people, times and invites come from the Bluetrain Portal)
  bookingUrl: "#/book",
  // Bluetrain Portal public API: the discovery form and bookings land in the portal's Leads module.
  // If formEndpoint is emptied, the form falls back to a pre-filled email.
  portalApi: PORTAL_API,
  formEndpoint: `${PORTAL_API}/inquiry`,
  email: "info@bluetrain.co.tz",
  web: "bluetrain.africa",
  timeZone: "Africa/Dar_es_Salaam",
  timeZoneLabel: "EAT",
  // From the current bluetrain.africa footer — update if the accounts are renamed for the rebrand
  socials: [
    { label: "LinkedIn", handle: "Bluetrain Limited", href: "https://www.linkedin.com/company/bluetrain-limited/" },
    { label: "Instagram", handle: "@bluetrain_consultancy", href: "https://www.instagram.com/bluetrain_consultancy/" },
  ],
  // Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX". Empty = no tracking script is added.
  ga4Id: "",
  // Live address, used for canonical URLs, the sitemap and share previews
  siteUrl: "https://bluetrain.africa",
  // Client permissions must be confirmed before launch. Add `logo: "/clients/x.svg"` to use a logo.
  // `sector` groups the clients wall. `logo` (optional): monochrome SVG in src/assets/clients,
  // imported in components/ClientWall.jsx — add once written permission is in.
  clients: [
    { name: "CRDB Bank", sector: "finance" },
    { name: "Vodacom", sector: "telco" },
    { name: "UNICEF", sector: "development" },
    { name: "Jack Daniel's", sector: "fmcg" },
    { name: "Castle Lite", sector: "fmcg" },
    { name: "Changan", sector: "auto" },
    { name: "CPS Africa", sector: "property" },
    { name: "Dunlop", sector: "auto" },
    { name: "Kilombero Sugar", sector: "fmcg" },
    { name: "Meridianbet", sector: "gaming" },
    { name: "Auto Inc", sector: "auto" },
    { name: "Loti Gas", sector: "energy" },
  ],
  // Results strip — every figure here is from the approved copy. Labels live in each language file.
  results: [
    { value: 1100, suffix: "+" },
    { value: 200, suffix: "+" },
    { value: 4, suffix: "" },
    { value: 10, suffix: "" },
  ],
  // PLACEHOLDER — newsletter signup endpoint (Mailchimp, Brevo…). Empty = opens a pre-filled email.
  newsletterEndpoint: "",
  // Case-study visuals and filtering are language-independent
  work: [
    { id: "castle-lite", categories: ["experience", "technology"], image: null, art: "codes" },
    { id: "vodacom", categories: ["experience"], image: null, art: "crowd" },
    { id: "cps-africa", categories: ["growth"], image: null, art: "routes" },
  ],
  serviceIcons: ["strategy", "growth", "insights", "influence", "experience", "technology"],
  // ADDED — order controls display order; ids match the map paths
  countries: ["TZ", "KE", "ZA", "ZM"],
  // Registered offices (supplied 10 Oct 2026). Legal names and addresses are not translated.
  offices: [
    { id: "TZ", entity: "Bluetrain Limited", lines: ["Dar Village Office Park, SNDBX, 2nd Floor", "Rose Garden Road, Mikocheni", "P.O. Box 32329, Kijitonyama, Dar es Salaam"] },
    // CONFIRM — two versions were supplied (Street / Road, 7460 / 7650). Using Street + 7460 (Goodwood's postcode).
    { id: "ZA", entity: "Bluetrain Professionals (Pty) Ltd", lines: ["133 Riebeek Street, Goodwood", "Cape Town, 7460"] },
    // CONFIRM — add town/city
    { id: "KE", entity: "Bluetrain Limited Kenya", lines: ["Gamerock, Seremwai Road"] },
  ],
};

export const en = {
  meta: {
    title: "Bluetrain Africa — Strategy that moves. Ideas that connect. Work that delivers.",
  },
  nav: {
    links: [
      { label: "Work", href: "#work" },
      { label: "Services", href: "#services" },
      { label: "About", href: "#about" },
      { label: "Informed", href: "#/informed" },
    ],
    cta: "Book a Call", // BRIEF
  },

  hero: {
    headline: ["Strategy that moves.", "Ideas that connect.", "Work that delivers."],
    body: "Bluetrain is an African strategy, marketing, media and technology consultancy helping brands understand their markets, engage their audiences and turn ideas into measurable business outcomes.",
    kicker: "We think. We connect. We execute.",
    // Off until there's a verified figure, e.g. { value: "45%", label: "average lift in conversion post-launch" }
    stat: null,
    primaryCta: { label: "Start a Project", href: "#contact" }, // BRIEF
    secondaryCta: { label: "View Case Studies", href: "#work" }, // BRIEF
  },

  about: {
    heading: "Built for the way modern brands need to work",
    paragraphs: [
      "Marketing is no longer one channel, one campaign or one agency discipline.",
      "Brands need insight. Strategy. Media. Content. Technology. Experiences. Measurement. And, increasingly, the ability to connect all of them.",
      "That is where Bluetrain comes in.",
      "We work across the customer journey, combining strategic thinking, local market intelligence, digital expertise, technology and execution to help ambitious organisations grow.",
      "Based in Dar es Salaam and built with an African perspective, Bluetrain works with businesses across Tanzania and the wider region.",
    ],
    experience: "Our work spans financial services, telecommunications, automotive, FMCG, beverages, real estate, gaming, hospitality, development organisations and consumer brands.",
  },

  // ADDED — "Where We Work" copy, extended to list all four countries
  where: {
    heading: "Built in Tanzania. Thinking regionally.",
    body: [
      "Bluetrain was founded in Dar es Salaam and has grown with a wider African ambition.",
      "Our work increasingly spans East and Southern Africa, supported by operations and partnerships across Tanzania, Kenya, South Africa, Zambia and other regional markets.",
    ],
    closing: "We believe some of the world's most interesting business, technology and consumer opportunities are emerging in Africa. We intend to help build them.",
    countries: {
      TZ: { name: "Tanzania", note: "Headquarters, Dar es Salaam" },
      KE: { name: "Kenya", note: "Office, Kenya" },
      ZA: { name: "South Africa", note: "Office, Cape Town" },
      ZM: { name: "Zambia", note: "Regional market" },
    },
  },

  services: {
    heading: "One partner. Multiple capabilities.",
    intro: "Our work is organised around interconnected capabilities that help brands understand, reach, influence and engage their audiences.",
    items: [
      {
        id: "strategy",
        title: "Strategy & Consulting",
        tagline: "Find the opportunity. Build the plan.",
        body: "We help organisations define where they want to go, understand the opportunity and build practical strategies for getting there.",
        capabilities: ["Go-to-market strategy", "Market-entry strategy", "Customer journey development", "Growth strategy"],
        highlight: { value: "A roadmap", label: "The outcome is not simply a recommendation." },
      },
      {
        id: "growth",
        title: "Performance & Digital Growth",
        tagline: "Media designed around business outcomes",
        body: "We plan, buy, optimise and measure digital media designed to generate meaningful business results.",
        capabilities: ["Google Ads", "Meta advertising", "Programmatic advertising", "Analytics and attribution"],
        highlight: { value: "OmniSEO", label: "Help customers find the brand wherever they choose to search." },
      },
      {
        id: "insights",
        title: "Insights & Listening",
        tagline: "Know what is being said. Understand what it means.",
        body: "We help organisations understand what people, media and markets are saying — and what it means for their business.",
        capabilities: ["Media monitoring", "Social listening", "Sentiment analysis", "Share-of-voice analysis"],
        highlight: { value: "Bluetrain Informed", label: "What happened? Why does it matter? What should we do next?" },
      },
      {
        id: "influence",
        title: "Influence & Social",
        tagline: "Influence is bigger than influencers.",
        body: "We connect brands with communities, creators and conversations that matter.",
        capabilities: ["Influencer strategy", "Creator partnerships", "Community management", "Social reporting"],
        highlight: { value: "We Run Influence", label: "People influence people." },
      },
      {
        id: "experience",
        title: "Experiential & Consumer Engagement",
        tagline: "Create something people want to participate in.",
        body: "We create physical brand experiences that turn audiences into participants.",
        capabilities: ["Brand activations", "Product sampling", "Consumer promotions", "Roadshows"],
        highlight: { value: "1,100+", label: "consumer participants in a two-week Vodacom activation" },
      },
      {
        id: "technology",
        title: "Technology & Marketing Enablement",
        tagline: "Technology should make marketing easier, smarter and more measurable.",
        body: "We build and integrate the digital tools that make campaigns, customer journeys and marketing operations work.",
        capabilities: ["Campaign microsites", "USSD journeys", "WhatsApp integrations", "API integrations"],
        highlight: { value: "Millions", label: "of unique promotional codes run for a Castle Lite promotion" },
      },
    ],
  },

  work: {
    heading: "Turning strategy into execution",
    filters: [
      { id: "all", label: "All" },
      { id: "experience", label: "Experience" },
      { id: "technology", label: "Technology" },
      { id: "growth", label: "Growth" },
    ],
    items: {
      "castle-lite": {
        title: "Castle Lite Consumer Promotion",
        industry: "FMCG & Beverages",
        metric: "Millions of unique codes",
        body: "A large-scale technology-enabled consumer promotion requiring millions of unique promotional codes, SMS workflows, regional logic, eligibility controls and competition mechanics.",
      },
      vodacom: {
        title: "Vodacom Consumer Engagement",
        industry: "Telecommunications",
        metric: "1,100+ participants, 200+ winners",
        body: "One campaign delivered more than 1,100 consumer participants and over 200 winners across a two-week activation period.",
      },
      "cps-africa": {
        title: "CPS Africa",
        industry: "Real Estate",
        metric: "3 international markets",
        body: "The work combines paid search, performance media and campaign optimisation across markets including Europe, the Middle East and North America.",
      },
    },
  },

  statement: {
    heading: "We do not believe strategy should end in a presentation.",
    body: "Our role is to help turn thinking into action — and action into results.",
  },

  // PLACEHOLDER — no approved testimonials yet. Shape:
  // { quote, name, title, company, headshot: "/people/jane.jpg", logo: "/clients/acme.svg" }
  testimonials: [],

  contact: {
    heading: "Bring us the challenge.",
    lines: [
      "You do not need to know exactly what service you need.",
      "Tell us what you are trying to achieve.",
      "We will help you work out the rest.",
    ],
    steps: [
      { key: "building", question: "What are you building?", options: ["A strategy", "A campaign", "A technology solution", "A media partner", "A fresh perspective"], allowOther: true },
      { key: "timeline", question: "What is your timeline?", options: ["As soon as possible", "Within 3 months", "3–6 months", "Just exploring"] },
      // PLACEHOLDER — confirm currency and bands
      { key: "budget", question: "What is your budget range?", options: ["Under $10k", "$10k–$25k", "$25k–$75k", "$75k+", "Not sure yet"] },
    ],
    address: ["Dar Village Office Park", "SNDBX, 2nd Floor", "Rose Garden Road", "Mikocheni", "Dar es Salaam, Tanzania"],
  },

  footer: {
    tagline: "Strategy. Media. Influence. Insights. Experiences. Technology.",
    legal: [
      { label: "Privacy Policy", href: "#/privacy" },
      { label: "Terms of Use", href: "#/terms" },
    ],
    copyright: "© 2026 Bluetrain Africa. All rights reserved.",
  },

  // Interface strings (buttons, labels, form messages, accessibility text)
  ui: {
    skip: "Skip to content",
    backToTop: "Bluetrain Africa, back to top",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
    language: "Language",
    countriesLink: "Where we work",
    clientsLabel: "Selected clients",
    signalLabel: "Signal arcs radiating outward from a single point",
    filterLabel: "Filter case studies",
    showing: (n) => `Showing ${n} case ${n === 1 ? "study" : "studies"}`,
    statementLabel: "What we believe",
    prev: "Previous testimonial",
    next: "Next testimonial",
    of: (i, n) => `${i} of ${n}`,
    mapLabel: "Map of Africa highlighting Tanzania, Kenya, South Africa and Zambia",
    hq: "HQ",
    form: {
      step: (i, n) => `Step ${i} of ${n}`,
      reassurance: [
        "You do not need to know exactly what service you need.",
        "Just exploring is a perfectly good answer.",
        "We only use your details to reply to this request.",
      ],
      somethingElse: "Something else",
      tellUs: "Tell us in a sentence",
      otherPlaceholder: "e.g. Launching in Kenya next quarter",
      name: "Your name",
      email: "Work email",
      note: "Anything else we should know? (optional)",
      back: "Back",
      continue: "Continue",
      send: "Send request",
      sending: "Sending…",
      errBudget: "Choose a budget range, or “Not sure yet”.",
      errName: "Add your name so we know who to reply to.",
      errEmail: "Enter an email address like name@company.com.",
      sentTitle: "Request sent.",
      sentBody: (name, email) => `Thanks, ${name}. We'll reply to ${email}.`,
      mailtoTitle: "Your request is ready to send.",
      mailtoBody: "Your email app has opened with the details filled in. Send it from there and we'll reply.",
      error: (email) => `Your request didn't send. Check your connection and try again, or email ${email}.`,
      talk: "Prefer to talk it through?",
      bookLong: "Book a 30-minute discovery call",
      orEmail: "Or email",
    },
    informed: {
      name: "Bluetrain Informed",
      kicker: "What happened? Why does it matter? What should we do next?",
      intro: "Market notes, campaign lessons and points of view from our teams across Africa.",
      readAll: "All articles",
      featured: "Featured",
      alsoNew: "Also new",
      all: "All",
      allMarkets: "All markets",
      search: "Search articles",
      searchHint: "Press / to search",
      results: (n) => `${n} ${n === 1 ? "article" : "articles"}`,
      none: "No articles match. Try another word or clear the filters.",
      clear: "Clear filters",
      loadMore: "Load more",
      min: (n) => `${n} min read`,
      takeaways: "Key takeaways",
      back: "All articles",
      related: "Keep reading",
      englishOnly: null,
      filterBy: "Filter by topic",
      filterMarket: "Filter by market",
      progress: "Reading progress",
      newsletter: {
        title: "Get Bluetrain Informed in your inbox",
        body: "One email a month. Market notes and campaign lessons, no noise.",
        placeholder: "Work email",
        cta: "Subscribe",
        invalid: "Enter an email address like name@company.com.",
        done: "You're on the list. See you next month.",
        mailto: "Your email app has opened. Send it and we'll add you.",
      },
      ctaTitle: "Working on something like this?",
      ctaBody: "Tell us what you're trying to achieve. We'll help you work out the rest.",
    },
    results: {
      heading: "Outcomes, not outputs",
      items: [
        { label: "consumer participants", context: "Vodacom activation, over two weeks" },
        { label: "winners", context: "Same Vodacom campaign" },
        { label: "African markets", context: "Tanzania, Kenya, South Africa, Zambia" },
        { label: "sectors served", context: "From financial services to gaming" },
      ],
    },
    clientsWall: {
      heading: "Brands we have worked with",
      intro: "Banks and telcos, beverage brands and development organisations: the work spans the economy.",
      sectors: { finance: "Financial services", telco: "Telecommunications", development: "Development", fmcg: "FMCG & Beverages", auto: "Automotive", property: "Real estate", gaming: "Gaming", energy: "Energy" },
    },
    privacyNotice: { before: "We use your details only to reply and arrange your call. See our", link: "Privacy Policy", after: "." },
    notFound: { title: "This page has moved or no longer exists.", body: "Our website has a new home. The page you were looking for may have moved. Try one of these instead.", home: "Go to the homepage" },
    sticky: { label: "Quick actions" },
    // ADDED — discovery-call booking page (/book)
    book: {
      kicker: "Discovery call",
      title: "Book a 30-minute discovery call",
      intro: "Choose who you'd like to speak to, then a time that suits you. You'll get a Google Calendar invitation with a Meet link.",
      steps: ["Who", "When", "Your details"],
      whoQ: "Who would you like to speak to?",
      whenQ: "Pick a day and time",
      detailsQ: "Your details",
      loading: "Finding free times…",
      noTimes: "No free times in the next two weeks. Choose someone else, or send us your brief.",
      tzNote: (tz) => `Times are in your time zone (${tz}).`,
      eatNote: "East Africa Time",
      change: "Change",
      company: "Company",
      phone: "Phone (optional)",
      topic: "What would you like to discuss? (optional)",
      topicPlaceholder: "e.g. Launching a campaign in Kenya next quarter",
      confirm: "Confirm booking",
      booking: "Booking…",
      duration: (m) => `${m} minutes · Google Meet`,
      doneTitle: "You're booked.",
      doneBody: (when, email) => `${when}. A calendar invitation with the Meet link is on its way to ${email}.`,
      join: "Open the Meet link",
      home: "Back to the homepage",
      closedTitle: "Online booking isn't available right now.",
      closedBody: "Send us your brief and we'll set up a call, or email us.",
      brief: "Send your brief",
      taken: "Sorry, that time was just taken. Please choose another.",
      error: (email) => `We couldn't complete the booking. Please try again, or email ${email}.`,
    },
    footer: { explore: "Explore", visit: "Visit", follow: "Follow", contact: "Contact", offices: "Our offices", intents: [{ label: "Start a project", href: "#contact" }, { label: "Join the team", href: "mailto:info@bluetrain.co.tz?subject=Careers" }, { label: "Press", href: "mailto:info@bluetrain.co.tz?subject=Press" }, { label: "Say hello", href: "mailto:info@bluetrain.co.tz" }] },
  },
};
