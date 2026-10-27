/**
 * Privacy Policy and Terms of Use — English (binding) and Kiswahili (translation).
 * Built from "Prompt Library — Bluetrain Website" v1 (27 Oct 2026).
 * Law: Personal Data Protection Act, 2022 (Act No. 11 of 2022) and its 2023 Regulations.
 *
 * Blocks: { p } paragraph · { list: [] } bullets · { h } sub-heading. `**text**` = bold, `[text](href)` = link.
 * Facts here must match the site's real behaviour (forms, storage, providers). Update both languages together.
 */

const EFFECTIVE = "2026-10-27";
const ADDRESS = "Dar Village Office Park, SNDBX, 2nd Floor, Rose Garden Road, Mikocheni, P.O. Box 32329, Kijitonyama, Dar es Salaam, Tanzania";
const EMAIL = "info@bluetrain.co.tz";

export const legal = {
  en: {
    effectiveLabel: "Effective",
    contentsLabel: "On this page",
    translationNote: null,
    privacy: {
      slug: "privacy",
      title: "Privacy Policy",
      description: "How Bluetrain Limited collects, uses and protects personal data on bluetrain.africa, under Tanzania's Personal Data Protection Act, 2022.",
      effective: EFFECTIVE,
      intro: [
        `This policy explains how Bluetrain Limited ("Bluetrain", "we", "us") collects and uses personal data when you use bluetrain.africa. We are registered with the Personal Data Protection Commission (PDPC) as a data controller, and we handle personal data under the Personal Data Protection Act, 2022 and its regulations.`,
      ],
      sections: [
        { id: "who-we-are", h: "Who we are", body: [
          { p: `Bluetrain Limited, trading as Bluetrain Africa, is the data controller for this website. Our registered office is at ${ADDRESS}.` },
          { p: `For anything about your personal data, email [${EMAIL}](mailto:${EMAIL}).` },
        ] },
        { id: "what-we-collect", h: "What we collect", body: [
          { p: "We only collect what you choose to send us, plus the technical data needed to run the site." },
          { list: [
            "**Discovery form:** what you are building, your timeline and budget range, your name and email, any note you add, and the language you used on the site.",
            "**Booking a call:** your name and email, your company and phone number if you give them, the topic, the time and team member you choose, your time zone and site language.",
            "**With either form:** the page you sent it from, the website that referred you, and any campaign tags in the link you followed (such as utm_source). We also record a hidden spam-check field and how long the form took to complete.",
            "**When you visit:** our hosting provider, Cloudflare, processes your IP address, browser type and the pages you request, to deliver the site and protect it from attacks.",
          ] },
          { p: "We do not ask for sensitive personal data, such as health, religious or financial details. Please do not include it in your messages." },
        ] },
        { id: "how-we-use-it", h: "How we use it, and why", body: [
          { list: [
            "**To do what you asked:** reply to your enquiry, prepare a proposal, and schedule and hold your call. You give us these details so we can take these steps for you.",
            "**To understand which campaigns bring enquiries:** we look at referral and campaign data in summary form to improve our marketing.",
            "**To keep the site safe:** we block spam and attacks.",
            "**To meet our legal duties:** for example, keeping business records the law requires.",
          ] },
          { p: "We use your data only for these purposes. We do not sell it, build advertising profiles from it, or make decisions about you by automated means alone." },
          { p: "We will only send you newsletters or other marketing if you clearly agree to receive them. You can unsubscribe at any time." },
        ] },
        { id: "sharing", h: "Who we share it with", body: [
          { list: [
            "**Our team:** the Bluetrain staff who handle enquiries and bookings.",
            "**Service providers working for us:** Cloudflare (website hosting, security, and storing enquiries in our client portal) and Google (Google Workspace email and calendar, used to reply and send call invitations). They may use the data only on our instructions and under contract.",
            "**Authorities:** when a law or a court requires it.",
          ] },
          { p: "We never sell or rent personal data." },
        ] },
        { id: "transfers", h: "Transfers outside Tanzania", body: [
          { p: "Cloudflare and Google run global networks, so your data may be processed or stored outside Tanzania. We transfer only what is needed, we use providers that protect personal data under contract and with technical measures such as encryption, and we follow the Act's rules on cross-border transfers." },
        ] },
        { id: "retention", h: "How long we keep it", body: [
          { list: [
            "**Enquiries and bookings:** 2 years after our last contact with you. We then delete the data or make it anonymous.",
            "**If you become a client:** for the length of our agreement, and afterwards for as long as Tanzanian law requires us to keep business and tax records.",
            "**Hosting and security logs:** for short periods, as needed to run and protect the site.",
          ] },
        ] },
        { id: "security", h: "How we protect it", body: [
          { p: "The site uses encrypted connections (HTTPS). Enquiries are stored in our client portal, where access is limited by sign-in to the staff who need it. We review these measures regularly. If a breach affects personal data, we will report it to the PDPC as the law requires." },
        ] },
        { id: "your-rights", h: "Your rights", body: [
          { p: "Under the Personal Data Protection Act, 2022, you can:" },
          { list: [
            "be told what personal data we hold about you, why, and who receives it, and get a copy;",
            "have inaccurate, outdated or misleading data corrected;",
            "ask us to delete your data;",
            "object to our use of your data, including for direct marketing;",
            "ask us to restrict processing that could cause you harm;",
            "not be subject to decisions made solely by automated means that significantly affect you;",
            "withdraw your consent at any time, without affecting what we did before;",
            "seek compensation if you suffer harm because we broke the Act.",
          ] },
          { h: "How to use your rights" },
          { p: `Email [${EMAIL}](mailto:${EMAIL}) with the subject "Data request" and tell us what you would like. We may ask you to confirm your identity. We will acknowledge your request within 72 hours and give you our decision within 7 days. If we need longer, we will tell you why.` },
        ] },
        { id: "complaints", h: "Complaints", body: [
          { p: "If you are unhappy with how we handle your data, please contact us first so we can put it right. You can also complain to the Personal Data Protection Commission (PDPC), Tanzania's data protection regulator." },
        ] },
        { id: "device-storage", h: "Cookies and storage on your device", body: [
          { p: "We do not use cookies for tracking or advertising. The site stores a few small items in your browser to work properly:" },
          { list: [
            "your language and light or dark theme choice (kept until you clear it);",
            "where you arrived from during your visit, so it can be sent with a form (cleared when you close the tab).",
          ] },
          { p: "Staff who sign in to edit the blog use a short-lived security cookie. You can clear stored items at any time in your browser settings. If we add analytics in future, we will update this policy first and ask for your consent where the law requires." },
        ] },
        { id: "children", h: "Children", body: [
          { p: `This website is for businesses and is not aimed at children under 18. We do not knowingly collect their data. If you believe a child has sent us personal data, email [${EMAIL}](mailto:${EMAIL}) and we will delete it.` },
        ] },
        { id: "changes", h: "Changes to this policy", body: [
          { p: "We may update this policy when our services or the law change. The effective date at the top shows the latest version. If a change is significant, we will highlight it on the site." },
        ] },
        { id: "contact", h: "Contact us", body: [
          { p: `Bluetrain Limited, ${ADDRESS}. Email [${EMAIL}](mailto:${EMAIL}).` },
        ] },
      ],
    },
    terms: {
      slug: "terms",
      title: "Terms of Use",
      description: "The rules for using bluetrain.africa, operated by Bluetrain Limited under the laws of the United Republic of Tanzania.",
      effective: EFFECTIVE,
      intro: [
        `These terms govern your use of bluetrain.africa, operated by Bluetrain Limited ("Bluetrain", "we", "us"). By using the site, you agree to them. If you do not agree, please do not use the site.`,
      ],
      sections: [
        { id: "using-the-site", h: "Using the site", body: [
          { p: "You may use the site for lawful purposes only. You must not:" },
          { list: [
            "break any law of Tanzania when using the site, including the Cybercrimes Act, 2015;",
            "try to gain unauthorised access to the site, our portal or our systems;",
            "introduce viruses or other harmful code, or overload or disrupt the site;",
            "copy the site's content in bulk by automated means;",
            "send spam, or false or misleading information, through our forms;",
            "pretend to be someone else.",
          ] },
        ] },
        { id: "intellectual-property", h: "Our content and intellectual property", body: [
          { p: "The site's text, design, graphics and the Bluetrain name and logo belong to Bluetrain or are used with permission. You may view the site and share links to it. Copying or reusing our content for any other purpose needs our written permission." },
          { p: "Client names, logos and trademarks shown on the site belong to their owners. Showing them does not mean those owners endorse anything beyond the work described." },
        ] },
        { id: "informed", h: "Bluetrain Informed articles", body: [
          { p: "Articles on Bluetrain Informed are general information, not professional, legal or financial advice. They reflect our view when published and may become out of date. Please take advice for your own situation before acting on them." },
        ] },
        { id: "enquiries", h: "Enquiries and bookings", body: [
          { p: "Sending a form or booking a call does not create a contract. We provide services only under a separate written agreement, and we may decline an enquiry. Please give accurate details so we can reply." },
        ] },
        { id: "links", h: "Links to other websites", body: [
          { p: "The site may link to other websites, such as our social media pages. We do not control those sites and are not responsible for their content or how they handle your data." },
        ] },
        { id: "availability", h: "Availability of the site", body: [
          { p: "We work to keep the site accurate and available, but we do not guarantee it will always be available, error-free or up to date. We may change, suspend or remove any part of it without notice." },
        ] },
        { id: "liability", h: "Our liability", body: [
          { p: "The site is provided \"as is\". To the extent the laws of Tanzania allow, Bluetrain is not liable for any indirect or consequential loss, or for loss of profit, data or business, arising from your use of the site or reliance on its content. Nothing in these terms limits any liability that cannot be limited by law." },
        ] },
        { id: "privacy", h: "Privacy", body: [
          { p: "Our [Privacy Policy](#/privacy) explains how we collect and use personal data through the site." },
        ] },
        { id: "changes", h: "Changes to these terms", body: [
          { p: "We may update these terms from time to time. The effective date at the top shows the latest version. By continuing to use the site after a change, you accept the updated terms." },
        ] },
        { id: "law", h: "Governing law and disputes", body: [
          { p: "These terms are governed by the laws of the United Republic of Tanzania. If a dispute arises, we will first try to resolve it with you in good faith. If we cannot, the courts of Tanzania will have jurisdiction." },
        ] },
        { id: "contact", h: "Contact us", body: [
          { p: `Bluetrain Limited, ${ADDRESS}. Email [${EMAIL}](mailto:${EMAIL}).` },
        ] },
      ],
    },
  },

  sw: {
    effectiveLabel: "Inaanza kutumika",
    contentsLabel: "Katika ukurasa huu",
    translationNote: "Hii ni tafsiri ya Kiswahili. Endapo kutatokea tofauti yoyote ya maana, toleo la Kiingereza ndilo litakalotumika.",
    privacy: {
      slug: "privacy",
      title: "Sera ya Faragha",
      description: "Jinsi Bluetrain Limited inavyokusanya, kutumia na kulinda taarifa binafsi kwenye bluetrain.africa, chini ya Sheria ya Ulinzi wa Taarifa Binafsi ya Tanzania, 2022.",
      effective: EFFECTIVE,
      intro: [
        `Sera hii inaeleza jinsi Bluetrain Limited ("Bluetrain", "sisi") inavyokusanya na kutumia taarifa binafsi unapotumia bluetrain.africa. Tumesajiliwa na Tume ya Ulinzi wa Taarifa Binafsi (PDPC) kama mdhibiti wa taarifa, na tunashughulikia taarifa binafsi kwa mujibu wa Sheria ya Ulinzi wa Taarifa Binafsi, 2022 na kanuni zake.`,
      ],
      sections: [
        { id: "who-we-are", h: "Sisi ni nani", body: [
          { p: `Bluetrain Limited, inayofanya biashara kama Bluetrain Africa, ndiye mdhibiti wa taarifa kwa tovuti hii. Ofisi yetu iliyosajiliwa iko ${ADDRESS}.` },
          { p: `Kwa jambo lolote kuhusu taarifa zako binafsi, tuma barua pepe kwa [${EMAIL}](mailto:${EMAIL}).` },
        ] },
        { id: "what-we-collect", h: "Tunachokusanya", body: [
          { p: "Tunakusanya tu kile unachochagua kututumia, pamoja na taarifa za kiufundi zinazohitajika kuendesha tovuti." },
          { list: [
            "**Fomu ya mazungumzo ya awali:** unachojenga, ratiba na kiwango cha bajeti, jina na barua pepe yako, ujumbe wowote unaoongeza, na lugha uliyotumia kwenye tovuti.",
            "**Kuweka miadi ya mazungumzo:** jina na barua pepe yako, kampuni na namba ya simu ukizitoa, mada, muda na mwanatimu unayemchagua, saa za eneo lako na lugha ya tovuti.",
            "**Kwa fomu yoyote kati ya hizi:** ukurasa ulioitumia kutoka, tovuti iliyokuleta, na alama za kampeni kwenye kiungo ulichofuata (kama utm_source). Pia tunarekodi sehemu iliyofichwa ya kuzuia barua taka na muda uliotumika kujaza fomu.",
            "**Unapotembelea:** mtoa huduma wetu wa uhifadhi, Cloudflare, huchakata anwani yako ya IP, aina ya kivinjari na kurasa unazoomba, ili kuwasilisha tovuti na kuilinda dhidi ya mashambulizi.",
          ] },
          { p: "Hatuombi taarifa binafsi nyeti, kama za afya, dini au fedha. Tafadhali usiziweke kwenye ujumbe wako." },
        ] },
        { id: "how-we-use-it", h: "Jinsi tunavyozitumia, na kwa nini", body: [
          { list: [
            "**Kufanya ulichoomba:** kujibu ombi lako, kuandaa pendekezo, na kupanga na kufanya mazungumzo yako. Unatupa taarifa hizi ili tuchukue hatua hizi kwa ajili yako.",
            "**Kuelewa kampeni zipi zinaleta maombi:** tunaangalia taarifa za kiungo na kampeni kwa muhtasari ili kuboresha masoko yetu.",
            "**Kulinda tovuti:** tunazuia barua taka na mashambulizi.",
            "**Kutimiza wajibu wetu kisheria:** kwa mfano, kutunza kumbukumbu za biashara zinazotakiwa na sheria.",
          ] },
          { p: "Tunatumia taarifa zako kwa madhumuni haya pekee. Hatuziuzi, hatuzitumii kujenga wasifu wa matangazo, wala kufanya maamuzi kukuhusu kwa njia za kiotomatiki pekee." },
          { p: "Tutakutumia jarida au matangazo mengine tu ukikubali waziwazi kuyapokea. Unaweza kujiondoa wakati wowote." },
        ] },
        { id: "sharing", h: "Tunaoshirikiana nao", body: [
          { list: [
            "**Timu yetu:** wafanyakazi wa Bluetrain wanaoshughulikia maombi na miadi.",
            "**Watoa huduma wanaofanya kazi kwa niaba yetu:** Cloudflare (uhifadhi wa tovuti, usalama, na kuhifadhi maombi kwenye mfumo wetu wa wateja) na Google (barua pepe na kalenda za Google Workspace, kwa kujibu na kutuma mialiko ya mazungumzo). Wanaweza kutumia taarifa kwa maelekezo yetu tu na chini ya mkataba.",
            "**Mamlaka:** pale sheria au mahakama inapotaka.",
          ] },
          { p: "Kamwe hatuuzi wala kukodisha taarifa binafsi." },
        ] },
        { id: "transfers", h: "Uhamishaji nje ya Tanzania", body: [
          { p: "Cloudflare na Google huendesha mitandao ya kimataifa, hivyo taarifa zako zinaweza kuchakatwa au kuhifadhiwa nje ya Tanzania. Tunahamisha kinachohitajika tu, tunatumia watoa huduma wanaolinda taarifa binafsi kwa mkataba na kwa hatua za kiufundi kama usimbaji fiche, na tunafuata masharti ya Sheria kuhusu uhamishaji wa taarifa nje ya nchi." },
        ] },
        { id: "retention", h: "Tunazihifadhi kwa muda gani", body: [
          { list: [
            "**Maombi na miadi:** miaka 2 baada ya mawasiliano yetu ya mwisho nawe. Baada ya hapo tunazifuta au kuzifanya zisitambulishe mtu.",
            "**Ukiwa mteja wetu:** kwa muda wote wa makubaliano yetu, na baadaye kwa muda ambao sheria za Tanzania zinatutaka kutunza kumbukumbu za biashara na kodi.",
            "**Kumbukumbu za uhifadhi na usalama:** kwa vipindi vifupi, kadri inavyohitajika kuendesha na kulinda tovuti.",
          ] },
        ] },
        { id: "security", h: "Jinsi tunavyozilinda", body: [
          { p: "Tovuti inatumia miunganisho iliyosimbwa (HTTPS). Maombi huhifadhiwa kwenye mfumo wetu wa wateja, ambapo ufikiaji umezuiliwa kwa kuingia na unaruhusiwa kwa wafanyakazi wanaohitaji tu. Tunapitia hatua hizi mara kwa mara. Ukiukaji ukiathiri taarifa binafsi, tutauripoti kwa PDPC kama sheria inavyotaka." },
        ] },
        { id: "your-rights", h: "Haki zako", body: [
          { p: "Chini ya Sheria ya Ulinzi wa Taarifa Binafsi, 2022, unaweza:" },
          { list: [
            "kuelezwa ni taarifa gani binafsi tunazo kukuhusu, kwa nini, na nani anazipokea, na kupata nakala;",
            "kurekebishiwa taarifa zisizo sahihi, zilizopitwa na wakati au zinazopotosha;",
            "kutuomba tufute taarifa zako;",
            "kupinga matumizi yetu ya taarifa zako, ikiwemo kwa masoko ya moja kwa moja;",
            "kutuomba tuzuie uchakataji unaoweza kukudhuru;",
            "kutoamuliwa kwa njia za kiotomatiki pekee kwa maamuzi yanayokuathiri kwa kiasi kikubwa;",
            "kuondoa ridhaa yako wakati wowote, bila kuathiri tulichofanya kabla;",
            "kudai fidia ukipata madhara kwa sababu tumekiuka Sheria.",
          ] },
          { h: "Jinsi ya kutumia haki zako" },
          { p: `Tuma barua pepe kwa [${EMAIL}](mailto:${EMAIL}) yenye kichwa "Data request" na utueleze unachotaka. Tunaweza kukuomba uthibitishe utambulisho wako. Tutathibitisha kupokea ombi lako ndani ya saa 72 na kukupa uamuzi wetu ndani ya siku 7. Tukihitaji muda zaidi, tutakueleza sababu.` },
        ] },
        { id: "complaints", h: "Malalamiko", body: [
          { p: "Ikiwa hujaridhika na jinsi tunavyoshughulikia taarifa zako, tafadhali wasiliana nasi kwanza ili tulirekebishe. Unaweza pia kuwasilisha malalamiko kwa Tume ya Ulinzi wa Taarifa Binafsi (PDPC), mdhibiti wa ulinzi wa taarifa nchini Tanzania." },
        ] },
        { id: "device-storage", h: "Vidakuzi na uhifadhi kwenye kifaa chako", body: [
          { p: "Hatutumii vidakuzi (cookies) kufuatilia au kwa matangazo. Tovuti huhifadhi vitu vichache vidogo kwenye kivinjari chako ili ifanye kazi vizuri:" },
          { list: [
            "lugha uliyochagua na mwonekano mwangavu au wa giza (huhifadhiwa hadi uvifute);",
            "ulikotokea wakati wa ziara yako, ili kutumwa pamoja na fomu (hufutwa unapofunga kichupo).",
          ] },
          { p: "Wafanyakazi wanaoingia kuhariri blogu hutumia kidakuzi cha usalama cha muda mfupi. Unaweza kufuta vitu vilivyohifadhiwa wakati wowote kupitia mipangilio ya kivinjari chako. Tukiongeza takwimu za matumizi siku zijazo, tutasasisha sera hii kwanza na kuomba ridhaa yako pale sheria inapotaka." },
        ] },
        { id: "children", h: "Watoto", body: [
          { p: `Tovuti hii ni kwa ajili ya biashara na haikulengwa kwa watoto chini ya miaka 18. Hatukusanyi taarifa zao kwa kujua. Ukiamini mtoto ametutumia taarifa binafsi, tuma barua pepe kwa [${EMAIL}](mailto:${EMAIL}) nasi tutazifuta.` },
        ] },
        { id: "changes", h: "Mabadiliko ya sera hii", body: [
          { p: "Tunaweza kusasisha sera hii huduma zetu au sheria zinapobadilika. Tarehe ya kuanza kutumika iliyo juu inaonyesha toleo la karibuni. Mabadiliko yakiwa makubwa, tutayaonyesha wazi kwenye tovuti." },
        ] },
        { id: "contact", h: "Wasiliana nasi", body: [
          { p: `Bluetrain Limited, ${ADDRESS}. Barua pepe [${EMAIL}](mailto:${EMAIL}).` },
        ] },
      ],
    },
    terms: {
      slug: "terms",
      title: "Masharti ya Matumizi",
      description: "Kanuni za kutumia bluetrain.africa, inayoendeshwa na Bluetrain Limited chini ya sheria za Jamhuri ya Muungano wa Tanzania.",
      effective: EFFECTIVE,
      intro: [
        `Masharti haya yanasimamia matumizi yako ya bluetrain.africa, inayoendeshwa na Bluetrain Limited ("Bluetrain", "sisi"). Kwa kutumia tovuti, unakubali masharti haya. Ikiwa hukubali, tafadhali usitumie tovuti.`,
      ],
      sections: [
        { id: "using-the-site", h: "Kutumia tovuti", body: [
          { p: "Unaweza kutumia tovuti kwa madhumuni halali pekee. Hupaswi:" },
          { list: [
            "kuvunja sheria yoyote ya Tanzania unapotumia tovuti, ikiwemo Sheria ya Makosa ya Mtandao, 2015;",
            "kujaribu kuingia bila idhini kwenye tovuti, mfumo wetu wa wateja au mifumo yetu;",
            "kuingiza virusi au programu nyingine hatari, au kuielemea au kuivuruga tovuti;",
            "kunakili maudhui ya tovuti kwa wingi kwa njia za kiotomatiki;",
            "kutuma barua taka, au taarifa za uongo au zinazopotosha, kupitia fomu zetu;",
            "kujifanya mtu mwingine.",
          ] },
        ] },
        { id: "intellectual-property", h: "Maudhui yetu na hakimiliki", body: [
          { p: "Maandishi, muundo, michoro, pamoja na jina na nembo ya Bluetrain kwenye tovuti ni mali ya Bluetrain au yanatumika kwa ruhusa. Unaweza kutazama tovuti na kushiriki viungo vyake. Kunakili au kutumia tena maudhui yetu kwa madhumuni mengine kunahitaji ruhusa yetu ya maandishi." },
          { p: "Majina, nembo na alama za biashara za wateja zinazoonyeshwa kwenye tovuti ni mali ya wamiliki wake. Kuonyeshwa kwake hakumaanishi wamiliki hao wanaidhinisha chochote zaidi ya kazi iliyoelezwa." },
        ] },
        { id: "informed", h: "Makala za Bluetrain Informed", body: [
          { p: "Makala za Bluetrain Informed ni taarifa za jumla, si ushauri wa kitaalamu, wa kisheria wala wa kifedha. Zinaakisi mtazamo wetu wakati zilipochapishwa na zinaweza kupitwa na wakati. Tafadhali pata ushauri unaohusu hali yako kabla ya kuzifanyia kazi." },
        ] },
        { id: "enquiries", h: "Maombi na miadi", body: [
          { p: "Kutuma fomu au kuweka miadi ya mazungumzo hakuanzishi mkataba. Tunatoa huduma chini ya makubaliano tofauti ya maandishi pekee, na tunaweza kukataa ombi. Tafadhali toa taarifa sahihi ili tuweze kukujibu." },
        ] },
        { id: "links", h: "Viungo vya tovuti nyingine", body: [
          { p: "Tovuti inaweza kuwa na viungo vya tovuti nyingine, kama kurasa zetu za mitandao ya kijamii. Hatuzidhibiti tovuti hizo na hatuwajibiki kwa maudhui yake au jinsi zinavyoshughulikia taarifa zako." },
        ] },
        { id: "availability", h: "Upatikanaji wa tovuti", body: [
          { p: "Tunajitahidi kuhakikisha tovuti ni sahihi na inapatikana, lakini hatuhakikishi kuwa itapatikana wakati wote, haitakuwa na makosa au itakuwa ya karibuni. Tunaweza kubadilisha, kusimamisha au kuondoa sehemu yoyote bila taarifa." },
        ] },
        { id: "liability", h: "Wajibu wetu", body: [
          { p: "Tovuti inatolewa \"kama ilivyo\". Kwa kiwango kinachoruhusiwa na sheria za Tanzania, Bluetrain haiwajibiki kwa hasara yoyote isiyo ya moja kwa moja au inayotokana, wala kwa upotevu wa faida, taarifa au biashara, unaotokana na matumizi yako ya tovuti au kutegemea maudhui yake. Hakuna chochote katika masharti haya kinachopunguza wajibu ambao hauwezi kupunguzwa kisheria." },
        ] },
        { id: "privacy", h: "Faragha", body: [
          { p: "[Sera yetu ya Faragha](#/privacy) inaeleza jinsi tunavyokusanya na kutumia taarifa binafsi kupitia tovuti." },
        ] },
        { id: "changes", h: "Mabadiliko ya masharti haya", body: [
          { p: "Tunaweza kusasisha masharti haya mara kwa mara. Tarehe ya kuanza kutumika iliyo juu inaonyesha toleo la karibuni. Ukiendelea kutumia tovuti baada ya mabadiliko, unakubali masharti yaliyosasishwa." },
        ] },
        { id: "law", h: "Sheria inayotumika na migogoro", body: [
          { p: "Masharti haya yanasimamiwa na sheria za Jamhuri ya Muungano wa Tanzania. Mgogoro ukitokea, tutajaribu kwanza kuutatua nawe kwa nia njema. Tusipoweza, mahakama za Tanzania zitakuwa na mamlaka." },
        ] },
        { id: "contact", h: "Wasiliana nasi", body: [
          { p: `Bluetrain Limited, ${ADDRESS}. Barua pepe [${EMAIL}](mailto:${EMAIL}).` },
        ] },
      ],
    },
  },
};
