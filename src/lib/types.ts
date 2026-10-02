export type MenuItem = {
  name: string;
  description: string;
  price: string;
  image?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type SiteContent = {
  site: {
    brandName: string;
    tagline: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    addressShort: string;
    orderUrl: string;
    orderLabel: string;
    callLabel: string;
    hours: string;
    hoursClosed: string;
    mapEmbedUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    foodoraUrl: string;
    siteUrl: string;
    priceRange: string;
    servesCuisine: string[];
    announcement: string;
    goodbye: string;
    goodbyeIt: string;
    metaTitle: string;
    metaDescription: string;
    seoDescription: string;
    geo: {
      latitude: number;
      longitude: number;
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
    keywords: string[];
    pageMeta: {
      menu: { title: string; description: string };
      about: { title: string; description: string };
      contact: { title: string; description: string };
      daily: { title: string; description: string };
      delivery: { title: string; description: string };
      glutenFree: { title: string; description: string };
    };
  };
  nav: {
    menu: string;
    daily: string;
    delivery: string;
    about: string;
    contact: string;
    glutenFree: string;
  };
  home: {
    introTitle: string;
    introText: string;
    offerTitle: string;
    offerItems: string[];
    wineText: string;
    ctaLine1: string;
    ctaLine2: string;
    menuCta: string;
    pizzaWeekTitle: string;
    pizzaWeekText: string;
    storyTitle: string;
    storyText: string;
    dailyMenuTitle: string;
    dailyMenuText: string;
    deliveryTitle: string;
    deliveryText: string;
    deliveryText2: string;
    glutenFreeTitle: string;
    glutenFreeText: string;
    contactTitle: string;
    contactText: string;
    hoursTitle: string;
    whereTitle: string;
    featuresTitle: string;
    features: { title: string; text: string }[];
    galleryTitle: string;
    gallerySubtitle: string;
    faqTitle: string;
    faqs: FaqItem[];
  };
  about: {
    title: string;
    lead: string;
    paragraphs: string[];
    faqTitle: string;
    faqs: FaqItem[];
  };
  menuPage: {
    title: string;
    intro: string;
    doughChoiceNote: string;
    orderNote: string;
    allergensTitle: string;
    allergensText: string;
    extrasTitle: string;
    extrasText: string;
    glutenNote: string;
    faqTitle: string;
    faqs: FaqItem[];
  };
  menuCategories: MenuCategory[];
  daily: {
    title: string;
    intro: string;
    note: string;
    date: string;
    hours: string;
    items: {
      name: string;
      price: string;
      emoji: string;
      description: string;
      note: string;
    }[];
  };
  delivery: {
    title: string;
    intro: string;
    intro2: string;
    pricesTitle: string;
    zones: { name: string; areas: string; fee: string; min: string }[];
    faqTitle: string;
    faqs: FaqItem[];
  };
  glutenFree: {
    title: string;
    intro: string;
    intro2: string;
    productsTitle: string;
    productsNote: string;
    products: string[];
    howTitle: string;
    faqTitle: string;
    howItems: string[];
    faqs: FaqItem[];
  };
  contact: {
    title: string;
    lead: string;
    openText: string;
    formTitle: string;
    formLead: string;
    formNameLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    formSubmit: string;
    formSuccess: string;
    formHint: string;
    hoursTitle: string;
    whereTitle: string;
    mapTitle: string;
  };
  footer: {
    blurb: string;
    rights: string;
  };
};
