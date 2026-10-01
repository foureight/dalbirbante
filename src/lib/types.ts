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

export type SiteContent = {
  site: {
    brandName: string;
    tagline: string;
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    orderUrl: string;
    orderLabel: string;
    hours: string;
    hoursClosed: string;
    mapEmbedUrl: string;
    facebookUrl: string;
    metaTitle: string;
    metaDescription: string;
  };
  nav: {
    home: string;
    menu: string;
    about: string;
    contact: string;
    gallery: string;
  };
  home: {
    heroEyebrow: string;
    heroHeadline: string;
    heroSub: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    introTitle: string;
    introText: string;
    offerTitle: string;
    offerItems: string[];
    pizzaWeekTitle: string;
    pizzaWeekText: string;
    dailyMenuTitle: string;
    dailyMenuText: string;
    deliveryTitle: string;
    deliveryText: string;
    glutenFreeTitle: string;
    glutenFreeText: string;
    featuresTitle: string;
    features: string[];
    ctaTitle: string;
    ctaText: string;
    galleryTitle: string;
    gallerySubtitle: string;
  };
  about: {
    title: string;
    lead: string;
    paragraphs: string[];
  };
  menuPage: {
    title: string;
    intro: string;
    orderNote: string;
    allergensTitle: string;
    allergensText: string;
    extrasTitle: string;
    extrasText: string;
    glutenNote: string;
  };
  menuCategories: MenuCategory[];
  delivery: {
    title: string;
    intro: string;
    zones: { name: string; areas: string; fee: string; min: string }[];
  };
  contact: {
    title: string;
    lead: string;
    formTitle: string;
    formNameLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    formSubmit: string;
    formSuccess: string;
    formHint: string;
    hoursTitle: string;
    mapTitle: string;
  };
  footer: {
    blurb: string;
    rights: string;
  };
};
