import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Default Site-wide Metadata
const DEFAULT_SEO = {
  title: "Desipath | Indian Community Marketplace & Services in USA",
  description:
    "Desipath is the premier community platform for Indians in the USA. Discover rental homes, roommates, used cars, kids classes, IT trainings, events, travel companions, and community discussions.",
  keywords:
    "Indian community USA, desi marketplace, desi rentals, Indian roommates USA, buy sell cars desi, Indian kids classes, IT trainings USA, Indian events USA, travel companion network, desi attorneys, Indian doctors USA, desi classifieds",
  robots: "index, follow",
};

// Route-to-SEO Mapping with targeted keywords for every page
const ROUTE_SEO_MAP = [
  // 1. Home / Landing Page
  {
    pattern: /^\/?$/,
    title: "Desipath | Indian Community Marketplace, Rentals, Jobs & Events in USA",
    description:
      "Desipath is the premier community marketplace for Indians in the USA. Discover rental homes, roommates, used cars, kids classes, IT trainings, local events, travel companions, and community discussions.",
    keywords:
      "Indian community USA, desi marketplace, desi rentals, Indian roommates USA, buy sell cars desi, Indian kids classes, IT trainings USA, Indian events USA, travel companion network, desi attorneys, Indian doctors USA, desi classifieds",
    robots: "index, follow",
  },

  // 2. Admin Dashboard (STRICTLY BLOCKED FROM SEARCH ENGINES)
  {
    pattern: /^\/admindashboard(\/.*)?$/,
    title: "Desipath Admin Dashboard",
    description: "Desipath administrative portal and content moderation panel.",
    keywords: "",
    robots: "noindex, nofollow, noarchive",
  },

  // 3. Forum Pages
  {
    pattern: /^\/forum\/post\/.*$/,
    title: "Community Post | Desipath Forum",
    description:
      "Read discussions and advice on the Desipath Indian Community Forum. Topics include H1B visa, career, real estate, recipes, and US lifestyle.",
    keywords:
      "desi forum post, H1B visa advice, Indian community discussions USA, green card questions, desi lifestyle, career advice",
    robots: "index, follow",
  },
  {
    pattern: /^\/forum(\/.*)?$/,
    title: "Desipath Forum | Indian Community Discussions, Visa, Career & Lifestyle",
    description:
      "Join discussions on the Desipath Indian Community Forum. Discuss H1B visas, green cards, job referrals, higher studies, parenting, Indian cooking recipes, and local desi life in the USA.",
    keywords:
      "desi forum, Indian community discussions, H1B visa forum, green card questions, Indian students in USA, desi job referrals, Indian cooking recipes, Indian parents in USA, desi classifieds forum",
    robots: "index, follow",
  },

  // 4. Travel Companion Network
  {
    pattern: /^\/travel-?companion(\/.*)?$/i,
    title: "Travel Companion Network | Connect with Travelers for India-US Flights | Desipath",
    description:
      "Find trusted travel companions for senior parents, students, and first-time flyers traveling between India and the USA/Canada. Connect safely with caring volunteers on similar flight routes.",
    keywords:
      "travel companion India USA, flight companion for elderly parents, volunteer travel companion, seniors travel assistance, India to USA flight support, student travel companion, transit flight help, Delhi Mumbai to Newark flight companion",
    robots: "index, follow",
  },

  // 5. Rental Homes
  {
    pattern: /^\/services\/rental[hH]omes(\/.*)?$/,
    title: "Indian Rental Homes & Apartments in USA | Desipath Rentals",
    description:
      "Search verified rental homes, single-family houses, apartments, and condos tailored for Indian families in prime tech hubs and suburban neighborhoods across the USA.",
    keywords:
      "desi rental homes, Indian family rentals USA, vegetarian friendly rentals, apartment rentals near Indian grocery, homes for rent near tech parks, Indian community housing, 2 BHK 3 BHK rentals USA",
    robots: "index, follow",
  },

  // 6. Roommates & Shared Living
  {
    pattern: /^\/services\/roommates(\/.*)?$/,
    title: "Indian Roommates & Shared Accommodation in USA | Desipath Roommates",
    description:
      "Find compatible Indian roommates, private rooms, and shared apartments across major US tech hubs. Filter by dietary preferences, gender, occupation, and language.",
    keywords:
      "Indian roommates USA, desi roommates, vegetarian roommates, shared apartment desi, private room rent for Indians, Indian student accommodation USA, male female Indian roommates, Bay Area Dallas New Jersey roommates",
    robots: "index, follow",
  },

  // 7. Buy & Sell Homes / Real Estate
  {
    pattern: /^\/services\/BuyHome(\/.*)?$/,
    title: "Buy & Sell Homes in USA & Canada | Desipath Real Estate",
    description:
      "Explore verified homes, townhouses, and condos for sale. Connect with Indian real estate buyers, sellers, and top-rated desi realtors across top school districts.",
    keywords:
      "buy house USA for Indians, Indian real estate marketplace, sell home Indian community, desi realtor properties, top school district homes USA, single family homes condos townhouses",
    robots: "index, follow",
  },
  {
    pattern: /^\/real-estate(\/.*)?$/,
    title: "Real Estate Properties in USA, Dubai & India | Desipath Real Estate",
    description:
      "Discover premier residential and commercial investment properties in the USA, Canada, Dubai, and India. Connect with trusted agents and builders.",
    keywords:
      "real estate Dubai India USA, NRI property investment, buy apartment Dubai, properties in India for NRIs, commercial residential real estate",
    robots: "index, follow",
  },

  // 8. Buy & Sell Cars
  {
    pattern: /^\/services\/(cars|BuyCar)(\/.*)?$/,
    title: "Buy & Sell Used Cars Across USA | Desipath Auto Marketplace",
    description:
      "Browse reliable pre-owned cars, SUVs, and sedans from trusted community members. Find fair prices on Toyota, Honda, Tesla, and more.",
    keywords:
      "buy used cars USA, sell car desi community, reliable preowned cars, Toyota Honda used cars, Indian car sellers USA, clean title cars, used SUVs sedans near me",
    robots: "index, follow",
  },

  // 9. Kids Classes & Education
  {
    pattern: /^\/(kids-class|services\/classesForKids)(\/.*)?$/,
    title: "Indian Kids Classes in USA | Classical Music, Dance, Coding & Math | Desipath",
    description:
      "Enroll your children in top-rated cultural and academic classes. Discover Bharatanatyam, Carnatic vocal, Hindi, Tamil, Telugu, Vedic Math, Chess, and Coding tutors.",
    keywords:
      "Indian kids classes USA, Bharatanatyam classes near me, Carnatic vocal lessons online, Indian language classes Hindi Tamil Telugu, Vedic math tutors, chess coaching, coding for kids, Indian cultural activities for children",
    robots: "index, follow",
  },

  // 10. IT Trainings & Bootcamps
  {
    pattern: /^\/(it-training|services\/itTrainings)(\/.*)?$/,
    title: "IT Trainings & Tech Bootcamps with Placement Support | Desipath IT",
    description:
      "Advance your tech career with expert-led IT training bootcamps in AWS, Azure, DevOps, Full Stack Development, Salesforce, Data Engineering, and QA Automation.",
    keywords:
      "IT training bootcamps USA, AWS certification training, DevOps course placement, Full stack web development, Salesforce training, Data engineering course, tech jobs USA for Indians, Java Python cloud bootcamps",
    robots: "index, follow",
  },

  // 11. Events & Festivals
  {
    pattern: /^\/(events|services\/events)(\/.*)?$/,
    title: "Indian Events, Concerts, Festivals & Standup Comedy in USA | Desipath Events",
    description:
      "Discover upcoming Indian cultural festivals, music concerts, garba nights, Diwali celebrations, standup comedy shows, and community networking events near you.",
    keywords:
      "Indian events USA, desi concerts near me, Diwali celebrations, Dandiya Garba nights, Indian standup comedy USA, Telugu Tamil Hindi events USA, Bollywood parties, community cultural events",
    robots: "index, follow",
  },

  // 12. Local Deals & Discounts
  {
    pattern: /^\/(local-deals|services\/Localdeals)(\/.*)?$/,
    title: "Local Indian Deals, Grocery Discounts & Restaurant Offers | Desipath Deals",
    description:
      "Save on Indian grocery stores, authentic desi restaurants, sweet shops, ethnic fashion, and salon services with exclusive community deals and coupons.",
    keywords:
      "Indian grocery deals, desi restaurant coupons, Indian sweet shop discount, Indian clothes sale, curry restaurant offers, ethnic wear discounts USA, Indian salon spa offers",
    robots: "index, follow",
  },

  // 13. Desi Doctors & Healthcare
  {
    pattern: /^\/(desi-doctors|doctors)(\/.*)?$/,
    title: "Indian Doctors, Physicians & Specialists Near You | Desipath Health",
    description:
      "Find trusted Indian primary care physicians, pediatricians, dentists, cardiologists, and specialists who understand your cultural background and speak your language.",
    keywords:
      "Indian doctors near me, desi physicians USA, Indian pediatrician, Indian dentist near me, Hindi speaking doctor, Tamil Telugu speaking physicians USA, Ayurvedic medicine, Indian clinic USA",
    robots: "index, follow",
  },

  // 14. Desi Attorneys & Legal
  {
    pattern: /^\/(desi-attorneys|attorneys)(\/.*)?$/,
    title: "Indian Immigration, Business & Family Law Attorneys | Desipath Legal",
    description:
      "Consult experienced Indian lawyers specializing in US immigration (H1B, PERM, EB1/EB2/EB3, Green Card, O-1), business setup, estate planning, and family law.",
    keywords:
      "Indian immigration attorney USA, H1B visa lawyer, green card attorney, Indian business lawyer, estate planning Indian attorney, desi legal advice USA, EB2 EB3 PERM lawyer",
    robots: "index, follow",
  },

  // 15. Desi SecureMatch / Matrimonial
  {
    pattern: /^\/dating(\/.*)?$/,
    title: "Desi SecureMatch | Verified Indian Matrimonial & Relationship Network | Desipath",
    description:
      "A secure, verified platform connecting Indian singles and professionals in North America. Connect with confidence based on values, community, and background.",
    keywords:
      "Indian matrimony USA, desi matchmaking North America, verified Indian matrimonial profiles, Telugu Tamil Hindi Gujarati singles USA, desi marriage bureau, Indian singles network",
    robots: "index, follow",
  },

  // 16. Astrology & Horoscope
  {
    pattern: /^\/(astrology|services\/astrology)(\/.*)?$/,
    title: "Vedic Astrology Consultations & Horoscope Readings | Desipath Astrology",
    description:
      "Get authentic Vedic astrology consultations, Kundali matching, birth chart analysis, gemstone advice, and career horoscope readings from trusted Indian astrologers.",
    keywords:
      "Vedic astrology consultations USA, Indian astrologer near me, Kundali matching for marriage, horoscope analysis, Vedic birth chart, Janam Kundli online, Prashna Kundli, Indian astrology reading",
    robots: "index, follow",
  },

  // 17. Photography & Videography
  {
    pattern: /^\/services\/photography(\/.*)?$/,
    title: "Indian Wedding & Event Photographers in USA | Desipath Photography",
    description:
      "Hire top Indian photographers and cinematographers for weddings, pre-wedding shoots, baby showers, Arangetrams, birthdays, and family portraits.",
    keywords:
      "Indian wedding photographer USA, desi wedding videography, Arangetram photography, Indian pre-wedding photoshoot, desi event photographers, portrait photography",
    robots: "index, follow",
  },

  // 18. Buy & Sell Items / Classifieds
  {
    pattern: /^\/buy-sell-items(\/.*)?$/,
    title: "Buy & Sell Household Items, Furniture & Appliances | Desipath Classifieds",
    description:
      "Buy and sell gently used furniture, Indian kitchen appliances (mixie, wet grinder, pressure cooker), electronics, and kids gear within your local desi community.",
    keywords:
      "Indian classifieds USA, buy sell used furniture, wet grinder Indian mixie for sale, Indian kitchen appliances USA, second hand items desi community, pressure cooker mixie grinder",
    robots: "index, follow",
  },

  // 19. Community Rides & Carpool
  {
    pattern: /^\/community-rides(\/.*)?$/,
    title: "Community Rides & Carpooling Network for Indians in USA | Desipath Rides",
    description:
      "Connect with friendly community members for airport pickups, daily office carpooling, and inter-city travel sharing across the USA.",
    keywords:
      "Indian carpooling USA, airport ride share desi, community rides, desi carpool tech parks, intercity travel share, airport drop pickup",
    robots: "index, follow",
  },

  // 20. Immigration News
  {
    pattern: /^\/(daily-news|news)(\/.*)?$/,
    title: "US Immigration News, Visa Bulletins & Community Updates | Desipath News",
    description:
      "Stay informed with daily US immigration news, USCIS updates, monthly Visa Bulletin analysis, H1B lottery alerts, and Indian diaspora headlines.",
    keywords:
      "US immigration news, Visa bulletin analysis, USCIS updates today, H1B lottery news, green card backlog updates, Indian diaspora news USA, priority date predictions",
    robots: "index, follow",
  },

  // 21. About Us
  {
    pattern: /^\/about-?us\/?$/i,
    title: "About Us | Desipath - Built by Desis, for Desis",
    description:
      "Learn about Desipath's mission to empower, connect, and serve the millions of Indian expatriates, students, families, and professionals living across North America.",
    keywords:
      "About Desipath, Indian diaspora platform, desi community USA, Indian professionals network North America",
    robots: "index, follow",
  },

  // 22. Contact Us
  {
    pattern: /^\/contact\/?$/i,
    title: "Contact Us | Desipath Support & Community Inquiries",
    description:
      "Get in touch with the Desipath team. Reach out for advertising, partnerships, support, feedback, or listing assistance.",
    keywords:
      "Contact Desipath, Desipath customer support, advertise on Desipath, partner with Desipath",
    robots: "index, follow",
  },

  // 23. Auth Pages (noindex for private account pages)
  {
    pattern: /^\/(login|register|forgot-password|inbox|profile|editProfile|myListings)(\/.*)?$/,
    title: "Account | Desipath",
    description: "Access your Desipath account, listings, and messages.",
    keywords: "Desipath login, account, user profile",
    robots: "noindex, nofollow",
  },
];

