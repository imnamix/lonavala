export type Language = "en" | "mr" | "hi";

export interface Translations {
  common: {
    councilName: string;
    councilSub: string;
    govtMaharashtra: string;
    applyOnline: string;
    details: string;
    viewAll: string;
    search: string;
    callNow: string;
    downloadPdf: string;
    backToHome: string;
    status: string;
    readMore: string;
  };
  nav: {
    home: string;
    aboutLmc: string;
    aboutCouncil: string;
    aboutCouncilDesc: string;
    electedCouncil: string;
    electedCouncilDesc: string;
    departments: string;
    court: string;
    services: string;
    grievance: string;
    registerGrievance: string;
    registerGrievanceDesc: string;
    trackStatus: string;
    trackStatusDesc: string;
    tourism: string;
    citizenCorner: string;
    noticesCirculars: string;
    noticesCircularsDesc: string;
    tenders: string;
    tendersDesc: string;
    recruitment: string;
    recruitmentDesc: string;
    ongoingProjects: string;
    ongoingProjectsDesc: string;
    financeBudget: string;
    financeBudgetDesc: string;
    rtiRts: string;
    rtiRtsDesc: string;
    downloads: string;
    downloadsDesc: string;
    faq: string;
    faqDesc: string;
    contactHelpdesk: string;
    contactHelpdeskDesc: string;
    citizenPortal: string;
    mobileNavMenu: string;
  };
  emergencyBanner: {
    controlRoom: string;
    monsoonHelpline: string;
    fire: string;
    police: string;
    disasterMgmt: string;
    lodgeComplaint: string;
    tollFree: string;
  };
  hero: {
    portalBadge: string;
    welcomePrefix: string;
    councilName: string;
    tagline: string;
    searchPlaceholder: string;
    searchBtn: string;
    payTax: string;
    fileGrievance: string;
    tourismGuide: string;
    quickTags: {
      tax: string;
      water: string;
      birth: string;
      grievance: string;
      tourism: string;
      tenders: string;
    };
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    exploreAll: string;
    daysTimeline: string;
    items: {
      propertyTax: { title: string; desc: string; timeline: string };
      waterBill: { title: string; desc: string; timeline: string };
      birthCert: { title: string; desc: string; timeline: string };
      deathCert: { title: string; desc: string; timeline: string };
      buildingPermit: { title: string; desc: string; timeline: string };
      tradeLicense: { title: string; desc: string; timeline: string };
      noc: { title: string; desc: string; timeline: string };
      onlinePay: { title: string; desc: string; timeline: string };
    };
  };
  stateLeadership: {
    badge: string;
    title: string;
    subtitle: string;
    cm: { name: string; position: string; role: string };
    dcm1: { name: string; position: string; role: string };
    dcm2: { name: string; position: string; role: string };
    mla: { name: string; position: string; role: string };
  };
  council: {
    badge: string;
    title: string;
    subtitle: string;
    presidentDesignation: string;
    presidentQuote: string;
    tenure: string;
    vpDesignation: string;
    coDesignation: string;
    viewAllMembers: string;
  };
  tourism: {
    badge: string;
    title: string;
    subtitle: string;
    weatherCity: string;
    weatherCondition: string;
    ghatsStatus: string;
    viewAllSpots: string;
    spots: {
      tigerPoint: { name: string; desc: string };
      bhushiDam: { name: string; desc: string };
      karlaCaves: { name: string; desc: string };
      rajmachi: { name: string; desc: string };
    };
  };
  notices: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: {
      all: string;
      notices: string;
      circulars: string;
      orders: string;
      news: string;
      events: string;
    };
    repository: string;
    viewAll: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    viewAll: string;
    statusOngoing: string;
    statusCompleted: string;
    budgetLabel: string;
    progressLabel: string;
  };
  emergencyContacts: {
    badge: string;
    title: string;
    subtitle: string;
    viewAllExtensions: string;
    callPrefix: string;
    cards: {
      controlRoom: { title: string; desc: string; badge: string };
      fire: { title: string; desc: string; badge: string };
      police: { title: string; desc: string; badge: string };
      hospital: { title: string; desc: string; badge: string };
    };
  };
  stats: {
    badge: string;
    title: string;
    subtitle: string;
    citizensServed: { label: string; sub: string };
    resolutionSla: { label: string; sub: string };
    annualTourists: { label: string; sub: string };
    digitalServices: { label: string; sub: string };
    cleanRank: { label: string; sub: string };
    protectedArea: { label: string; sub: string };
  };
  appPromo: {
    badge: string;
    title: string;
    desc: string;
    features: [string, string, string, string];
    downloadApple: string;
    downloadGoogle: string;
    scanToInstall: string;
    appName: string;
    compatibility: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    subscribeBtn: string;
    thankYou: string;
    privacyNotice: string;
  };
  footer: {
    aboutTitle: string;
    aboutSub: string;
    aboutDesc: string;
    address: string;
    officeHours: string;
    colCitizenServices: string;
    colGrievance: string;
    colQuickLinks: string;
    colOfficialPortals: string;
    colHelpdesk: string;
    emergencyControlRoom: string;
    emailHelpdesk: string;
    tollFreeNumber: string;
    copyright: string;
    privacyPolicy: string;
    termsOfUse: string;
    hyperlinkPolicy: string;
    rtiAct: string;
    sitemap: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      councilName: "Lonavala Municipal Council",
      councilSub: "लोणावळा नगरपरिषद • Govt. of Maharashtra",
      govtMaharashtra: "Government of Maharashtra",
      applyOnline: "Apply Online",
      details: "Details",
      viewAll: "View All",
      search: "Search",
      callNow: "Call Now",
      downloadPdf: "Download PDF",
      backToHome: "Back to Home",
      status: "Status",
      readMore: "Read More",
    },
    nav: {
      home: "Home",
      aboutLmc: "About LMC",
      aboutCouncil: "About Council",
      aboutCouncilDesc: "History, vision & municipal leadership",
      electedCouncil: "Elected Council",
      electedCouncilDesc: "President, Corporators & Ward details",
      departments: "Departments",
      court: "Court",
      services: "Services",
      grievance: "Grievance",
      registerGrievance: "Register Grievance",
      registerGrievanceDesc: "File a civic complaint in 5 simple steps",
      trackStatus: "Track Status",
      trackStatusDesc: "Check live resolution timeline",
      tourism: "Tourism",
      citizenCorner: "Citizen Corner",
      noticesCirculars: "Notices & Circulars",
      noticesCircularsDesc: "Public announcements & official notices",
      tenders: "Tenders",
      tendersDesc: "Active e-procurement tenders",
      recruitment: "Recruitment",
      recruitmentDesc: "Municipal job openings & results",
      ongoingProjects: "Ongoing Projects",
      ongoingProjectsDesc: "Development works & smart city initiatives",
      financeBudget: "Finance & Budget",
      financeBudgetDesc: "Annual budget & audit reports",
      rtiRts: "RTI / RTS",
      rtiRtsDesc: "Right to Information & Public Services",
      downloads: "Downloads",
      downloadsDesc: "Citizen forms and civic documents",
      faq: "FAQs & Help",
      faqDesc: "Frequently asked questions & guidance",
      contactHelpdesk: "Contact Helpdesk",
      contactHelpdeskDesc: "Municipal offices & helpline numbers",
      citizenPortal: "Citizen Portal",
      mobileNavMenu: "Navigation Menu",
    },
    emergencyBanner: {
      controlRoom: "24x7 Control Room",
      monsoonHelpline: "Monsoon Ghat Helpline",
      fire: "Fire",
      police: "Police",
      disasterMgmt: "Disaster Mgmt",
      lodgeComplaint: "Lodge Complaint",
      tollFree: "Toll Free",
    },
    hero: {
      portalBadge: "लोणावळा नगरपरिषद • Official Citizen Portal",
      welcomePrefix: "Welcome to",
      councilName: "Lonavala Municipal Council",
      tagline:
        "Empowering citizens with rapid doorstep e-services, transparent 5-step grievance redressal, and eco-friendly Sahyadri hill-station governance.",
      searchPlaceholder: "Search citizen services, tax payment, forms, tenders...",
      searchBtn: "Search",
      payTax: "Pay Property Tax",
      fileGrievance: "File Grievance",
      tourismGuide: "Explore Tourism",
      quickTags: {
        tax: "Property Tax",
        water: "Water Bill",
        birth: "Birth Certificate",
        grievance: "Lodge Grievance",
        tourism: "Tourism Guide",
        tenders: "Active Tenders",
      },
    },
    services: {
      badge: "Doorstep Delivery",
      title: "Quick Citizen Services",
      subtitle:
        "Access digital civic utilities, pay bills, download certificates, and track applications online.",
      exploreAll: "Explore All 32 Services",
      daysTimeline: "Days",
      items: {
        propertyTax: {
          title: "Property Tax Assessment",
          desc: "Calculate tax, view arrears & get 5% early-bird rebate online.",
          timeline: "Instant Online Clearance",
        },
        waterBill: {
          title: "Water Meter Bill & New Connection",
          desc: "Instant water bill payments & application for new metered connections.",
          timeline: "3 - 7 Working Days",
        },
        birthCert: {
          title: "Birth Certificate Issuance",
          desc: "Digital QR-verified birth certificates within 3 to 5 working days.",
          timeline: "3 - 5 Working Days",
        },
        deathCert: {
          title: "Death Certificate Registration",
          desc: "Certified municipal death registration & official extracts.",
          timeline: "3 - 5 Working Days",
        },
        buildingPermit: {
          title: "Building Permissions (AutoDCR)",
          desc: "AutoDCR online building plan sanctions & commencement permits.",
          timeline: "30 - 45 Days",
        },
        tradeLicense: {
          title: "Trade License & Renewals",
          desc: "New trade licenses & annual renewals for shops, resorts & chikkis.",
          timeline: "7 - 14 Working Days",
        },
        noc: {
          title: "No Objection Certificates (NOC)",
          desc: "Fast-track Fire, Tree cutting, Drainage & Road digging clearances.",
          timeline: "7 - 10 Working Days",
        },
        onlinePay: {
          title: "Unified Civic Online Payment (BBPS)",
          desc: "Unified BBPS gateway for taxes, water bills, rents & challans.",
          timeline: "Instant Digital Receipt",
        },
      },
    },
  stateLeadership: {
      badge: "State & Regional Leadership",
      title: "Key Dignitaries & People's Representatives",
      subtitle:
        "Guiding Maharashtra's progress, state-level development policies, and regional infrastructure for Lonavala.",
      cm: {
        name: "Shri. Devendra Fadnavis",
        position: "Hon'ble Chief Minister, Maharashtra State",
        role: "Chief Minister",
      },
      dcm1: {
        name: "Shri. Eknath Shinde",
        position: "Hon'ble Deputy Chief Minister, Maharashtra State",
        role: "Deputy Chief Minister",
      },
      dcm2: {
        name: "Shri. Ajit Pawar",
        position: "Hon'ble Deputy Chief Minister, Maharashtra State",
        role: "Deputy Chief Minister",
      },
      mla: {
        name: "Shri. Sunil Shelke",
        position: "Hon'ble Member of Legislative Assembly (MLA), Maval-Lonavala",
        role: "Local MLA",
      },
    },
    council: {
      badge: "Civic Leadership",
      title: "Council Overview",
      subtitle:
        "Elected representatives and administrative officers steering sustainable development and citizen services.",
      presidentDesignation: "President (नगराध्यक्ष)",
      presidentQuote:
        "Ensuring sustainable hill-station infrastructure, transparent governance, and doorstep services for every citizen.",
      tenure: "Tenure: 2022 - 2027",
      vpDesignation: "Vice President (उपनगराध्यक्ष)",
      coDesignation: "Chief Officer / Commissioner (मुख्याधिकारी)",
      viewAllMembers: "View All Corporators & Standing Committees",
    },
    tourism: {
      badge: "Jewel of Sahyadri",
      title: "Tourism Highlights",
      subtitle:
        "Discover misty peaks, monsoon waterfalls, historic rock-cut caves, and Maratha fortresses.",
      weatherCity: "Lonavala: 22°C • Pleasant Fog",
      weatherCondition: "Pleasant Fog",
      ghatsStatus: "Ghats Open • High Tourism Rush",
      viewAllSpots: "Explore All Scenic Spots",
      spots: {
        tigerPoint: {
          name: "Tiger Point (Lions Point)",
          desc: "Echo cliff viewpoint with 650m sheer drop and misty Sahyadri valley vistas.",
        },
        bhushiDam: {
          name: "Bhushi Dam Cascades",
          desc: "Iconic monsoon terraced masonry dam with roaring stepped waterfalls.",
        },
        karlaCaves: {
          name: "Karla Buddhist Caves",
          desc: "2,200-year-old rock-cut Buddhist chaityas and Ekvira Aai pilgrimage temple.",
        },
        rajmachi: {
          name: "Rajmachi Fort & Trek",
          desc: "Twin historic Maratha fortresses overlooking Borghat and firefly forests.",
        },
      },
    },
    notices: {
      badge: "Public Information & Gazettes",
      title: "Important Notices & Announcements",
      subtitle:
        "Official circulars, municipal gazettes, council resolutions, and civic alerts.",
      tabs: {
        all: "All",
        notices: "Notices",
        circulars: "Circulars",
        orders: "Orders",
        news: "News",
        events: "Events",
      },
      repository: "Repository",
      viewAll: "View All",
    },
    projects: {
      badge: "Civic Infrastructure",
      title: "Transforming Lonavala Infrastructure",
      subtitle:
        "Track progress of key works: underground sewerage, Tiger Point skywalk, and the new 24x7 municipal hospital.",
      viewAll: "View All Projects",
      statusOngoing: "Ongoing",
      statusCompleted: "Completed",
      budgetLabel: "Sanctioned Budget",
      progressLabel: "Work Progress",
    },
    emergencyContacts: {
      badge: "Emergency Preparedness",
      title: "Emergency Contacts & 24x7 Helplines",
      subtitle:
        "Dedicated hill-station response units stationed across Lonavala, Khandala, and dam areas.",
      viewAllExtensions: "View All Department Extensions & Officer Contacts →",
      callPrefix: "Call",
      cards: {
        controlRoom: {
          title: "24x7 Disaster Control Room",
          desc: "Monsoon floods, landslides, fallen trees & alerts.",
          badge: "Toll Free",
        },
        fire: {
          title: "Fire Brigade & Rescue",
          desc: "Fire suppression, waterfall & valley cliff rescues.",
          badge: "Emergency",
        },
        police: {
          title: "City Police Station",
          desc: "Tourist security, traffic regulation & police help.",
          badge: "Law & Order",
        },
        hospital: {
          title: "Hospital & Ambulance (108)",
          desc: "Trauma ambulances & emergency maternity hospital.",
          badge: "Medical",
        },
      },
    },
    stats: {
      badge: "Performance Metrics",
      title: "Lonavala Municipal Council at a Glance",
      subtitle:
        "Real-time milestones delivering rapid, sustainable, and transparent civic governance.",
      citizensServed: { label: "Citizens Served", sub: "Across 5 Wards" },
      resolutionSla: { label: "Resolution SLA", sub: "Avg: 3 Days" },
      annualTourists: { label: "Annual Tourists", sub: "Sahyadri Gateway" },
      digitalServices: { label: "Digital Services", sub: "100% Online" },
      cleanRank: { label: "Clean City Rank", sub: "Swachh Survekshan" },
      protectedArea: { label: "Protected Area", sub: "Eco-Sensitive Zone" },
    },
    appPromo: {
      badge: "Citizen Mobile Application",
      title: "Maha-Lonavala 311\nDoorstep Services on Your Smartphone",
      desc: "Report potholes, water leaks, or garbage dumps with geo-tagged photos in under 60 seconds. Receive live SMS updates directly as our municipal field workers resolve your ticket.",
      features: [
        "Camera photo upload & GPS tagging",
        "Pay Property Tax & Water Bills via UPI",
        "Monsoon landslide & weather flash alerts",
        "Real-time officer assignment tracking",
      ],
      downloadApple: "Apple App Store",
      downloadGoogle: "Google Play",
      scanToInstall: "Scan to Install",
      appName: "Maha-Lonavala 311 App",
      compatibility: "Compatible with iOS 14+ & Android 9.0+",
    },
    faq: {
      badge: "Citizen Help & Guidance",
      title: "Frequently Asked Questions",
      subtitle:
        "Common queries regarding property tax schedules, water connections, tourism rules, and grievance procedures.",
      items: [
        {
          question: "How can I pay my Property Tax online and claim the early rebate?",
          answer:
            "Visit the Services page, select 'Property Tax', enter your Assessment ID or Ward number, review arrears, and pay via Net Banking, UPI, or Credit Card. Payments completed before June 30 receive an automatic 5% rebate.",
        },
        {
          question: "What is the procedure for registering a civic grievance?",
          answer:
            "Citizens can register grievances via the 5-step Grievance portal or Maha-Lonavala 311 app. Upload a photo, select your ward and category, and submit. You will receive an SMS with a tracking token and guaranteed resolution within 3 to 7 days.",
        },
        {
          question: "What are the timings and entry rules for Bhushi Dam and Tiger Point?",
          answer:
            "Bhushi Dam is accessible daily from 09:00 AM to 05:00 PM during the monsoon. Tiger Point remains open until 06:30 PM. Swimming beyond demarcated safety barriers is strictly prohibited by order of the Sub-Divisional Magistrate.",
        },
        {
          question: "How can I obtain a digitised QR-coded Birth or Death certificate?",
          answer:
            "Search by date of event and parent/deceased name in the Health Department portal. Verified certificates can be downloaded instantly with a state government digital signature without visiting the municipal council office.",
        },
      ],
    },
    newsletter: {
      title: "Subscribe to LMC Civic Bulletin & Alerts",
      subtitle:
        "Stay informed with weekly municipal updates, property tax rebate announcements, monsoon hill station safety advisories, and council decisions.",
      placeholder: "Enter your email address...",
      subscribeBtn: "Subscribe",
      thankYou: "Thank you! You have subscribed to the official LMC Civic Bulletin.",
      privacyNotice: "We respect your privacy. No spam. You may unsubscribe anytime.",
    },
    footer: {
      aboutTitle: "Lonavala Municipal Council",
      aboutSub: "लोणावळा नगरपरिषद",
      aboutDesc:
        "Governing body for the hill-station of Lonavala in Pune district, Maharashtra. Committed to eco-sensitive tourism, modern infrastructure, sustainable waste management, and transparent citizen-centric e-governance.",
      address:
        "Administrative Building, Old NH-4, Lonavala, Dist. Pune, Maharashtra - 410401",
      officeHours:
        "Office Hours: Mon - Sat: 09:45 AM - 05:45 PM (2nd & 4th Sat Holiday)",
      colCitizenServices: "Citizen Services",
      colGrievance: "Grievance Redressal",
      colQuickLinks: "Quick Links",
      colOfficialPortals: "Official Portals",
      colHelpdesk: "Helpdesk & Office",
      emergencyControlRoom: "24x7 Control Room",
      emailHelpdesk: "Email Helpdesk",
      tollFreeNumber: "Toll-Free Helpline",
      copyright:
        "© 2026 Lonavala Municipal Council, Govt. of Maharashtra. All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfUse: "Terms of Use",
      hyperlinkPolicy: "Hyperlink Policy",
      rtiAct: "RTI Act 2005",
      sitemap: "Sitemap",
    },
  },
  mr: {
    common: {
      councilName: "लोणावळा नगरपरिषद",
      councilSub: "लोणावळा नगरपरिषद • महाराष्ट्र शासन",
      govtMaharashtra: "महाराष्ट्र शासन",
      applyOnline: "ऑनलाइन अर्ज करा",
      details: "तपशील",
      viewAll: "सर्व पहा",
      search: "शोधा",
      callNow: "कॉल करा",
      downloadPdf: "पीडीएफ डाउनलोड करा",
      backToHome: "मुख्य पृष्ठावर जा",
      status: "स्थिती",
      readMore: "अधिक वाचा",
    },
    nav: {
      home: "मुखपृष्ठ",
      aboutLmc: "नगरपरिषदेविषयी",
      aboutCouncil: "परिषदेची माहिती",
      aboutCouncilDesc: "इतिहास, उद्दिष्टे व प्रशासकीय नेतृत्व",
      electedCouncil: "लोकप्रतिनिधी व नगरसेवक",
      electedCouncilDesc: "नगराध्यक्ष, उपनगराध्यक्ष व प्रभाग सदस्य",
      departments: "विभाग",
      court: "न्यायालय",
      services: "नागरी सेवा",
      grievance: "तक्रार निवारण",
      registerGrievance: "तक्रार नोंदवा",
      registerGrievanceDesc: "५ सोप्या टप्प्यांत नागरी तक्रार नोंदवा",
      trackStatus: "तक्रार स्थिती पहा",
      trackStatusDesc: "थेट निवारण प्रगतीचा मागोवा घ्या",
      tourism: "पर्यटन",
      citizenCorner: "नागरिक कक्ष",
      noticesCirculars: "सूचना आणि परिपत्रके",
      noticesCircularsDesc: "सार्वजनिक घोषणा व अधिकृत परिपत्रके",
      tenders: "ई-निविदा",
      tendersDesc: "सक्रिय ई-प्रोक्योरमेंट निविदा",
      recruitment: "भरती",
      recruitmentDesc: "नगरपरिषद नोकरभरती व निकाल",
      ongoingProjects: "चालू विकासकामे",
      ongoingProjectsDesc: "पायाभूत सुविधा व स्मार्ट प्रकल्प",
      financeBudget: "वित्त आणि अंदाजपत्रक",
      financeBudgetDesc: "वार्षिक अंदाजपत्रक व लेखापरीक्षण अहवाल",
      rtiRts: "माहिती अधिकार / लोकसेवा हक्क",
      rtiRtsDesc: "माहितीचा अधिकार व महाराष्ट्र लोकसेवा हक्क अधिनियम",
      downloads: "फॉर्म व दस्तऐवज",
      downloadsDesc: "नागरी अर्ज आणि विविध विहित नमुने",
      faq: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
      faqDesc: "नागरी प्रश्न, कर व सेवांविषयी उत्तरे",
      contactHelpdesk: "संपर्क व मदत कक्ष",
      contactHelpdeskDesc: "नगरपरिषद कार्यालये व हेल्पलाइन क्रमांक",
      citizenPortal: "नागरिक पोर्टल",
      mobileNavMenu: "नेव्हिगेशन मेनू",
    },
    emergencyBanner: {
      controlRoom: "२४x७ नियंत्रण कक्ष",
      monsoonHelpline: "पावसाळी घाट मदत कक्ष",
      fire: "अग्निशामक",
      police: "पोलीस",
      disasterMgmt: "आपत्ती व्यवस्थापन",
      lodgeComplaint: "तक्रार नोंदवा",
      tollFree: "टोल फ्री",
    },
    hero: {
      portalBadge: "लोणावळा नगरपरिषद • अधिकृत नागरिक पोर्टल",
      welcomePrefix: "आपले स्वागत आहे",
      councilName: "लोणावळा नगरपरिषद",
      tagline:
        "जलद घरपोच ई-सेवा, पारदर्शक ५-टप्प्यांची तक्रार निवारण प्रणाली आणि सह्याद्रीच्या पर्यावरणास अनुकूल प्रशासनासह नागरिकांचे सक्षमीकरण.",
      searchPlaceholder: "नागरी सेवा, कर भरणा, जन्म प्रमाणपत्र, निविदा शोधा...",
      searchBtn: "शोधा",
      payTax: "मालमत्ता कर भरा",
      fileGrievance: "तक्रार नोंदवा",
      tourismGuide: "पर्यटन मार्गदर्शक",
      quickTags: {
        tax: "मालमत्ता कर",
        water: "पाणीपट्टी बिल",
        birth: "जन्म दाखला",
        grievance: "तक्रार नोंदणी",
        tourism: "पर्यटन स्थळे",
        tenders: "ई-निविदा",
      },
    },
    services: {
      badge: "घरपोच नागरी सेवा",
      title: "जलद नागरिक सेवा",
      subtitle:
        "डिजिटल नागरी सुविधा, कर भरणा, प्रमाणपत्रे डाउनलोड आणि अर्जाचा मागोवा थेट ऑनलाइन घ्या.",
      exploreAll: "सर्व ३२ सेवा पहा",
      daysTimeline: "दिवस",
      items: {
        propertyTax: {
          title: "मालमत्ता कर आकारणी व भरणा",
          desc: "कर मोजा, थकबाकी तपासा आणि ५% सवलतीसह ऑनलाइन कर भरा.",
          timeline: "त्वरित ऑनलाइन पावती",
        },
        waterBill: {
          title: "पाणीपट्टी बिल व नवीन नळ जोडणी",
          desc: "त्वरित पाणीपट्टी भरणा व नवीन मीटर जोडणीसाठी ऑनलाइन अर्ज.",
          timeline: "३ - ७ कामकाजाचे दिवस",
        },
        birthCert: {
          title: "जन्म प्रमाणपत्र नोंदणी व दाखला",
          desc: "डिजिटल क्यूआर कोड पडताळणीसह ३ ते ५ दिवसांत जन्म प्रमाणपत्र मिळवा.",
          timeline: "३ - ५ कामकाजाचे दिवस",
        },
        deathCert: {
          title: "मृत्यू प्रमाणपत्र नोंदणी",
          desc: "अधिकृत नगरपरिषद मृत्यू नोंदणी व प्रमाणित डिजिटल उतारे.",
          timeline: "३ - ५ कामकाजाचे दिवस",
        },
        buildingPermit: {
          title: "बांधकाम परवानगी (AutoDCR)",
          desc: "AutoDCR ऑनलाइन इमारत नकाशा मंजुरी व बांधकाम प्रारंभ दाखला.",
          timeline: "३० - ४५ दिवस",
        },
        tradeLicense: {
          title: "व्यवसाय परवाना व नूतनीकरण",
          desc: "नवीन व्यवसाय परवाना व हॉटेल्स, चिक्की दुकानांसाठी वार्षिक नूतनीकरण.",
          timeline: "७ - १४ कामकाजाचे दिवस",
        },
        noc: {
          title: "ना-हरकत प्रमाणपत्र (NOC)",
          desc: "अग्निशामक, वृक्षतोड, ड्रेनेज व रस्ता खोदणे तात्काळ ना-हरकत दाखले.",
          timeline: "७ - १० कामकाजाचे दिवस",
        },
        onlinePay: {
          title: "एकत्रित नागरी देयक भरणा (BBPS)",
          desc: "सर्व कर, पाणीपट्टी, भाडे व दंड भरण्यासाठी एकत्रित BBPS गेटवे.",
          timeline: "त्वरित डिजिटल पावती",
        },
      },
    },
  stateLeadership: {
      badge: "राज्य व प्रादेशिक नेतृत्व",
      title: "प्रमुख शासनकर्ते व लोकप्रतिनिधी",
      subtitle:
        "महाराष्ट्राचा शाश्वत विकास आणि लोणावळा-मावळ परिसराच्या पायाभूत विकासाला दिशा देणारे आदरणीय नेतृत्व.",
      cm: {
        name: "श्री. देवेंद्र फडणवीस",
        position: "मा. मुख्यमंत्री, महाराष्ट्र राज्य",
        role: "मुख्यमंत्री",
      },
      dcm1: {
        name: "श्री. एकनाथ शिंदे",
        position: "मा. उपमुख्यमंत्री, महाराष्ट्र राज्य",
        role: "उपमुख्यमंत्री",
      },
      dcm2: {
        name: "श्री. अजित पवार",
        position: "मा. उपमुख्यमंत्री, महाराष्ट्र राज्य",
        role: "उपमुख्यमंत्री",
      },
      mla: {
        name: "श्री. सुनील शेळके",
        position: "मा. आमदार, मावळ-लोणावळा विधानसभा मतदारसंघ",
        role: "स्थानिक आमदार",
      },
    },
    council: {
      badge: "नगरपरिषद नेतृत्व",
      title: "नगरपरिषद प्रशासन व नेतृत्व",
      subtitle:
        "लोणावळ्याच्या शाश्वत विकासासाठी कटिबद्ध लोकप्रतिनिधी आणि प्रशासकीय अधिकारी.",
      presidentDesignation: "नगराध्यक्ष",
      presidentQuote:
        "शाश्वत पर्यटन पायाभूत सुविधा, पारदर्शक प्रशासन आणि प्रत्येक नागरिकाला घरपोच सेवा देण्यासाठी आम्ही कटिबद्ध आहोत.",
      tenure: "कार्यकाळ: २०२२ - २०२७",
      vpDesignation: "उपनगराध्यक्ष",
      coDesignation: "मुख्याधिकारी / आयुक्त",
      viewAllMembers: "सर्व नगरसेवक व विषय समित्या पहा",
    },
    tourism: {
      badge: "सह्याद्रीचे वैभव",
      title: "लोणावळ्याची प्रमुख पर्यटन स्थळे",
      subtitle:
        "धुके, फेसाळणारे धबधबे, २,२०० वर्षे जुनी ऐतिहासिक लेणी आणि छत्रपती शिवरायांचे अभेद्य किल्ले.",
      weatherCity: "लोणावळा: २२°से • आल्हाददायक धुके",
      weatherCondition: "आल्हाददायक धुके",
      ghatsStatus: "घाटमार्ग खुला • पर्यटकांची गर्दी",
      viewAllSpots: "सर्व २४ निसर्गरम्य स्थळे पहा",
      spots: {
        tigerPoint: {
          name: "टायगर पॉईंट (लायन्स पॉईंट)",
          desc: "६५० मीटर खोल दरी आणि सह्याद्रीच्या विहंगम दृश्यांचा प्रतिध्वनी कडा.",
        },
        bhushiDam: {
          name: "भुशी धरण पायऱ्यांचा धबधबा",
          desc: "पावसाळ्यात पायऱ्यांवरून वाहणारा लोणावळ्यातील जगप्रसिद्ध दगडी धरण धबधबा.",
        },
        karlaCaves: {
          name: "कार्ला बौद्ध लेणी",
          desc: "२,२०० वर्षे जुनी बौद्ध चैत्यगृहे आणि श्री आई एकविरा देवीचे पवित्र तीर्थक्षेत्र.",
        },
        rajmachi: {
          name: "राजमाची किल्ला व ट्रेक",
          desc: "बोरघाटावर पहारा देणारे जुळे ऐतिहासिक किल्ले आणि काजव्यांचे निसर्गरम्य जंगल.",
        },
      },
    },
    notices: {
      badge: "सार्वजनिक राजपत्र व परिपत्रके",
      title: "महत्त्वाच्या सूचना व निविदा",
      subtitle:
        "शासकीय परिपत्रके, नगरपरिषद ठराव, नागरिक सूचना आणि अधिकृत निविदा.",
      tabs: {
        all: "सर्व",
        notices: "सूचना",
        circulars: "परिपत्रके",
        orders: "आदेश",
        news: "बातम्या",
        events: "कार्यक्रम",
      },
      repository: "दस्तऐवज संग्रह",
      viewAll: "सर्व पहा",
    },
    projects: {
      badge: "नागरी पायाभूत सुविधा",
      title: "लोणावळ्याचा सर्वांगीण विकास",
      subtitle:
        "चालू विकासकामे: भूमिगत मलनिस्सारण, टायगर पॉईंट स्कायवॉक आणि नवीन २४x७ नगरपरिषद रुग्णालय.",
      viewAll: "सर्व प्रकल्प पहा",
      statusOngoing: "चालू",
      statusCompleted: "पूर्ण",
      budgetLabel: "मंजूर निधी",
      progressLabel: "कामाची प्रगती",
    },
    emergencyContacts: {
      badge: "आपत्कालीन सज्जता",
      title: "आपत्कालीन व २४x७ मदत कक्ष संपर्क",
      subtitle:
        "लोणावळा शहर, खंडाळा व धरण परिसरासाठी सज्ज तत्पर आपत्कालीन प्रतिसाद पथके.",
      viewAllExtensions: "सर्व विभाग विस्तार व अधिकारी संपर्क पहा →",
      callPrefix: "कॉल करा",
      cards: {
        controlRoom: {
          title: "२४x७ आपत्ती नियंत्रण कक्ष",
          desc: "पावसाळी पूर, दरड कोसळणे, झाडे पडणे व तात्काळ मदत.",
          badge: "टोल फ्री",
        },
        fire: {
          title: "अग्निशामक व बचाव दल",
          desc: "आग विझवणे, धबधबे व दरीतील रेस्क्यू ऑपरेशन्स.",
          badge: "आपत्कालीन",
        },
        police: {
          title: "लोणावळा शहर पोलीस ठाणे",
          desc: "पर्यटक सुरक्षा, वाहतूक नियमन व कायदा-सुव्यवस्था.",
          badge: "पोलीस मदत",
        },
        hospital: {
          title: "रुग्णालय व रुग्णवाहिका (१०८)",
          desc: "तातडीची ट्रॉमा रुग्णवाहिका व नगरपरिषद प्रसूतिगृह.",
          badge: "वैद्यकीय मदत",
        },
      },
    },
    stats: {
      badge: "प्रगती आलेख",
      title: "लोणावळा नगरपरिषद एका दृष्टिक्षेपात",
      subtitle:
        "पारदर्शक, गतिमान आणि पर्यावरणपूरक नागरी प्रशासनाचे प्रमुख टप्पे.",
      citizensServed: { label: "नागरिकांना सेवा", sub: "५ प्रभागांमध्ये" },
      resolutionSla: { label: "तक्रार निवारण दर", sub: "सरासरी: ३ दिवस" },
      annualTourists: { label: "वार्षिक पर्यटक", sub: "सह्याद्रीचे प्रवेशद्वार" },
      digitalServices: { label: "डिजिटल सेवा", sub: "१००% ऑनलाइन" },
      cleanRank: { label: "स्वच्छ शहर रँक", sub: "स्वच्छ सर्वेक्षण" },
      protectedArea: { label: "संरक्षित हरित क्षेत्र", sub: "पर्यावरण संवेदनशील क्षेत्र" },
    },
    appPromo: {
      badge: "नागरिक मोबाईल ॲप",
      title: "महा-लोणावळा ३११\nसर्व सेवा आता आपल्या मोबाईलवर",
      desc: "रस्त्यावरील खड्डे, पाणी गळती किंवा कचऱ्याची तक्रार जिओ-टॅग फोटोसह अवघ्या ६० सेकंदात नोंदवा आणि थेट एसएमएस अपडेट मिळवा.",
      features: [
        "कॅमेऱ्याने फोटो अपलोड व थेट जीपीएस टॅगिंग",
        "मालमत्ता कर व पाणी बिल थेट UPI द्वारे भरा",
        "पावसाळी दरड व हवामानाविषयी तात्काळ इशारे",
        "अधिकाऱ्यांच्या कामाचा थेट मागोवा घ्या",
      ],
      downloadApple: "Apple App Store",
      downloadGoogle: "Google Play",
      scanToInstall: "स्कॅन करून डाउनलोड करा",
      appName: "महा-लोणावळा ३११ ॲप",
      compatibility: "iOS 14+ व Android 9.0+ साठी सुसंगत",
    },
    faq: {
      badge: "नागरिक मदत व मार्गदर्शन",
      title: "वारंवार विचारले जाणारे प्रश्न (FAQ)",
      subtitle:
        "मालमत्ता कर, पाणीपट्टी, पर्यटन नियम आणि तक्रार निवारणाविषयी सर्व उत्तरे.",
      items: [
        {
          question: "मी मालमत्ता कर ऑनलाइन कसा भरू शकतो आणि सवलत कशी मिळेल?",
          answer:
            "नागरी सेवा पृष्ठावर जाऊन 'मालमत्ता कर' निवडा, आपला प्रभाग व मिळकत क्रमांक टाका आणि नेट बँकिंग, यूपीआय किंवा कार्डने कर भरा. ३० जूनपूर्वी कर भरल्यास ५% थेट सवलत मिळते.",
        },
        {
          question: "नागरी तक्रार नोंदवण्याची प्रक्रिया काय आहे?",
          answer:
            "५-टप्प्यांच्या तक्रार पोर्टलवर किंवा महा-लोणावळा ३११ ॲपद्वारे फोटो अपलोड करून प्रभाग निवडा व तक्रार नोंदवा. आपणास टोकन क्रमांक मिळेल आणि ३ ते ७ दिवसांत निवारण केले जाईल.",
        },
        {
          question: "भुशी डॅम आणि टायगर पॉईंटसाठी वेळेचे नियम काय आहेत?",
          answer:
            "भुशी डॅम पावसाळ्यात सकाळी ०९:०० ते संध्याकाळी ०५:०० पर्यंत सुरू असतो. टायगर पॉईंट संध्याकाळी ०६:३० पर्यंत खुला राहतो. सुरक्षेच्या दृष्टीने कठडे ओलांडून पाण्यात जाण्यास सक्त मनाई आहे.",
        },
        {
          question: "डिजिटल क्यूआर कोड असलेले जन्म किंवा मृत्यू प्रमाणपत्र कसे मिळवावे?",
          answer:
            "आरोग्य विभागाच्या पोर्टलवर घटनेची तारीख व नाव शोधून अधिकृत डिजिटल स्वाक्षरी असलेले प्रमाणपत्र त्वरित डाउनलोड करू शकता. कार्यालयात येण्याची आवश्यकता नाही.",
        },
      ],
    },
    newsletter: {
      title: "नगरपरिषदेचे नागरी बुलेटिन व सूचना मिळवा",
      subtitle:
        "साप्ताहिक नागरी अपडेट्स, मालमत्ता कर सवलत आणि पावसाळी हवामान सूचना थेट ईमेलवर मिळवा.",
      placeholder: "आपला ईमेल पत्ता प्रविष्ट करा...",
      subscribeBtn: "सदस्यता घ्या",
      thankYou: "धन्यवाद! आपण अधिकृत नागरी बुलेटिनची सदस्यता घेतली आहे.",
      privacyNotice: "आम्ही आपल्या गोपनीयतेचा आदर करतो. आपण कधीही सदस्यता रद्द करू शकता.",
    },
    footer: {
      aboutTitle: "लोणावळा नगरपरिषद",
      aboutSub: "लोणावळा नगरपरिषद • महाराष्ट्र शासन",
      aboutDesc:
        "महाराष्ट्र शासनाच्या अखत्यारीतील लोणावळा पर्यटन शहराचे प्रशासन. पर्यावरणपूरक पर्यटन, आधुनिक पायाभूत सुविधा आणि पारदर्शक ई-प्रशासनासाठी कटिबद्ध.",
      address:
        "प्रशासकीय इमारत, जुना राष्ट्रीय महामार्ग क्र. ४, लोणावळा, जि. पुणे, महाराष्ट्र - ४१०४०१",
      officeHours:
        "कार्यालयीन वेळ: सोम - शनि: सकाळी ०९:४५ ते सायं ०५:४५ (२ रा व ४ था शनिवार सुट्टी)",
      colCitizenServices: "नागरी सेवा",
      colGrievance: "तक्रार निवारण",
      colQuickLinks: "महत्त्वाचे दुवे",
      colOfficialPortals: "शासकीय पोर्टल्स",
      colHelpdesk: "मदत व नियंत्रण कक्ष",
      emergencyControlRoom: "२४x७ नियंत्रण कक्ष",
      emailHelpdesk: "ईमेल मदत कक्ष",
      tollFreeNumber: "टोल-फ्री हेल्पलाइन",
      copyright:
        "© २०२६ लोणावळा नगरपरिषद, महाराष्ट्र शासन. सर्व हक्क राखीव.",
      privacyPolicy: "गोपनीयता धोरण",
      termsOfUse: "वापराच्या अटी",
      hyperlinkPolicy: "हायपरलिंक धोरण",
      rtiAct: "माहिती अधिकार २००५",
      sitemap: "साइटमॅप",
    },
  },
  hi: {
    common: {
      councilName: "लोनावला नगर परिषद",
      councilSub: "लोनावला नगर परिषद • महाराष्ट्र सरकार",
      govtMaharashtra: "महाराष्ट्र सरकार",
      applyOnline: "ऑनलाइन आवेदन करें",
      details: "विवरण",
      viewAll: "सभी देखें",
      search: "खोजें",
      callNow: "कॉल करें",
      downloadPdf: "पीडीएफ डाउनलोड करें",
      backToHome: "मुख्य पृष्ठ पर जाएं",
      status: "स्थिति",
      readMore: "अधिक पढ़ें",
    },
    nav: {
      home: "मुख्य पृष्ठ",
      aboutLmc: "नगर परिषद के बारे में",
      aboutCouncil: "परिषद का परिचय",
      aboutCouncilDesc: "इतिहास, विजन एवं प्रशासनिक नेतृत्व",
      electedCouncil: "निर्वाचित परिषद व पार्षद",
      electedCouncilDesc: "अध्यक्ष, उपाध्यक्ष एवं वार्ड पार्षद",
      departments: "विभाग",
      court: "न्यायालय",
      services: "नागरिक सेवाएं",
      grievance: "शिकायत निवारण",
      registerGrievance: "शिकायत दर्ज करें",
      registerGrievanceDesc: "५ सरल चरणों में नागरिक शिकायत दर्ज करें",
      trackStatus: "स्थिति जांचें",
      trackStatusDesc: "लाइव समाधान प्रगति देखें",
      tourism: "पर्यटन",
      citizenCorner: "नागरिक कक्ष",
      noticesCirculars: "सूचनाएं और परिपत्र",
      noticesCircularsDesc: "सार्वजनिक घोषणाएं और आधिकारिक परिपत्र",
      tenders: "ई-निविदाएं",
      tendersDesc: "सक्रिय ई-प्रोक्योरमेंट निविदाएं",
      recruitment: "भर्ती",
      recruitmentDesc: "नगर परिषद भर्ती एवं परिणाम",
      ongoingProjects: "चल रही विकास परियोजनाएं",
      ongoingProjectsDesc: "बुनियादी ढांचा एवं स्मार्ट परियोजनाएं",
      financeBudget: "वित्त एवं बजट",
      financeBudgetDesc: "वार्षिक बजट एवं ऑडिट रिपोर्ट",
      rtiRts: "सूचना का अधिकार (RTI)",
      rtiRtsDesc: "सूचना का अधिकार एवं लोक सेवा गारंटी",
      downloads: "डाउनलोड व प्रपत्र",
      downloadsDesc: "नागरिक प्रपत्र एवं आधिकारिक दस्तावेज",
      faq: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      faqDesc: "नागरिक प्रश्न, कर एवं सेवाओं से संबंधित उत्तर",
      contactHelpdesk: "संपर्क व सहायता केंद्र",
      contactHelpdeskDesc: "नगर परिषद कार्यालय एवं हेल्पलाइन नंबर",
      citizenPortal: "नागरिक पोर्टल",
      mobileNavMenu: "नेविगेशन मेनू",
    },
    emergencyBanner: {
      controlRoom: "२४x७ नियंत्रण कक्ष",
      monsoonHelpline: "मानसून घाट हेल्पलाइन",
      fire: "अग्निशमन",
      police: "पुलिस",
      disasterMgmt: "आपदा प्रबंधन",
      lodgeComplaint: "शिकायत दर्ज करें",
      tollFree: "टोल फ्री",
    },
    hero: {
      portalBadge: "लोनावला नगर परिषद • आधिकारिक नागरिक पोर्टल",
      welcomePrefix: "में आपका स्वागत है",
      councilName: "लोनावला नगर परिषद",
      tagline:
        "त्वरित नागरिक ई-सेवाओं, पारदर्शी ५-चरणीय शिकायत निवारण और सह्याद्री के पर्यावरण-अनुकूल शासन के साथ नागरिकों का सशक्तिकरण।",
      searchPlaceholder: "नागरिक सेवाएं, कर भुगतान, जन्म प्रमाण पत्र, निविदाएं खोजें...",
      searchBtn: "खोजें",
      payTax: "संपत्ति कर भरें",
      fileGrievance: "शिकायत दर्ज करें",
      tourismGuide: "पर्यटन गाइड",
      quickTags: {
        tax: "संपत्ति कर",
        water: "जल कर बिल",
        birth: "जन्म प्रमाण पत्र",
        grievance: "शिकायत पंजीकरण",
        tourism: "पर्यटन स्थल",
        tenders: "ई-निविदाएं",
      },
    },
    services: {
      badge: "घर तक नागरिक सेवाएं",
      title: "त्वरित नागरिक सेवाएं",
      subtitle:
        "डिजिटल नागरिक सुविधाएं, कर भुगतान, प्रमाण पत्र डाउनलोड और आवेदनों की ऑनलाइन स्थिति देखें।",
      exploreAll: "सभी ३२ सेवाएं देखें",
      daysTimeline: "दिन",
      items: {
        propertyTax: {
          title: "संपत्ति कर निर्धारण एवं भुगतान",
          desc: "कर गणना करें, बकाया राशि देखें और ५% छूट के साथ ऑनलाइन भुगतान करें।",
          timeline: "तत्काल डिजिटल रसीद",
        },
        waterBill: {
          title: "जल कर बिल एवं नया कनेक्शन",
          desc: "त्वरित पानी बिल भुगतान और नए मीटर कनेक्शन हेतु ऑनलाइन आवेदन।",
          timeline: "३ - ७ कार्य दिवस",
        },
        birthCert: {
          title: "जन्म प्रमाण पत्र पंजीकरण",
          desc: "डिजिटल क्यूआर कोड सत्यापन के साथ ३ से ५ दिनों में प्रमाण पत्र प्राप्त करें।",
          timeline: "३ - ५ कार्य दिवस",
        },
        deathCert: {
          title: "मृत्यु प्रमाण पत्र पंजीकरण",
          desc: "प्रमाणित नगर परिषद मृत्यु पंजीकरण एवं आधिकारिक उद्धरण।",
          timeline: "३ - ५ कार्य दिवस",
        },
        buildingPermit: {
          title: "भवन निर्माण अनुमति (AutoDCR)",
          desc: "AutoDCR ऑनलाइन नक्शा स्वीकृति एवं निर्माण प्रारंभ अनुमति पत्र।",
          timeline: "३० - ४५ दिन",
        },
        tradeLicense: {
          title: "व्यापार लाइसेंस एवं नवीनीकरण",
          desc: "दुकानों, रिसॉर्ट्स और चिक्की विक्रेताओं के लिए नया लाइसेंस व नवीनीकरण।",
          timeline: "७ - १४ कार्य दिवस",
        },
        noc: {
          title: "अनापत्ति प्रमाण पत्र (NOC)",
          desc: "अग्निशमन, वृक्ष कटाई, जल निकासी व सड़क खुदाई हेतु तुरंत अनापत्ति प्रमाण पत्र।",
          timeline: "७ - १० कार्य दिवस",
        },
        onlinePay: {
          title: "एकीकृत ऑनलाइन भुगतान (BBPS)",
          desc: "सभी कर, जल बिल, किराया व चालान भुगतान का एकीकृत BBPS गेटवे।",
          timeline: "तत्काल डिजिटल रसीद",
        },
      },
    },
  stateLeadership: {
      badge: "राज्य एवं क्षेत्रीय नेतृत्व",
      title: "प्रमुख शासनकर्ता एवं जनप्रतिनिधि",
      subtitle:
        "महाराष्ट्र राज्य एवं लोनावला-मावल क्षेत्र के समग्र बुनियादी विकास को दिशा प्रदान करने वाला माननीय नेतृत्व।",
      cm: {
        name: "श्री देवेंद्र फडणवीस",
        position: "माननीय मुख्यमंत्री, महाराष्ट्र राज्य",
        role: "मुख्यमंत्री",
      },
      dcm1: {
        name: "श्री एकनाथ शिंदे",
        position: "माननीय उपमुख्यमंत्री, महाराष्ट्र राज्य",
        role: "उपमुख्यमंत्री",
      },
      dcm2: {
        name: "श्री अजित पवार",
        position: "माननीय उपमुख्यमंत्री, महाराष्ट्र राज्य",
        role: "उपमुख्यमंत्री",
      },
      mla: {
        name: "श्री सुनील शेळके",
        position: "माननीय विधायक, मावल-लोनावला विधानसभा क्षेत्र",
        role: "स्थानीय विधायक",
      },
    },
    council: {
      badge: "परिषद नेतृत्व",
      title: "नगर परिषद प्रशासन एवं नेतृत्व",
      subtitle:
        "लोनावला के सतत विकास के लिए समर्पित जन प्रतिनिधि एवं प्रशासनिक अधिकारी।",
      presidentDesignation: "अध्यक्ष (नगराध्यक्ष)",
      presidentQuote:
        "टिकाऊ पर्यटन बुनियादी ढांचा, पारदर्शी प्रशासन और हर नागरिक को घर तक सेवाएं प्रदान करने के लिए हम प्रतिबद्ध हैं।",
      tenure: "कार्यकाल: २०२२ - २०२७",
      vpDesignation: "उपाध्यक्ष (उपनगराध्यक्ष)",
      coDesignation: "मुख्याधिकारी / आयुक्त",
      viewAllMembers: "सभी पार्षद एवं समितियां देखें",
    },
    tourism: {
      badge: "सह्याद्री का गौरव",
      title: "लोनावला के प्रमुख पर्यटन स्थल",
      subtitle:
        "मनमोहक कोहरा, झरने, २,२०० वर्ष प्राचीन गुफाएं और मराठा कालीन ऐतिहासिक किले।",
      weatherCity: "लोनावला: २२°से • सुखद कोहरा",
      weatherCondition: "सुखद कोहरा",
      ghatsStatus: "घाट खुला • पर्यटकों की भीड़",
      viewAllSpots: "सभी २४ दर्शनीय स्थल देखें",
      spots: {
        tigerPoint: {
          name: "टाइगर पॉइंट (लायंस पॉइंट)",
          desc: "६५० मीटर गहरी खाई और सह्याद्री घाटी के मनोरम दृश्यों का प्रसिद्ध व्यू पॉइंट।",
        },
        bhushiDam: {
          name: "भुशी बांध सीढ़ीदार झरना",
          desc: "मानसून में सीढ़ियों पर बहने वाला लोनावला का विश्व प्रसिद्ध चिनाई बांध झरना।",
        },
        karlaCaves: {
          name: "कार्ला बौद्ध गुफाएं",
          desc: "२,२०० वर्ष प्राचीन बौद्ध चैत्य एवं श्री आई एकवीरा देवी का पवित्र तीर्थ स्थल।",
        },
        rajmachi: {
          name: "राजमाची किला एवं ट्रेक",
          desc: "बोरघाट पर नजर रखने वाले जुड़वां ऐतिहासिक किले और जुगनुओं का घना जंगल।",
        },
      },
    },
    notices: {
      badge: "सार्वजनिक राजपत्र व परिपत्र",
      title: "महत्वपूर्ण सूचनाएं एवं निविदाएं",
      subtitle:
        "सरकारी परिपत्र, नगर परिषद प्रस्ताव, नागरिक सूचनाएं और आधिकारिक निविदाएं।",
      tabs: {
        all: "सभी",
        notices: "सूचनाएं",
        circulars: "परिपत्र",
        orders: "आदेश",
        news: "समाचार",
        events: "कार्यक्रम",
      },
      repository: "दस्तावेज़ संग्रह",
      viewAll: "सभी देखें",
    },
    projects: {
      badge: "नागरिक अवसंरचना",
      title: "लोनावला का सर्वांगीण विकास",
      subtitle:
        "चल रही विकास परियोजनाएं: भूमिगत सीवरेज, टाइगर पॉइंट स्काईवॉक और नया २४x७ नगर परिषद अस्पताल।",
      viewAll: "सभी परियोजनाएं देखें",
      statusOngoing: "जारी है",
      statusCompleted: "पूर्ण",
      budgetLabel: "स्वीकृत बजट",
      progressLabel: "कार्य प्रगति",
    },
    emergencyContacts: {
      badge: "आपातकालीन तैयारी",
      title: "आपातकालीन एवं २४x७ हेल्पलाइन नंबर",
      subtitle:
        "लोनावला शहर, खंडाला और बांध क्षेत्रों के लिए तत्पर त्वरित सहायता दल।",
      viewAllExtensions: "सभी विभाग विस्तार व अधिकारी संपर्क देखें →",
      callPrefix: "कॉल करें",
      cards: {
        controlRoom: {
          title: "२४x७ आपदा नियंत्रण कक्ष",
          desc: "मानसून बाढ़, भूस्खलन, गिरे हुए पेड़ व त्वरित सहायता।",
          badge: "टोल फ्री",
        },
        fire: {
          title: "अग्निशमन एवं बचाव दल",
          desc: "आग बुझाना, झरने एवं घाटी में आपातकालीन रेस्क्यू ऑपरेशन।",
          badge: "आपातकालीन",
        },
        police: {
          title: "लोनावला शहर पुलिस स्टेशन",
          desc: "पर्यटक सुरक्षा, यातायात नियंत्रण एवं कानून-व्यवस्था।",
          badge: "पुलिस सहायता",
        },
        hospital: {
          title: "अस्पताल एवं एम्बुलेंस (१०८)",
          desc: "आपातकालीन ट्रॉमा एम्बुलेंस व नगर परिषद प्रसूति गृह।",
          badge: "चिकित्सा सहायता",
        },
      },
    },
    stats: {
      badge: "प्रगति सूचकांक",
      title: "लोनावला नगर परिषद एक नज़र में",
      subtitle:
        "पारदर्शी, त्वरित और पर्यावरण-अनुकूल नागरिक प्रशासन के प्रमुख मील के पत्थर।",
      citizensServed: { label: "नागरिक सेवाएं", sub: "५ वार्डों में" },
      resolutionSla: { label: "शिकायत निवारण दर", sub: "औसत: ३ दिन" },
      annualTourists: { label: "वार्षिक पर्यटक", sub: "सह्याद्री का प्रवेश द्वार" },
      digitalServices: { label: "डिजिटल सेवाएं", sub: "१००% ऑनलाइन" },
      cleanRank: { label: "स्वच्छ शहर रैंक", sub: "स्वच्छ सर्वेक्षण" },
      protectedArea: { label: "संरक्षित हरित क्षेत्र", sub: "पर्यावरण संवेदनशील क्षेत्र" },
    },
    appPromo: {
      badge: "नागरिक मोबाइल ऐप",
      title: "महा-लोनावला ३११\nसभी सेवाएं अब आपके स्मार्टफोन पर",
      desc: "सड़क के गड्ढे, पानी का रिसाव या कचरे की शिकायत जियो-टैग फोटो के साथ मात्र ६० सेकंड में दर्ज करें और सीधे एसएमएस अपडेट पाएं।",
      features: [
        "कैमरे से फोटो अपलोड एवं जीपीएस टैगिंग",
        "संपत्ति कर और पानी बिल का सीधे UPI द्वारा भुगतान",
        "मानसून भूस्खलन एवं मौसम संबंधी तत्काल अलर्ट",
        "अधिकारियों के कार्य का लाइव ट्रैकिंग",
      ],
      downloadApple: "Apple App Store",
      downloadGoogle: "Google Play",
      scanToInstall: "स्कैन करके इंस्टॉल करें",
      appName: "महा-लोनावला ३११ ऐप",
      compatibility: "iOS 14+ और Android 9.0+ के अनुकूल",
    },
    faq: {
      badge: "नागरिक सहायता एवं मार्गदर्शन",
      title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      subtitle:
        "संपत्ति कर, जल कर, पर्यटन नियम और शिकायत निवारण से संबंधित सभी उत्तर।",
      items: [
        {
          question: "मैं संपत्ति कर ऑनलाइन कैसे भर सकता हूं और छूट कैसे मिलेगी?",
          answer:
            "नागरिक सेवा पृष्ठ पर जाकर 'संपत्ति कर' चुनें, अपना वार्ड एवं संपत्ति संख्या दर्ज करें और नेट बैंकिंग, यूपीआई या कार्ड से भुगतान करें। ३० जून से पहले भुगतान करने पर ५% की सीधी छूट मिलती है।",
        },
        {
          question: "नागरिक शिकायत दर्ज करने की प्रक्रिया क्या है?",
          answer:
            "५-चरणीय शिकायत पोर्टल या महा-लोनावला ३११ ऐप के माध्यम से फोटो अपलोड कर शिकायत दर्ज करें। आपको एक टोकन नंबर मिलेगा और ३ से ७ दिनों में समाधान किया जाएगा।",
        },
        {
          question: "भुशी बांध और टाइगर पॉइंट के लिए समय के क्या नियम हैं?",
          answer:
            "भुशी बांध मानसून में सुबह ०९:०० से शाम ०५:०० बजे तक खुला रहता है। टाइगर पॉइंट शाम ०६:३० बजे तक खुला रहता है। सुरक्षा की दृष्टि से रेलिंग पार कर पानी में जाना सख्त मना है।",
        },
        {
          question: "डिजिटल क्यूआर कोड युक्त जन्म या मृत्यु प्रमाण पत्र कैसे प्राप्त करें?",
          answer:
            "स्वास्थ्य विभाग के पोर्टल पर घटना की तिथि व नाम खोजकर आधिकारिक डिजिटल हस्ताक्षर युक्त प्रमाण पत्र तुरंत डाउनलोड कर सकते हैं। कार्यालय आने की आवश्यकता नहीं है।",
        },
      ],
    },
    newsletter: {
      title: "परिषद नागरिक बुलेटिन एवं अलर्ट प्राप्त करें",
      subtitle:
        "साप्ताहिक नागरिक अपडेट्स, संपत्ति कर छूट की घोषणाएं और मानसून मौसम अलर्ट सीधे ईमेल पर प्राप्त करें।",
      placeholder: "अपना ईमेल पता दर्ज करें...",
      subscribeBtn: "सदस्यता लें",
      thankYou: "धन्यवाद! आपने आधिकारिक नागरिक बुलेटिन की सदस्यता ले ली है।",
      privacyNotice: "हम आपकी गोपनीयता का सम्मान करते हैं। आप कभी भी अनसब्सक्राइब कर सकते हैं।",
    },
    footer: {
      aboutTitle: "लोनावला नगर परिषद",
      aboutSub: "लोनावला नगर परिषद • महाराष्ट्र सरकार",
      aboutDesc:
        "महाराष्ट्र सरकार के अंतर्गत लोनावला पर्यटन शहर का प्रशासन। पर्यावरण-अनुकूल पर्यटन, आधुनिक बुनियादी ढांचा और पारदर्शी ई-प्रशासन के लिए समर्पित।",
      address:
        "प्रशासनिक भवन, पुराना राष्ट्रीय राजमार्ग क्र. ४, लोनावला, जिला पुणे, महाराष्ट्र - ४१०४०१",
      officeHours:
        "कार्यालय समय: सोम - शनि: सुबह ०९:४५ से शाम ०५:४५ (दूसरा एवं चौथा शनिवार अवकाश)",
      colCitizenServices: "नागरिक सेवाएं",
      colGrievance: "शिकायत निवारण",
      colQuickLinks: "महत्वपूर्ण लिंक",
      colOfficialPortals: "सरकारी पोर्टल",
      colHelpdesk: "सहायता एवं नियंत्रण कक्ष",
      emergencyControlRoom: "२४x७ नियंत्रण कक्ष",
      emailHelpdesk: "ईमेल सहायता केंद्र",
      tollFreeNumber: "टोल-फ्री हेल्पलाइन",
      copyright:
        "© २०२६ लोनावला नगर परिषद, महाराष्ट्र सरकार। सर्वाधिकार सुरक्षित।",
      privacyPolicy: "गोपनीयता नीति",
      termsOfUse: "उपयोग की शर्तें",
      hyperlinkPolicy: "हाइपरलिंक नीति",
      rtiAct: "सूचना का अधिकार २००५",
      sitemap: "साइटमैप",
    },
  },
};