// Helper to set or create a meta tag
function setMetaTag(name, content, attribute = "name") {
  if (!content && content !== "") return;
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

// Helper to set canonical URL
function setCanonicalURL(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!url) {
    if (link) link.remove();
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Apply SEO metadata dynamically
 */
export function applySEO({ title, description, keywords, robots, canonical, image }) {
  if (typeof document === "undefined") return;

  // 1. Title
  if (title) {
    document.title = title;
  }

  // 2. Meta Description
  if (description) {
    setMetaTag("description", description);
  }

  // 3. Meta Keywords
  if (keywords !== undefined) {
    setMetaTag("keywords", keywords);
  }

  // 4. Meta Robots
  if (robots) {
    setMetaTag("robots", robots);
  }

  // 5. Open Graph
  if (title) setMetaTag("og:title", title, "property");
  if (description) setMetaTag("og:description", description, "property");
  if (canonical) setMetaTag("og:url", canonical, "property");
  if (image) setMetaTag("og:image", image, "property");

  // 6. Twitter Card
  if (title) setMetaTag("twitter:title", title);
  if (description) setMetaTag("twitter:description", description);
  if (image) setMetaTag("twitter:image", image);

  // 7. Canonical URL
  setCanonicalURL(canonical);
}

/**
 * Global Route Listener Component
 * Placed in App.jsx to automatically update metadata on every navigation.
 */
export function SEORouteListener() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    // Find matching route SEO config
    const matched = ROUTE_SEO_MAP.find((entry) => entry.pattern.test(pathname));
    const config = matched || DEFAULT_SEO;

    const fullCanonical = `https://desipath.com${pathname === "/" ? "" : pathname}`;

    applySEO({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      robots: config.robots,
      canonical: config.robots.includes("noindex") ? undefined : fullCanonical,
      image: "https://desipath.com/desipath-logo.png",
    });
  }, [location.pathname]);

  return null;
}

/**
 * Standalone SEO Component for dynamic page overrides (e.g. blog post title, product title)
 */
export default function SEO({ title, description, keywords, robots, image, canonical }) {
  const location = useLocation();

  useEffect(() => {
    applySEO({
      title,
      description,
      keywords,
      robots,
      image,
      canonical: canonical || `https://desipath.com${location.pathname}`,
    });
  }, [title, description, keywords, robots, image, canonical, location.pathname]);

  return null;
}
