import { SITE_URL } from "./site";
import { BUSINESS_MASTER } from "@/config/superTelecomConfig";

export interface BrandPricingItem {
  category: "Android Budget" | "Android Flagship & Curved" | "Apple iPhone";
  modelsExample: string;
  priceRange: string;
  startingPrice: number;
  turnaroundTime: string;
  warranty: string;
}

export interface LabStepItem {
  stepNumber: string;
  title: string;
  hindiTitle: string;
  description: string;
  duration: string;
}

export interface DedicatedServiceData {
  slug: string;
  title: string;
  hindiTitle: string;
  shortTagline: string;
  heroSummary: string; // 40-50 words precise answer for AEO direct answer card
  priceRangeInr: string;
  startingPrice: number;
  turnaroundTime: string;
  warrantyPeriod: string;
  dataSafetyGuarantee: string;
  iconName: string;
  badge: string;
  metaDescription: string;
  keywords: string[];
  symptoms: string[]; // 4 clear symptoms
  customerGuidelines: string[]; // 4 precautions & tips
  labSteps: LabStepItem[]; // 3-step process
  brandPricingTable: BrandPricingItem[];
  localAreasServed: string[];
  faqs: { question: string; answer: string }[];
  aliases: string[];
  relatedSlugs: string[];
  authenticVisual: {
    badgeText: string;
    caption: string;
    image: string;
  };
}

export const GIRIDIH_AREAS_SERVED = [
  "Barganda Road",
  "Near Shivam Clinic",
  "Tower Chowk",
  "Bada Chowk",
  "Makatpur",
  "Pachamba",
  "Station Road",
  "Sirsia",
  "Beniadih",
  "Dumri",
  "Jamua",
] as const;

export const REPAIR_SERVICES_SILO_DATA: DedicatedServiceData[] = [
  {
    slug: "screen-display-replacement",
    title: "Screen & 120Hz AMOLED Display Replacement in Giridih",
    hindiTitle: "मोबाइल स्क्रीन व 120Hz AMOLED डिस्प्ले रिप्लेसमेंट",
    shortTagline: "30–60 Min Express Fit • 90 Days Warranty • 100% Data Safe",
    heroSummary:
      "Super Telecom Giridih replaces broken, flickering, or green-line smartphone screens in 30–60 minutes on Barganda Road. We stock genuine OEM and tested AMOLED/LCD panels for iPhone, Samsung, OnePlus, Xiaomi, and Vivo with written 90-day warranty and zero data loss.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "30–60 Minutes",
    warrantyPeriod: "90 Days Written Warranty",
    dataSafetyGuarantee: "100% Data Safe — No Factory Reset Required",
    iconName: "Smartphone",
    badge: "Most Requested Service",
    metaDescription:
      "Original 120Hz AMOLED & LCD mobile screen replacement in Giridih at Super Telecom, Barganda Road. Same-day repair for iPhone, Samsung, OnePlus, Vivo, Realme with 90-day warranty.",
    keywords: [
      "Screen replacement Giridih",
      "Mobile display repair Giridih",
      "AMOLED screen price Giridih",
      "iPhone screen repair Barganda Road",
      "Samsung display replacement Giridih",
    ],
    symptoms: [
      "चटका या पूरी तरह टूटा हुआ फ्रंट टच ग्लास (Cracked Outer Glass with Sharp Edges)",
      "स्क्रीन पर हरी या गुलाबी लाइनें, ब्लिंक होना या काला धब्बा (Green/Pink Lines or Black Inky Spots)",
      "टच अपने आप काम करना या बिल्कुल न चलना (Ghost Touches or Unresponsive Digitizer)",
      "फोन में घंटी बजती है पर डिस्प्ले पूरी तरह ब्लैक है (Blank Screen with Active Ringing)",
    ],
    customerGuidelines: [
      "दुकान आने से पहले फोन को रीसेट करने की जरूरत नहीं है; आपका फोटो, व्हाट्सएप और डेटा 100% सुरक्षित रहता है।",
      "टूटे ग्लास को दबाएं नहीं, क्योंकि दबाव से अंदर का नाज़ुक AMOLED पैनल भी फूट सकता है।",
      "सुपर टेलीकॉम लैब में आपके सामने पारदर्शी तरीके से डिस्प्ले फिट और टेस्ट किया जाता है।",
      "रिपेयर के बाद 10x15 टच ग्रिड और ऑटो-ब्राइटनेस सेंसर की पूरी जांच करके लिखित वारंटी कार्ड दिया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Free Optical & Digitizer Inspection",
        hindiTitle: "मुफ्त डिस्प्ले डायग्नोसिस",
        description: "फ्रेम बेंड, टच लेयर और डिस्प्ले सिग्नल की 5-मिनट मुफ्त माइक्रोस्कोपिक जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Clean-Bench Vacuum Lamination",
        hindiTitle: "डस्ट-फ्री वैक्यूम फिटिंग",
        description: "मूल फ्रेम से पुराने एडहेसिव को हटाकर नए डिस्प्ले की वाटर-रेजिस्टेंट सीलिंग।",
        duration: "25–35 Mins",
      },
      {
        stepNumber: "03",
        title: "Quality Calibration & Warranty Handover",
        hindiTitle: "सेंसिटिविटी टेस्ट व वारंटी बिल",
        description: "120Hz रिफ्रेश रेट और मल्टी-टच कैलिब्रेशन के बाद 90-दिन का स्टैम्प्ड वारंटी कार्ड।",
        duration: "10 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi Note, Realme, Poco, Vivo Y-Series, Oppo A-Series",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, Galaxy Note, OnePlus 11/12, Vivo X-Series",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "45–60 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11, 12, 13, 14, 15, 16 Pro / Pro Max",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "40–60 Mins",
        warranty: "90 Days Warranty + TrueTone Transfer",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "गिरिडीह में स्क्रीन बदलने में कितना खर्च आता है?",
        answer:
          "सामान्य एंड्रॉइड फोन (Redmi, Realme, Vivo), कर्व्ड AMOLED और iPhone डिस्प्ले का खर्च स्क्रीन टेक्नोलॉजी और मॉडल के अनुसार तय होता है। सुपर टेलीकॉम बरगंडा रोड पर सटीक मॉडल का मुफ्त अनुमान तुरंत मिलता है।",
      },
      {
        question: "क्या स्क्रीन बदलने पर मेरा फोटो और व्हाट्सएप डेटा डिलीट हो जाएगा?",
        answer:
          "बिल्कुल नहीं! स्क्रीन रिप्लेसमेंट एक 100% प्योर हार्डवेयर प्रक्रिया है। हमारे यहां किसी भी डिवाइस को रीसेट नहीं किया जाता और आपका व्यक्तिगत डेटा पूरी तरह सुरक्षित रहता है।",
      },
      {
        question: "स्क्रीन बदलने में कितना समय लगता है?",
        answer:
          "सुपर टेलीकॉम गिरिडीह में 90% से अधिक मोबाइल स्क्रीन 30 से 60 मिनट के भीतर आपके सामने बदल दी जाती हैं।",
      },
      {
        question: "क्या बदली गई नई स्क्रीन पर वारंटी मिलती है?",
        answer:
          "हाँ, हमारी प्रत्येक डिस्प्ले रिप्लेसमेंट पर 90 दिन की लिखित स्टोर वारंटी दी जाती है, जिसमें टच रिस्पॉन्स और डिस्प्ले क्वालिटी कवर होती है।",
      },
    ],
    aliases: ["screen-replacement", "display-replacement", "touch-glass-replacement", "display-repair"],
    relatedSlugs: ["green-line-display-fix", "battery-replacement", "charging-port-repair", "iphone-back-glass-repair"],
    authenticVisual: {
      badgeText: "AMOLED Precision Assembly",
      caption: "Clean-room screen separation and zero-bubble vacuum frame alignment in Giridih workshop",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "battery-replacement",
    title: "Original Mobile Battery Replacement in Giridih",
    hindiTitle: "ओरिजिनल मोबाइल बैटरी रिप्लेसमेंट",
    shortTagline: "High-Backup Zero-Cycle Cell • 180 Days Warranty • 20–40 Mins",
    heroSummary:
      "Struggling with fast battery drain, random shutdowns, or swollen phone panels? Super Telecom on Barganda Road, Giridih provides certified high-capacity zero-cycle battery replacements for iPhone, Samsung, Xiaomi, and OnePlus with up to 180 days written replacement warranty.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "20–40 Minutes",
    warrantyPeriod: "180 Days Replacement Warranty",
    dataSafetyGuarantee: "100% Safe — Zero Data Loss Guaranteed",
    iconName: "BatteryCharging",
    badge: "Fast Turnaround",
    metaDescription:
      "Original mobile battery replacement in Giridih at Super Telecom, Barganda Road. Tested Li-ion batteries for iPhone, Samsung, Redmi, Vivo with 6-month warranty in 30 mins.",
    keywords: [
      "Mobile battery replacement Giridih",
      "iPhone battery change Giridih",
      "Samsung original battery Giridih",
      "Phone battery swelling repair Barganda Road",
    ],
    symptoms: [
      "बैटरी बहुत तेजी से खत्म होना (2-3 घंटे में 100% से 20% पर आना)",
      "30% या 40% चार्ज होते ही अचानक फोन बंद हो जाना (Random Instant Shutdowns)",
      "बैटरी फूलने के कारण बैक पैनल या स्क्रीन का बाहर उठ जाना (Battery Swelling)",
      "फोन का सामान्य उपयोग में भी अत्यधिक गर्म होना (Abnormal Thermal Heating)",
    ],
    customerGuidelines: [
      "फूली हुई बैटरी को नुकीली चीज से न छुएं और उस पर दबाव न डालें, यह आग का खतरा बन सकती है।",
      "सस्ते बिना-वारंटी वाले लोकल सेल से बचें, वे मदरबोर्ड की चार्जिंग आईसी को नुकसान पहुंचाते हैं।",
      "नई बैटरी लगाने के बाद पहले 3 साइकिल में इसे 100% चार्ज और 15% पर आने पर ही दोबारा प्लग करें।",
      "सुपर टेलीकॉम में पुरानी खराब बैटरी का पर्यावरण अनुकूल सुरक्षित ई-कचरा निपटान किया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Battery Health & Milliampere Audit",
        hindiTitle: "हेल्थ व करंट जांच",
        description: "डिजिटल लोड टेस्टर द्वारा बैटरी इंटरनल रेसिस्टेंस और बैकअप हेल्थ की जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Safe Thermal Separation & Seal Fit",
        hindiTitle: "ओरिजिनल सेल इंस्टालेशन",
        description: "ओरिजिनल पुल-टैब एडहेसिव के साथ नई जीरो-साइकिल बैटरी का सुरक्षित इंस्टालेशन।",
        duration: "15–20 Mins",
      },
      {
        stepNumber: "03",
        title: "Fast-Charge Cycle Test & Warranty",
        hindiTitle: "चार्जिंग टेस्ट व 6-माह वारंटी",
        description: "फास्ट चार्जिंग एम्पीयर ऑडिट और 180 दिन का रिप्लेसमेंट वारंटी कार्ड।",
        duration: "10 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Realme C/Narzo, Redmi 9/10/11, Poco, Vivo Y-Series",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "20–30 Mins",
        warranty: "180 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung Galaxy S20/S21/S22/S23, OnePlus 8/9/10/11",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "180 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone X, 11, 12, 13, 14, 15 (BMS Health notification sync)",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "180 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "सुपर टेलीकॉम गिरिडीह में नई मोबाइल बैटरी पर कितनी वारंटी मिलती है?",
        answer: "हम सभी ओरिजिनल ग्रेड मोबाइल बैटरियों पर 180 दिन (6 महीने) की सीधी रिप्लेसमेंट वारंटी प्रदान करते हैं।",
      },
      {
        question: "बैटरी बदलने में कितना समय लगता है?",
        answer: "अधिकांश मोबाइल मॉडलों की बैटरी केवल 20 से 40 मिनट के भीतर हमारे सामने बदल दी जाती है।",
      },
      {
        question: "क्या आईफोन में बैटरी बदलने पर 100% हेल्थ दिखाई देगी?",
        answer: "हाँ, हम ओरिजिनल BMS फ्लेक्स स्वैप और प्रोग्रामिंग सपोर्ट प्रदान करते हैं ताकि फोन में 100% बैटरी हेल्थ सही से शो हो।",
      },
      {
        question: "क्या बैटरी बदलने से फोन की स्पीड बढ़ेगी?",
        answer: "हाँ! कमजोर बैटरी होने पर ऑपरेटिंग सिस्टम सीपीयू को थ्रॉटल (धीमा) कर देता है। नई बैटरी लगने से फोन का लैग और हैंगिंग खत्म हो जाती है।",
      },
    ],
    aliases: ["battery-repair", "phone-battery", "battery-charging-port-repair-giridih"],
    relatedSlugs: ["charging-port-repair", "phone-hanging-performance-fix", "screen-display-replacement"],
    authenticVisual: {
      badgeText: "Zero-Cycle Certified",
      caption: "Precision battery adhesive pull-tab installation on ESD-safe grounding mat",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "charging-port-repair",
    title: "Mobile Charging Port & Fast-Charge Jack Repair in Giridih",
    hindiTitle: "चार्जिंग पोर्ट व टाइप-सी फास्ट-चार्ज जैक रिपेयर",
    shortTagline: "30-Min Fast Jack Fix • Moisture Bypass • 90 Days Warranty",
    heroSummary:
      "Phone not charging, loose cable connection, or moisture warning on screen? Super Telecom Giridih fixes Type-C, Lightning, and micro-USB sub-boards and charging pins within 25–45 minutes using genuine connector components and micro-soldering precision.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "25–45 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Zap",
    badge: "30-Min Service",
    metaDescription:
      "Fix loose charging pin, Type-C jack & moisture detected warning in Giridih at Super Telecom, Barganda Road. Same-day fast charging port repair in 30 mins with warranty.",
    keywords: [
      "Mobile charging port repair Giridih",
      "Type C port replacement Barganda Road",
      "Phone charging jack repair Giridih",
      "iPhone lightning port repair Giridih",
    ],
    symptoms: [
      "चार्जिंग केबल को हिलाने या किसी खास कोण पर रखने पर ही चार्ज होना (Loose Wobbly Connector)",
      "चार्जिंग बहुत धीमी गति से होना (Fast charging not triggering / Slow Charging)",
      "स्क्रीन पर 'Moisture in charging port' या गंदगी का गलत एरर आना",
      "चार्जर लगाने पर भी कोई रिस्पॉन्स या करंट न लेना (Complete Zero-Current Draw)",
    ],
    customerGuidelines: [
      "पोर्ट में आलपिन या सुई डालकर अंदर के नाज़ुक तांबे के पिंस को कभी न कुरेदें।",
      "सस्ते लोकल चार्जर या कटी हुई केबल का इस्तेमाल न करें, इससे चार्जिंग आईसी उड़ सकती है।",
      "यदि फोन में पानी गया हो तो चार्जर कभी प्लग न करें; पहले हमारी लैब में ड्राई-क्लीन कराएं।",
      "सुपर टेलीकॉम पर रिपेयर के बाद वॉट मीटर पर फास्ट-चार्जिंग (18W–120W) टेस्ट कराकर ही फोन सौंपते हैं।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Microscope Debris & Pin Continuity Check",
        hindiTitle: "माइक्रोस्कोप पोर्ट डायग्नोसिस",
        description: "पिन ऑक्सीडेशन, टूटे हुए कनेक्टर और डस्ट बिल्डअप की 45x माइक्रोस्कोपिक जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Sub-Board / OEM Pin Micro-Soldering",
        hindiTitle: "माइक्रो-सोल्डरिंग व पोर्ट स्वैप",
        description: "ओरिजिनल फास्ट-चार्जिंग सब-बोर्ड या 24-पिन टाइप-सी कनेक्टर का सटीक इंस्टालेशन।",
        duration: "20 Mins",
      },
      {
        stepNumber: "03",
        title: "Wattage Current & OTG Audio Audit",
        hindiTitle: "फास्ट-चार्ज व डेटा ट्रांसफर टेस्ट",
        description: "USB PD/VOOC/Dart फास्ट-चार्जिंग और माइक/ईयरफोन ऑडियो फंक्शन का लाइव परीक्षण।",
        duration: "10 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Infinix, Vivo, Oppo Type-C Sub-boards",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–35 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus Warp/SuperVOOC Ports, Pixel",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 14 Lightning / iPhone 15 & 16 Type-C Ports",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "35–50 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "चार्जिंग जैक बदलने में कितना खर्च आता है?",
        answer: "चार्जिंग पोर्ट रिपेयर का खर्च पोर्ट टाइप (टाइप-सी, माइक्रो-यूएसबी, लाइटनिंग) और सब-बोर्ड सर्किट के आधार पर तय होता है। हमारे वर्कशॉप पर मुफ्त जांच उपलब्ध है।",
      },
      {
        question: "क्या रिपेयर के बाद फास्ट-चार्जिंग (Fast Charging) काम करेगी?",
        answer: "हाँ, हम ओरिजिनल सब-बोर्ड और पिन लगाते हैं जिससे 33W, 67W, 80W और 120W फास्ट चार्जिंग पूरी स्पीड से काम करती है।",
      },
      {
        question: "क्या चार्जिंग पिन रिपेयर में डेटा डिलीट होता है?",
        answer: "नहीं, यह पूरी तरह सुरक्षित पेरिफेरल हार्डवेयर रिपेयर है, आपके डेटा को कोई खतरा नहीं होता।",
      },
      {
        question: "गिरिडीह में सुपर टेलीकॉम की दुकान कहाँ है?",
        answer: "हम बरगंडा रोड, शिवम क्लिनिक के पास, गिरिडीह (झारखंड 815301) में स्थित हैं।",
      },
    ],
    aliases: ["charging-jack", "type-c-repair", "usb-c-repair", "charging-port-jack"],
    relatedSlugs: ["battery-replacement", "motherboard-ic-repair", "microphone-repair"],
    authenticVisual: {
      badgeText: "High-Amp Fast Charge Ready",
      caption: "Type-C 24-pin connector microscopic reflow soldering with silver solder paste",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "motherboard-ic-repair",
    title: "Chip-Level Motherboard, Dead Phone & CPU Reballing in Giridih",
    hindiTitle: "मदरबोर्ड चिप-लेवल आईसी रिपेयर, डेड फोन व सीपीयू रीबॉलिंग",
    shortTagline: "Microscope IC Rework • Poco/OnePlus CPU Reball • 90 Days Warranty",
    heroSummary:
      "Dead phone after update, Poco X3/M3 CPU reboot loop, or short-circuit on power lines? Super Telecom is Giridih's premier micro-soldering laboratory. We perform BGA CPU reballing, PMIC replacements, and line short clearance under a 45x optical microscope.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "2–6 Hours / Same Day",
    warrantyPeriod: "90 Days Written Warranty",
    dataSafetyGuarantee: "Data Preserved Wherever Physically Recoverable",
    iconName: "Cpu",
    badge: "Advanced Lab Tech",
    metaDescription:
      "Giridih #1 motherboard micro-soldering lab. Fix dead phones, Poco CPU reballing, power IC, charging IC short circuits at Super Telecom Barganda Road with 90 days warranty.",
    keywords: [
      "Dead phone repair Giridih",
      "CPU reballing Giridih",
      "Motherboard IC repair Barganda Road",
      "Poco X3 reboot fix Giridih",
      "Phone short circuit repair Giridih",
    ],
    symptoms: [
      "फोन पूरी तरह डेड है और चार्जर लगाने पर कोई साइन नहीं दिखाता (Dead Power Rail)",
      "फोन बूटलूप पर अटका है या लोगो पर आकर बार-बार रीस्टार्ट होता है (Poco/Redmi CPU Fault)",
      "कैमरा नहीं खुल रहा या ऑडियो बिल्कुल गायब हो गया है (Audio / ISP IC Fault)",
      "फोन बहुत ज्यादा गर्म होता है और बैटरी बिना इस्तेमाल के भी खत्म हो जाती है (VPH/VDD Line Short)",
    ],
    customerGuidelines: [
      "किसी अनाड़ी मैकेनिक को मदरबोर्ड पर बेवजह हीट गन चलाने न दें, इससे बोर्ड का लेयर फूलकर हमेशा के लिए खत्म हो सकता है।",
      "यदि फोन अपडेट के बाद डेड हुआ है तो उसका सीपीयू रीबॉल करके आपका पूरा फोटो और डेटा बचाया जा सकता है।",
      "सुपर टेलीकॉम पर डीसी पावर सप्लाई और थर्मल इन्फ्रारेड कैमरे से सटीक फॉल्ट ढूंढकर काम किया जाता है।",
      "बोर्ड रिपेयर में गुणवत्तापूर्ण बीजीए शोल्डर बॉल्स और यूवी मास्किंग का उपयोग होता है ताकि टिकाऊ परिणाम मिले।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "DC Power Supply & Thermal Diagnostics",
        hindiTitle: "थर्मल व डीसी सप्लाई जांच",
        description: "शॉर्ट सर्किट और लीकेज का पता लगाने के लिए इन्फ्रारेड थर्मल स्कैनिंग।",
        duration: "20 Mins",
      },
      {
        stepNumber: "02",
        title: "BGA Desolder, Reball & Micro-Soldering",
        hindiTitle: "चिप रीबॉलिंग व सोल्डरिंग",
        description: "45x स्टीरियो माइक्रोस्कोप के नीचे खराब आईसी को हटाकर नई आईसी की प्रेसिजन बॉन्डिंग।",
        duration: "1–2 Hours",
      },
      {
        stepNumber: "03",
        title: "Current Stabilization & Extended Burn-In",
        hindiTitle: "स्टेबिलाइजेशन व बर्न-इन टेस्ट",
        description: "सभी प्राइमरी व सेकेंडरी पाॅवर रेल्स की लोड टेस्टिंग और 90 दिन का वारंटी सर्टिफिकेट।",
        duration: "30 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo Power IC & Charging IC Fix",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "2–4 Hours",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Poco X3/X3 Pro CPU Reballing, OnePlus 9/10/11 Board Rework",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "3–5 Hours",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone X to 15 Sandwich Board Separation, Audio IC, Baseband Repair",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "Same Day / 4–6 Hours",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "क्या पोको (Poco X3 Pro / Redmi Note 10 Pro) का डेड फोन ठीक हो सकता है?",
        answer: "हाँ! 95% से अधिक मामलों में यह समस्या सीपीयू और रैम के ड्राई-सोल्डर होने से होती है। हमारे गिरिडीह वर्कशॉप में सीपीयू रीबॉल करके फोन को बिना डेटा खोए फिर से चालू कर दिया जाता है।",
      },
      {
        question: "डेड फोन मदरबोर्ड रिपेयर में कितना खर्च आता है?",
        answer: "मदरबोर्ड रिपेयर का खर्च फॉल्ट टाइप (पावर आईसी, चार्जिंग आईसी, शॉर्ट सर्किट या सीपीयू रीबॉलिंग) और फोन मॉडल पर निर्भर करता है। हमारे वर्कशॉप पर मुफ्त डायग्नोसिस के बाद ही अंतिम खर्च बताया जाता है।",
      },
      {
        question: "क्या मदरबोर्ड रिपेयर के बाद डेटा सुरक्षित रहेगा?",
        answer: "यदि फोन की EMMC या UFS मेमोरी चिप फिजिकली डैमेज नहीं हुई है, तो सीपीयू या पावर आईसी रिपेयर के बाद आपका 100% डेटा (फोटो, कॉन्टैक्ट्स) पूरी तरह सुरक्षित रहता है।",
      },
      {
        question: "क्या मदरबोर्ड रिपेयर पर वारंटी मिलती है?",
        answer: "हाँ, सुपर टेलीकॉम गिरिडीह हमारे सभी माइक्रो-सोल्डरिंग और चिप-लेवल रिपेयर्स पर 90 दिन की पक्की लिखित वारंटी देता है।",
      },
    ],
    aliases: ["motherboard-repair", "ic-chip-level-repair", "dead-phone-repair", "cpu-reballing", "motherboard-chip-level-repair-giridih"],
    relatedSlugs: ["water-damage-revival", "mobile-data-recovery", "charging-port-repair", "screen-display-replacement"],
    authenticVisual: {
      badgeText: "Stereo Microscope Bench",
      caption: "BGA chip alignment under trinocular 45x optical bench on Barganda Road",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "water-damage-revival",
    title: "Water Damaged Phone Ultrasonic Cleaning in Giridih",
    hindiTitle: "पानी में गिरे फोन का अल्ट्रासोनिक केमिकल क्लीनिंग व रिवाइवल",
    shortTagline: "Ultrasonic Chemical Decontamination • Corrosion Removal • 85% Success",
    heroSummary:
      "Dropped your phone in water, rain, or tea? Turn it off immediately and bring it to Super Telecom on Barganda Road, Giridih. Our emergency chemical decontamination, ultrasonic PCB washing, and power-rail drying revive water-damaged smartphones and safeguard your data.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "1–3 Hours",
    warrantyPeriod: "60 Days Service Warranty",
    dataSafetyGuarantee: "Data Recovery Priority",
    iconName: "Droplets",
    badge: "Emergency Service",
    metaDescription:
      "Water damaged phone repair in Giridih at Super Telecom, Barganda Road. Ultrasonic PCB bath, corrosion removal, short-circuit revival for iPhone, Samsung, Xiaomi in 2 hours.",
    keywords: [
      "Water damaged phone repair Giridih",
      "Phone dropped in water fix Barganda Road",
      "Mobile ultrasonic cleaning Giridih",
      "Water damage data recovery Giridih",
    ],
    symptoms: [
      "पानी में गिरने के बाद फोन का अचानक बंद हो जाना या धुआं/गंध आना (Sudden Liquid Short)",
      "कैमरा लेंस या डिस्प्ले ग्लास के भीतर नमी की बूंदें दिखना (Internal Moisture Condensation)",
      "फोन अपने आप बूटलूप होना या चार्जिंग पर ओवरहीट होना (Corrosion on Charging / Power Lines)",
      "स्पीकर की आवाज बहुत धीमी या फटी-फटी सुनाई देना (Speaker Diaphragm Dampness)",
    ],
    customerGuidelines: [
      "फोन को चावल में कभी न रखें! चावल का स्टार्च और धूल अंदर जाकर चिपचिपा पेस्ट बना देती है जो जंग (Corrosion) को 10 गुना तेज कर देता है।",
      "पानी में गिरे फोन को कभी चार्जर में न लगाएं, करंट जाने पर मदरबोर्ड की मेन आईसी हमेशा के लिए जल सकती है।",
      "फोन को तुरंत स्विच ऑफ रखें और जितनी जल्दी हो सके हमारी लैब में लाएं।",
      "सुपर टेलीकॉम लैब में फोन के सभी पुर्जे खोलकर इंडस्ट्रियल अल्ट्रासोनिक बाथ में केमिकल डीकंटैमिनेट किए जाते हैं।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Immediate Battery Disconnect & Inspection",
        hindiTitle: "तुरंत बैटरी कट-ऑफ व डिसअसेंबली",
        description: "शॉर्ट सर्किट फैलने से रोकने के लिए तुरंत पावर डिस्कनेक्शन और शील्ड रिमूवल।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "Ultrasonic IPA Decontamination Bath",
        hindiTitle: "अल्ट्रासोनिक केमिकल बाथ",
        description: "आइसोप्रोपिल बाथ में 40kHz फ्रीक्वेंसी द्वारा छिपी हुई जंग और लवणों का संपूर्ण खात्मा।",
        duration: "35 Mins",
      },
      {
        stepNumber: "03",
        title: "Dehydration, Line Audit & Component Revival",
        hindiTitle: "ड्राइंग, पाॅवर लाइन टेस्ट व डिलीवरी",
        description: "60°C थर्मल डिहाइड्रेशन चैंबर के बाद लाइन निरंतरता और कंपोनेंट बहाली।",
        duration: "45 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo, Oppo Full Decontamination",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "1–2 Hours",
        warranty: "60 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus, Pixel IP68 Seal Restoration",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "2–3 Hours",
        warranty: "60 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Max Dual-Layer Board Decontamination",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "2–4 Hours",
        warranty: "60 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "क्या पानी में गिरा हुआ फोन सचमुच ठीक हो सकता है?",
        answer: "हाँ! यदि फोन को चार्ज में न लगाया गया हो और 24-48 घंटे के भीतर हमारी लैब में लाया जाए, तो 85% से अधिक फोन पूरी तरह ठीक हो जाते हैं।",
      },
      {
        question: "क्या फोन को चावल में रखने से पानी सूख जाता है?",
        answer: "नहीं! यह एक खतरनाक मिथक है। चावल सतह की नमी सोख सकता है, लेकिन मदरबोर्ड के शील्ड के नीचे पानी महीनों तक सड़ता रहता है और तांबे के ट्रेसेस को खा जाता है।",
      },
      {
        question: "वॉटर डैमेज फोन क्लीनिंग में कितना खर्च आता है?",
        answer: "वॉटर डैमेज क्लीनिंग और रिपेयर का खर्च नमी की स्थिति और बोर्ड के शॉर्ट-सर्किट स्तर पर निर्भर करता है। जांच के बाद सटीक परामर्श दिया जाता है।",
      },
      {
        question: "क्या फोन में मौजूद फोटो और डेटा वापस मिल जाएगा?",
        answer: "हाँ, वॉटर डैमेज क्लीनिंग में हमारा पहला लक्ष्य आपके डेटा (फोटो, कॉन्टैक्ट्स, व्हाट्सएप) को सुरक्षित बाहर निकालना होता है।",
      },
    ],
    aliases: ["water-damage-repair", "liquid-damage", "water-damage-mobile-repair-giridih"],
    relatedSlugs: ["motherboard-ic-repair", "mobile-data-recovery", "screen-display-replacement"],
    authenticVisual: {
      badgeText: "Ultrasonic PCB Bath",
      caption: "High-frequency ultrasonic chemical decontamination tank at Barganda Road laboratory",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "green-line-display-fix",
    title: "AMOLED Green Line & Pink Line Screen Fix in Giridih",
    hindiTitle: "AMOLED स्क्रीन ग्रीन लाइन व पिंक लाइन रिपेयर",
    shortTagline: "Save 70% Over Display Replacement • Laser & Flex Micro-Bonding",
    heroSummary:
      "Green line, pink line, or white vertical line appeared on your OnePlus, Samsung, or Vivo phone after a software update? Super Telecom on Barganda Road, Giridih offers advanced AMOLED flex trace repair and laser micro-bonding — saving you up to 70% compared to costly whole screen replacement.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "45–90 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Activity",
    badge: "Cost-Saving Innovation",
    metaDescription:
      "Fix green line & pink line on OnePlus, Samsung, Vivo, iPhone AMOLED displays in Giridih at Super Telecom, Barganda Road. Save 70% vs new screen replacement.",
    keywords: [
      "Green line screen fix Giridih",
      "OnePlus green line repair Barganda Road",
      "Samsung pink line repair Giridih",
      "AMOLED flex bonding Giridih",
    ],
    symptoms: [
      "सॉफ्टवेयर अपडेट के तुरंत बाद स्क्रीन पर एक या अधिक हरी/गुलाबी लाइनें आ जाना (Post-Update Green Line)",
      "फोन हल्का गर्म होने पर लाइनों का बढ़ना या चमकना (Thermal Line Expansion)",
      "टच पूरी तरह सही काम कर रहा है लेकिन बीच में खड़ी लाइनें दिखती हैं (Working Touch with Visible Lines)",
      "स्क्रीन पर किसी प्रकार का बाहरी फिजिकल क्रैक नहीं है (Zero External Glass Damage)",
    ],
    customerGuidelines: [
      "यदि स्क्रीन का कांच नहीं टूटा है, तो पूरी महंगी स्क्रीन बदलने की जरूरत नहीं है; इसे लेजर/फ्लेक्स रिपेयर से ठीक किया जा सकता है।",
      "लाइन आने के बाद फोन की ब्राइटनेस बार-बार 100% न करें ताकि पिक्सल बर्न न हो।",
      "सुपर टेलीकॉम गिरिडीह में हम पहले स्क्रीन की कम्पैटिबिलिटी मुफ्त में टेस्ट करते हैं।",
      "यदि पैनल लेजर रिपेयर के योग्य नहीं होता, तो हम न्यूनतम लागत पर ओरिजिनल सर्विस पैक डिस्प्ले का विकल्प भी देते हैं।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Optical Sub-Pixel & Flex Analysis",
        hindiTitle: "सब-पिक्सल व फ्लेक्स जांच",
        description: "माइक्रोस्कोप के तहत सीएफ (COF) बॉन्डिंग और पिक्सल ड्राइव सर्किट का विस्तृत ऑडिट।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "Laser Micro-Bonding / Flex Rework",
        hindiTitle: "लेजर / फ्लेक्स माइक्रो-बॉन्डिंग",
        description: "शॉर्ट हो चुके कंडक्टिव ITO पाथवे का लेजर डीकपलिंग या रिबन माइक्रो-जंपर रीस्टोरेशन।",
        duration: "45 Mins",
      },
      {
        stepNumber: "03",
        title: "120Hz Thermal Stress Verification",
        hindiTitle: "स्ट्रेस टेस्ट व वारंटी डिलीवरी",
        description: "रिफ्रेश रेट और हीटिंग साइकिल चलाकर यह सुनिश्चित करना कि लाइन दोबारा न आए।",
        duration: "15 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Realme Pro, Redmi Note Pro AMOLED Line Repairs",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "45–60 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "OnePlus 8T/9R/9/10 Pro, Samsung S20/S21/S22 Ultra, Vivo X-Series",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "60–90 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 12, 13, 14, 15 Pro / Pro Max OLED Vertical Lines",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "60–90 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "क्या बिना नया डिस्प्ले लगाए ग्रीन लाइन हटाई जा सकती है?",
        answer: "हाँ! यदि कांच टूटा न हो और समस्या COF फ्लेक्स के सिग्नल शॉर्टेज से हो, तो हमारी अत्याधुनिक माइक्रो-बॉन्डिंग तकनीक से स्क्रीन बदले बिना ग्रीन लाइन को 70% कम खर्च में ठीक किया जा सकता है।",
      },
      {
        question: "वनप्लस या सैमसंग में ग्रीन लाइन आने का क्या कारण है?",
        answer: "सॉफ्टवेयर अपडेट के दौरान हाई सीपीयू लोड और गर्मी के कारण डिस्प्ले के फ्लेक्स केबल पर लगे बारीक ITO ट्रेसेज में माइक्रो-शॉर्ट हो जाता है, जिससे पूरी लाइन जल उठती है।",
      },
      {
        question: "क्या ग्रीन लाइन ठीक करने पर डेटा सुरक्षित रहता है?",
        answer: "हाँ, यह 100% डेटा सेफ प्रक्रिया है। फोन को न तो रीसेट किया जाता है और न ही आपके किसी डेटा को छुआ जाता है।",
      },
      {
        question: "क्या रिपेयर के बाद दोबारा लाइन आ सकती है?",
        answer: "हम रिपेयर के बाद 90 दिन की गारंटी देते हैं। यदि हमारी रिपेयर की गई पाथवे में कोई समस्या आती है, तो हम उसे मुफ्त में दोबारा जांचते हैं।",
      },
    ],
    aliases: ["green-line-repair", "pink-line-fix", "laser-screen-repair", "amoled-line-fix"],
    relatedSlugs: ["screen-display-replacement", "motherboard-ic-repair", "iphone-back-glass-repair"],
    authenticVisual: {
      badgeText: "COF Trace Restoration",
      caption: "High-magnification AMOLED flex trace repair station at Super Telecom Giridih",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "camera-lens-repair",
    title: "Front & Rear Camera Module & Lens Glass Repair in Giridih",
    hindiTitle: "फ्रंट व रियर कैमरा मॉड्यूल और लेंस ग्लास रिपेयर",
    shortTagline: "Blurry Photos Fixed • Sapphire Glass Replacement • 30–60 Mins",
    heroSummary:
      "Cracked outer camera glass, blurry focus, shaky OIS jitter, or black camera screen? Super Telecom Giridih stocks original sapphire camera lens glass and replacement camera sensor modules for iPhone, Samsung, OnePlus, and Vivo at our Barganda Road workshop.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "30–60 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Camera",
    badge: "Crystal Clear Quality",
    metaDescription:
      "Fix cracked camera glass, blurry autofocus, and black camera in Giridih at Super Telecom, Barganda Road. Sapphire lens & original camera module repair in 30 mins.",
    keywords: [
      "Camera lens replacement Giridih",
      "Phone camera repair Barganda Road",
      "iPhone camera glass repair Giridih",
      "Blurry camera fix Giridih",
    ],
    symptoms: [
      "कैमरे का बाहरी शीशा टूट जाना जिससे फोटो में धुंधलापन या चमक आना (Cracked Outer Lens Ring)",
      "ऑटोफोकस न होना, फोटो हमेशा ब्लर आना (Autofocus Motor Failure)",
      "कैमरा खोलने पर इमेज का कांपना या घर्र-घर्र की आवाज आना (OIS Stabilization Jitter)",
      "कैमरा ऐप खोलने पर केवल ब्लैक स्क्रीन दिखना या ऐप क्रैश होना (Sensor Ribbon Detached)",
    ],
    customerGuidelines: [
      "यदि केवल बाहरी शीशा टूटा है तो तुरंत पारदर्शी टेप लगा लें ताकि लेंस सेंसर पर धूल और स्क्रैच न पड़ें।",
      "बिना शीशा बदले टूटे कैमरे से फोटो न खींचें, धूल जाने पर पूरे महंगे कैमरे को बदलना पड़ सकता है।",
      "सुपर टेलीकॉम पर बिना फोन खोले या न्यूनतम डिस्सेंबली से केवल बाहरी लेंस भी बदला जा सकता है।",
      "रिपेयर के बाद 4K/60fps रिकॉर्डिंग, मैक्रो और पोर्ट्रेट फोकस की पूरी जांच की जाती है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Sensor Cleanliness & OIS Vibration Check",
        hindiTitle: "सेंसर डस्ट व स्टेबिलाइज़र जांच",
        description: "लेंस एलीमेंट पर धूल के कणों और ऑटो-फोकस मोटर की ऑप्टिकल जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Dust-Free Sapphire Lens / Module Fit",
        hindiTitle: "सफायर ग्लास व मॉड्यूल फिटिंग",
        description: "क्लीन-रूम चैंबर में नए सफायर ग्लास या नए OEM कैमरा मॉड्यूल की सटीक फिटिंग।",
        duration: "25 Mins",
      },
      {
        stepNumber: "03",
        title: "Multi-Focal Optical Calibration",
        hindiTitle: "मल्टी-फोकल कैमरा टेस्टिंग",
        description: "अल्ट्रा-वाइड, 1x, 3x टेलीफोटो और 4K वीडियो स्टेबिलाइजेशन टेस्ट।",
        duration: "10 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Vivo, Poco Outer Glass & Sensor Modules",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–40 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus Hasselblad Modules, Vivo Zeiss Lenses",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–50 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Max Sapphire Lens Glass & 48MP Modules",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "35–60 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "अगर केवल कैमरे का ऊपर का शीशा टूटा है तो पूरा कैमरा बदलना पड़ेगा?",
        answer: "नहीं! यदि अंदर का कैमरा सेंसर सही फोटो ले रहा है, तो हम केवल मॉडल अनुसार में बाहरी ओरिजिनल सफायर लेंस ग्लास बदल देते हैं।",
      },
      {
        question: "क्या नया लेंस लगने के बाद फोटो की क्वालिटी पहले जैसी रहेगी?",
        answer: "हाँ! हम एंटी-रिफ्लेक्टिव कोटिंग वाले ओरिजिनल ग्रेड ग्लास लगाते हैं, जिससे फोटो की शार्पनेस और रंग बिल्कुल मूल कैमरे जैसे आते हैं।",
      },
      {
        question: "कैमरा बदलने में कितना समय लगता है?",
        answer: "लेंस ग्लास रिप्लेसमेंट में सिर्फ 20–30 मिनट और पूरा कैमरा मॉड्यूल बदलने में लगभग 40–50 मिनट का समय लगता है।",
      },
      {
        question: "क्या आईफोन में कैमरा बदलने पर कोई एरर नोटिफिकेशन आता है?",
        answer: "हम मूल सेंसर फ्लेक्स और प्रोग्रामिंग को सुरक्षित रखते हैं ताकि आईफोन में कोई अनचाहा अननोन पार्ट एरर न आए।",
      },
    ],
    aliases: ["camera-repair", "lens-glass-replacement", "camera-lens-fix"],
    relatedSlugs: ["iphone-back-glass-repair", "screen-display-replacement", "speaker-sound-repair"],
    authenticVisual: {
      badgeText: "Dust-Free Camera Assembly",
      caption: "Precision optical lens alignment under clean bench at Super Telecom Giridih",
      image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "speaker-sound-repair",
    title: "Mobile Loudspeaker, Earpiece & Sound Fix in Giridih",
    hindiTitle: "मोबाइल लाउडस्पीकर, ईयरपीस और कम आवाज समाधान",
    shortTagline: "Muffled Audio Solved • Genuine Speaker Coils • 20–40 Mins",
    heroSummary:
      "Can't hear the caller on ear speaker, distorted ringtone sound, or completely dead speaker? Super Telecom on Barganda Road, Giridih restores crystal-clear audio with ultrasonic mesh de-clogging and original speaker module replacements within 30 minutes.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "20–40 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Volume2",
    badge: "Fast Audio Fix",
    metaDescription:
      "Fix low in-call volume, distorted speaker, and earpiece in Giridih at Super Telecom, Barganda Road. Fast mobile speaker repair in 30 mins with warranty.",
    keywords: [
      "Mobile speaker repair Giridih",
      "Phone earpiece sound low fix Barganda Road",
      "Loudspeaker replacement Giridih",
      "iPhone ear speaker repair Giridih",
    ],
    symptoms: [
      "कॉल के दौरान सामने वाले की आवाज बहुत धीमी आना (Clogged / Low Earpiece Volume)",
      "गाना या रिंगटोन बजने पर आवाज फटना या घर्र-घर्र करना (Cracked Speaker Diaphragm)",
      "फोन का लाउडस्पीकर पूरी तरह शांत होना (Dead Audio Sub-circuit)",
      "ईयरफोन या ब्लूटूथ हटाने के बाद भी स्क्रीन पर हेडफोन का निशान अटका रहना (Audio Jack Sense Short)",
    ],
    customerGuidelines: [
      "ईयरपीस ग्रिल में टूथपिक या सुई कभी न चुभोएं, इससे अंदर का नाज़ुक स्पीकर पर्दा हमेशा के लिए फट जाता है।",
      "अक्सर 50% मामलों में केवल ग्रिल पर तेल और धूल जमने से आवाज कम होती है जिसे हम 10 मिनट में क्लीन कर देते हैं।",
      "यदि स्पीकर का पर्दा फट चुका हो तो सुपर टेलीकॉम पर ओरिजिनल बेस-बूस्टेड मॉड्यूल लगाया जाता है।",
      "रिपेयर के बाद कॉलिंग और स्टीरियो साउंड टेस्ट आपके सामने कराया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Acoustic Mesh Inspection & Audio Frequency Test",
        hindiTitle: "ध्वनि फ्रीक्वेंसी व जाली जांच",
        description: "100Hz–10kHz ऑडियो टोन जनरेटर से स्पीकर डायफ्राम और जाली की जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Ultrasonic De-clog / Module Swap",
        hindiTitle: "ग्रिल क्लीनिंग या नया मॉड्यूल",
        description: "अल्ट्रासोनिक ग्रिल क्लीनिंग या नया ओरिजिनल बॉक्सी स्पीकर मॉड्यूल फिटिंग।",
        duration: "15–20 Mins",
      },
      {
        stepNumber: "03",
        title: "Decibel Loudness & Mic Crosstalk Check",
        hindiTitle: "डेसिबल व कॉलिंग टेस्ट",
        description: "फुल वॉल्यूम डेसिबल टेस्ट और दोनों तरफ स्पष्ट बातचीत की पुष्टि।",
        duration: "5 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo, Oppo Ear Speaker & Loudspeaker",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "20–30 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series Stereo Speakers, OnePlus Dolby Atmos Units",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–40 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Earpiece & Bottom Taptic Speaker Modules",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "कॉल में आवाज बहुत धीमी आ रही है, क्या स्पीकर बदलना ही पड़ेगा?",
        answer: "जरूरी नहीं! लगभग आधी बार सिर्फ ईयरपीस की जाली में धूल और पसीना जम जाता है। हमारे गिरिडीह वर्कशॉप में हम बिना फोन खोले स्पेशल केमिकल क्लीनिंग से इसे मात्र मॉडल अनुसार में बिल्कुल नया जैसा कर देते हैं।",
      },
      {
        question: "स्पीकर बदलने में कितना समय लगता है?",
        answer: "स्पीकर रिप्लेसमेंट में सिर्फ 20 से 30 मिनट का समय लगता है।",
      },
      {
        question: "क्या नए स्पीकर में बेस और आवाज पहले जैसी आएगी?",
        answer: "हाँ, हम ओरिजिनल स्टीरियो लाउडस्पीकर लगाते हैं जो फैक्ट्री जैसी तेज और क्रिस्प आवाज प्रदान करता है।",
      },
      {
        question: "क्या स्पीकर बदलने से फोन का डेटा मिटेगा?",
        answer: "नहीं, स्पीकर हार्डवेयर का बाहरी कंपोनेंट है, इसका आपके फोन के डेटा से कोई संबंध नहीं होता।",
      },
    ],
    aliases: ["speaker-repair", "loudspeaker-earpiece", "speaker-mic-repair"],
    relatedSlugs: ["microphone-repair", "charging-port-repair", "water-damage-revival"],
    authenticVisual: {
      badgeText: "Acoustic Chamber Test",
      caption: "Stereo speaker enclosure and acoustic mesh cleaning on Barganda Road",
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "microphone-repair",
    title: "Mobile Mic & Call Voice Problem Repair in Giridih",
    hindiTitle: "मोबाइल माइक व कॉल आवाज समस्या समाधान",
    shortTagline: "Clear Call Audio • Noise-Cancelling Mic Fix • 20–40 Mins",
    heroSummary:
      "Caller can't hear you, WhatsApp voice notes are silent, or video recordings have loud static noise? Super Telecom on Barganda Road, Giridih repairs digital silicon MEMS microphones and secondary noise-cancellation mics for all smartphone brands in 20–40 minutes.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "20–40 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Mic",
    badge: "Crystal Voice",
    metaDescription:
      "Fix phone mic, caller can't hear voice, and WhatsApp audio note issues in Giridih at Super Telecom, Barganda Road. Fast 30-min mobile mic repair with warranty.",
    keywords: [
      "Mobile mic repair Giridih",
      "Phone microphone problem Barganda Road",
      "Call voice not going fix Giridih",
      "iPhone microphone replacement Giridih",
    ],
    symptoms: [
      "कॉल के दौरान दूसरी तरफ वाले को आपकी आवाज बिल्कुल न जाना (No Voice on Outgoing Calls)",
      "व्हाट्सएप या वॉयस रिकॉर्डिंग में भारी सरसराहट या सन्नाटा होना (Static Noise / Blank Audio)",
      "लाउडस्पीकर पर कॉल करने पर ही आवाज जाना, सामान्य में न जाना (Secondary Mic Switching Issue)",
      "कॉल में आवाज बहुत दूर या गूंजती हुई सुनाई देना (Echo / Muffled Transmission)",
    ],
    customerGuidelines: [
      "चार्जिंग पोर्ट के पास मौजूद छोटे माइक होल में पिन या सुई कभी न डालें, इससे माइक का डिजिटल पर्दा फट जाता है।",
      "वॉटर डैमेज होने पर माइक सबसे पहले खराब होता है; इसे बिना देर किए तुरंत चेक कराएं।",
      "सुपर टेलीकॉम पर ओरिजिनल डिजिटल सिलिकॉन MEMS माइक लगाए जाते हैं जो नॉइज़-कैंसिलेशन सपोर्ट करते हैं।",
      "रिपेयर के बाद लाइव कॉल करके आवाज की क्वालिटी की शत-प्रतिशत पुष्टि की जाती है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Dual-Mic Loopback Audio Testing",
        hindiTitle: "प्राइमरी व सेकेंडरी माइक टेस्ट",
        description: "सिस्टम डायग्नोस्टिक्स द्वारा प्राइमरी कॉल माइक और सेकेंडरी नॉइज़ माइक का पृथक्करण।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "SMD MEMS Mic Hot-Air Micro-Soldering",
        hindiTitle: "डिजिटल माइक माइक्रो-सोल्डरिंग",
        description: "सब-बोर्ड पर 4-पिन डिजिटल MEMS माइक्रोफोन का प्रेसिजन सोल्डरिंग रिप्लेसमेंट।",
        duration: "15–20 Mins",
      },
      {
        stepNumber: "03",
        title: "Voice Recording & GSM Network Verification",
        hindiTitle: "वॉयस नोट व नेटवर्क कॉल टेस्ट",
        description: "एचडी वॉयस कॉल और नॉइज़ सप्रेशन का लाइव परीक्षण।",
        duration: "5 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo Primary Call Mic",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "20–30 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus Quad-Mic Array, Pixel",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–40 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Triple-Mic & Siri Flex Arrays",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "कॉल पर मेरी आवाज सामने वाले को नहीं जाती, इसे ठीक कराने में कितना खर्च आएगा?",
        answer: "सामान्य एंड्रॉइड फोन में माइक रिपेयर या सब-बोर्ड चेंज का खर्च मॉडल अनुसार के बीच होता है।",
      },
      {
        question: "माइक ठीक करने में कितना समय लगता है?",
        answer: "अधिकांश मामलों में केवल 20 से 40 मिनट के भीतर माइक रिपेयर कर दिया जाता है।",
      },
      {
        question: "क्या माइक ठीक करने से मेरा फोन रीसेट होगा?",
        answer: "बिल्कुल नहीं! यह केवल एक हार्डवेयर सोल्डरिंग काम है, आपके फोटो या ऐप्स को कुछ नहीं होता।",
      },
      {
        question: "क्या रिपेयर के बाद व्हाट्सएप वॉयस नोट भी सही काम करेगा?",
        answer: "हाँ! हम प्राइमरी कॉल माइक और सेकेंडरी रिकॉर्डिंग माइक दोनों को टेस्ट करके ही फोन देते हैं।",
      },
    ],
    aliases: ["mic-repair", "call-voice-repair", "microphone-fix"],
    relatedSlugs: ["speaker-sound-repair", "charging-port-repair", "water-damage-revival"],
    authenticVisual: {
      badgeText: "MEMS Silicon Microphone",
      caption: "Digital noise-cancelling MEMS microphone hot-air rework on Barganda Road",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "network-5g-signal-repair",
    title: "No Service, 5G/4G Network IC & Antenna Repair in Giridih",
    hindiTitle: "नो सर्विस, 5G/4G नेटवर्क आईसी व एंटीना रिपेयर",
    shortTagline: "Fix 'No Service' • Baseband & WTR IC Rework • 90 Days Warranty",
    heroSummary:
      "Phone showing 'No Service', 'Emergency Calls Only', fluctuating 5G signal, or missing IMEI? Super Telecom Giridih specializes in RF transceiver WTR IC replacement, baseband chip reballing, and coaxial antenna flex repair on Barganda Road.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "1–3 Hours",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Wifi",
    badge: "RF Specialist",
    metaDescription:
      "Fix No Service, weak 5G signal, and baseband radio IC issues in Giridih at Super Telecom, Barganda Road. Reliable antenna and RF chip repair with 90-day warranty.",
    keywords: [
      "No service phone repair Giridih",
      "5G signal problem fix Barganda Road",
      "Network IC replacement Giridih",
      "iPhone baseband repair Giridih",
    ],
    symptoms: [
      "सिम कार्ड लगाने के बाद भी 'No Service' या 'Emergency Calls Only' आना (No Network Found)",
      "कमरे के अंदर जाते ही सिग्नल पूरी तरह गायब हो जाना (Weak Antenna Coaxial Line)",
      "फोन की सेटिंग में 'Baseband Unknown' या IMEI नंबर शो न होना (Corrupted Radio Modem)",
      "5G नेटवर्क का बार-बार 2G या नो सर्विस पर गिर जाना (RF Transceiver WTR Fault)",
    ],
    customerGuidelines: [
      "पहले किसी दूसरे फोन में अपनी सिम डालकर चेक करें ताकि सिम खराब होने की संभावना खत्म हो जाए।",
      "यदि फोन गिरने के बाद नेटवर्क गया है तो यह 90% मामलों में एंटीना केबल या बेसबैंड आईसी का ड्राई-जॉइंट होता है।",
      "बिना सोचे-समझे फोन को बार-बार हार्ड रीसेट न करें, इससे बेसबैंड एरर ठीक नहीं होता।",
      "सुपर टेलीकॉम गिरिडीह में आरएफ सिग्नल स्पेक्ट्रम टेस्टर द्वारा सही फॉल्ट पकड़कर रिपेयर किया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Baseband & Coaxial Antenna Line Continuity",
        hindiTitle: "एंटीना व बेसबैंड निरंतरता जांच",
        description: "सिम स्लॉट वोल्टेज और आरएफ पाथवे की मल्टीमीटर व ऑसिलोस्कोप जांच।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "WTR RF Transceiver / Baseband Rework",
        hindiTitle: "आरएफ चिप व आईसी सोल्डरिंग",
        description: "दोषपूर्ण WTR / SDR चिप का माइक्रो-सोल्डरिंग रिप्लेसमेंट या एंटीना स्विच फिटिंग।",
        duration: "45–60 Mins",
      },
      {
        stepNumber: "03",
        title: "Jio & Airtel 5G/4G Band Stress Verification",
        hindiTitle: "लाइव 5G/4G बैंड टेस्ट",
        description: "जिओ और एयरटेल 5G नेटवर्क पर डाउनलोड स्पीड और वॉयस कॉल की फील्ड टेस्टिंग।",
        duration: "15 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo Antenna Cable & WTR Chip",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "1–2 Hours",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus 5G RF Power Amp & Antenna Switch",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "2–3 Hours",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 15 Baseband CPU Reballing & Sandwich Board Separation",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "Same Day / 2–4 Hours",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "फोन में नो सर्विस (No Service) आ रहा है, क्या यह ठीक हो जाएगा?",
        answer: "हाँ! 90% से अधिक मामलों में यह एंटीना स्ट्रिप या WTR नेटवर्क आईसी के खराब होने से होता है। हमारी लैब में आईसी बदलकर सिग्नल पूरी तरह रीस्टोर कर दिया जाता है।",
      },
      {
        question: "नेटवर्क आईसी रिपेयर में कितना खर्च आता है?",
        answer: "नेटवर्क रिपेयर का खर्च एंटीना केबल, सिम स्लॉट या WTR/बेसकैंड आईसी की स्थिति के अनुसार तय होता है। सुपर टेलीकॉम पर फ्री टेस्टिंग उपलब्ध है।",
      },
      {
        question: "क्या रिपेयर के बाद 5G स्पीड पहले जैसी मिलेगी?",
        answer: "हाँ! हम ओरिजिनल RF चिप्स और ओरिजिनल एंटीना लाइन लगाते हैं जिससे Jio और Airtel 5G की पूरी स्पीड मिलती है।",
      },
      {
        question: "क्या नेटवर्क रिपेयर में मेरा डेटा सुरक्षित रहता है?",
        answer: "हाँ, यह पूरी तरह से मदरबोर्ड के आरएफ (रेडियो फ्रीक्वेंसी) सेक्शन का काम है, आपके फोटो, चैट या डेटा को कोई नुकसान नहीं होता।",
      },
    ],
    aliases: ["network-repair", "no-service-fix", "5g-signal-repair", "baseband-repair"],
    relatedSlugs: ["motherboard-ic-repair", "battery-replacement", "charging-port-repair"],
    authenticVisual: {
      badgeText: "RF Spectrum Testing",
      caption: "5G RF transceiver chip rework and coaxial antenna continuity testing on Barganda Road",
      image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "software-flashing-unlock",
    title: "Mobile Software Flashing, Bootloop & OS Recovery in Giridih",
    hindiTitle: "मोबाइल सॉफ्टवेयर फ्लैशिंग, बूटलूप व ओएस रिकवरी",
    shortTagline: "Stock ROM Flashing • FRP Lock Unlock • Fast 30-Min Recovery",
    heroSummary:
      "Phone stuck on company logo, failed update bootloop, forgot screen lock, or FRP Google account lock? Super Telecom Giridih provides authorized EDL box flashing, official stock firmware restoration, and rapid Android/iOS software troubleshooting on Barganda Road.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "20–45 Minutes",
    warrantyPeriod: "30 Days Software Warranty",
    dataSafetyGuarantee: "Data Saved in Soft Bootloop (Subject to OS state)",
    iconName: "Terminal",
    badge: "Official Stock ROM",
    metaDescription:
      "Official mobile software flashing, bootloop fix, FRP Google unlock in Giridih at Super Telecom, Barganda Road. Fast 30-min recovery for all brands with valid bill.",
    keywords: [
      "Mobile software flashing Giridih",
      "Phone bootloop fix Barganda Road",
      "FRP unlock shop Giridih",
      "Android stock ROM flashing Giridih",
    ],
    symptoms: [
      "फोन का कंपनी के लोगो (Mi, Samsung, Realme) पर अटक जाना और आगे न बढ़ना (Bootloop)",
      "सिस्टम अपडेट के दौरान फोन का स्विच ऑफ होकर रिकवरी मोड में चले जाना (Corrupted Recovery)",
      "फोन बहुत ज्यादा धीमा चलना, बार-बार ऐप्स का 'Unfortunately Stopped' होना (OS Corruption)",
      "स्क्रीन लॉक पासवर्ड/पैटर्न भूल जाना या फैक्टरी रीसेट के बाद FRP लॉक लग जाना (Forgot Pattern / FRP)",
    ],
    customerGuidelines: [
      "कृपया ध्यान दें: चोरी या संदिग्ध पाए जाने वाले किसी भी फोन का लॉक नहीं खोला जाता। लॉक खुलवाने के लिए पहचान पत्र और फोन का ओरिजिनल बिल अनिवार्य है।",
      "इंटरनेट से अधूरा या अनधिकृत कस्टम रोम डाउनलोड करके फोन को हार्ड-ब्रिक न करें।",
      "सुपर टेलीकॉम पर कंपनी के ऑफिशियल क्लीन स्टॉक फर्मवेयर (Stock ROM) ही फ्लैश किए जाते हैं।",
      "सॉफ्टवेयर के बाद फोन की स्पीड बिल्कुल नई जैसी स्मूथ और फास्ट हो जाती है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Partition Health & Chipset Handshake",
        hindiTitle: "चिपसेट व पार्टिशन जांच",
        description: "Qualcomm EDL / MediaTek BROM मोड में पार्टीशन टेबल और स्टोरेज मेमोरी टेस्ट।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "Official Stock Firmware Clean Flash",
        hindiTitle: "ऑफिशियल स्टॉक रॉम फ्लैशिंग",
        description: "ऑफिशियल ऑथेंटिकेटेड सर्वर से फुल सिस्टम इमेज, कर्नल और मॉडम की क्लीन राइटिंग।",
        duration: "15–25 Mins",
      },
      {
        stepNumber: "03",
        title: "Security Patch & Sensor Calibration",
        hindiTitle: "बूट टेस्ट व सेंसर कैलिब्रेशन",
        description: "सक्सेसफुल फर्स्ट बूट, फिंगरप्रिंट कैलिब्रेशन और जीपीएस/ब्लूटूथ वेरिफिकेशन।",
        duration: "10 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo, Oppo Bootloop & Stock ROM Flash",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "20–35 Mins",
        warranty: "30 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung Odin Flash, OnePlus MSM Tool Unbrick, Pixel Factory Image",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "30 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone DFU Mode Restore, iTunes Error 4013/1110 Bypass, iOS Downgrade",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–60 Mins",
        warranty: "30 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "फोन लोगो पर अटका हुआ है (Bootloop), क्या यह ठीक हो जाएगा?",
        answer: "हाँ! 95% मामलों में यह केवल करप्ट सॉफ्टवेयर होता है। हमारे गिरिडीह स्टोर पर मात्र 20 से 30 मिनट में ऑफिशियल स्टॉक रॉम फ्लैश करके फोन को चालू कर दिया जाता है।",
      },
      {
        question: "क्या स्क्रीन लॉक हटाने के लिए कोई दस्तावेज चाहिए?",
        answer: "हाँ! कानूनी और सुरक्षा कारणों से स्क्रीन लॉक या एफआरपी हटाने के लिए ग्राहक का आधार कार्ड और फोन का बिल या बॉक्स अनिवार्य है।",
      },
      {
        question: "सॉफ्टवेयर फ्लैशिंग में कितना खर्च आता है?",
        answer: "सॉफ्टवेयर और बूटलूप ठीक करने का खर्च फोन मॉडल और आवश्यक फर्मवेयर फ्लैशिंग प्रक्रिया के अनुसार तय होता है।",
      },
      {
        question: "क्या सॉफ्टवेयर कराने से फोन हैंग होना बंद हो जाएगा?",
        answer: "हाँ! क्लीन स्टॉक फर्मवेयर इंस्टॉल होने से सभी मैलवेयर, करप्ट फाइलें और बैकग्राउंड लोड हट जाते हैं और फोन नई जैसी स्पीड देने लगता है।",
      },
    ],
    aliases: ["software-repair", "flashing", "frp-unlock", "bootloop-fix", "unbrick-phone"],
    relatedSlugs: ["phone-hanging-performance-fix", "motherboard-ic-repair", "mobile-data-recovery"],
    authenticVisual: {
      badgeText: "Direct EDL Mode Flash",
      caption: "High-speed USB EDL programming and authorized stock partition recovery at Super Telecom",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "fingerprint-face-id-repair",
    title: "In-Display Fingerprint & iPhone Face ID Repair in Giridih",
    hindiTitle: "इन-डिस्प्ले फिंगरप्रिंट व आईफोन फेस आईडी रिपेयर",
    shortTagline: "Biometric Dot Projector Alignment • Optical Sensor Calibration",
    heroSummary:
      "Face ID showing 'Move iPhone a little lower', TrueDepth camera unavailable, or in-display optical fingerprint failing after screen replacement? Super Telecom on Barganda Road, Giridih performs dot projector micro-soldering and optical sensor re-calibration.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "45–90 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "Fingerprint",
    badge: "Biometric Precision",
    metaDescription:
      "Fix iPhone Face ID, TrueDepth camera and Android in-display fingerprint sensor in Giridih at Super Telecom, Barganda Road. Fast biometric calibration with warranty.",
    keywords: [
      "iPhone Face ID repair Giridih",
      "In-display fingerprint calibration Giridih",
      "TrueDepth camera fix Barganda Road",
      "Biometric sensor repair Giridih",
    ],
    symptoms: [
      "आईफोन में 'Face ID is not available' या 'Move iPhone lower' का एरर आना (Dot Projector Shift)",
      "स्क्रीन बदलने के बाद इन-डिस्प्ले फिंगरप्रिंट का काम न करना या 'Enrollment Failed' होना (Optical Sensor Misaligned)",
      "फिंगरप्रिंट स्कैनर का अंगुली को बार-बार न पहचानना (Weak Optical Reflection)",
      "सामने के पोर्ट्रेट मोड में बैकग्राउंड ब्लर न होना (TrueDepth Infrared Mesh Inactive)",
    ],
    customerGuidelines: [
      "आईफोन का फेस आईडी बहुत संवेदनशील होता है; पानी जाने या लोकल मैकेनिक द्वारा गलत खोलने पर डॉट प्रोजेक्टर आसानी से खराब हो जाता है।",
      "स्क्रीन बदलते समय हमेशा फिंगरप्रिंट कैलिब्रेशन टूल से री-कैलिब्रेट कराना सुनिश्चित करें।",
      "सुपर टेलीकॉम पर जेसीआईडी (JCID) और डेडिकेटेड प्रोग्रामर से फेस आईडी का मूल सीरियल डेटा ट्रांसफर किया जाता है।",
      "रिपेयर के बाद फेस रजिस्टर और 1-सेकंड अनलॉक की पूरी जांच की जाती है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Infrared Dot Projector & Prism Diagnostics",
        hindiTitle: "इन्फ्रारेड प्रिज्म व डेटा टेस्ट",
        description: "स्पेशल डिटेक्टर से आईआर एमिटर, फ्लड इलुमिनेटर और प्रिज्म के एंगल की जांच।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "Micro-Prism Alignment & MOSFET Bypass",
        hindiTitle: "प्रिज्म अलाइनमेंट व माइक्रो-सोल्डरिंग",
        description: "डॉट प्रोजेक्टर के डैमेज मॉसफेट का माइक्रो-सोल्डरिंग रिप्लेसमेंट और प्रिज्म फिक्स।",
        duration: "45–60 Mins",
      },
      {
        stepNumber: "03",
        title: "Optical Calibration & Biometric Enrollment",
        hindiTitle: "बायोमेट्रिक एनरोलमेंट टेस्ट",
        description: "अंधेरे और रोशनी में 100% सटीक फेस आईडी और फिंगरप्रिंट अनलॉकिंग की पुष्टि।",
        duration: "15 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco Side-Mounted Fingerprint Flex Swap",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–40 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series Ultrasonic Sensor, OnePlus Optical Calibration",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "40–60 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone X through 15 Pro Max Face ID Dot Projector & TrueDepth Rework",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "60–90 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "क्या खराब हो चुका आईफोन फेस आईडी (Face ID) दोबारा चालू हो सकता है?",
        answer: "हाँ! पहले फेस आईडी खराब होने पर कोई उपाय नहीं था, लेकिन आज हमारी गिरिडीह लैब में अत्याधुनिक डॉट-प्रोजेक्टर प्रोग्रामर और माइक्रो-सोल्डरिंग से 90% आईफोन का फेस आईडी सफलतापूर्वक ठीक किया जा सकता है।",
      },
      {
        question: "डिस्प्ले बदलने के बाद इन-डिस्प्ले फिंगरप्रिंट क्यों काम नहीं कर रहा था?",
        answer: "स्क्रीन बदलते समय यदि ऑप्टिकल कैलिब्रेशन न किया जाए या लो-क्वालिटी ग्लास लगाया जाए, तो सेंसर रोशनी नहीं पढ़ पाता। हम सही ग्लास लगाकर सॉफ्टवेयर कैलिब्रेशन द्वारा इसे तुरंत ठीक कर देते हैं।",
      },
      {
        question: "फेस आईडी रिपेयर में कितना खर्च आता है?",
        answer: "आईफोन मॉडल के आधार पर फेस आईडी रिपेयर का खर्च मॉडल अनुसार के बीच आता है।",
      },
      {
        question: "क्या इस प्रक्रिया में फोन का डेटा सेफ रहता है?",
        answer: "हाँ, यह 100% डेटा सेफ है। आपके किसी भी फोटो, मैसेज या कॉन्टैक्ट को नहीं छुआ जाता।",
      },
    ],
    aliases: ["face-id-repair", "fingerprint-repair", "biometric-fix", "dot-projector-repair"],
    relatedSlugs: ["screen-display-replacement", "camera-lens-repair", "motherboard-ic-repair"],
    authenticVisual: {
      badgeText: "Dot Projector Bench",
      caption: "TrueDepth infrared prism alignment and micro-soldering at Super Telecom Giridih",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "power-volume-button-repair",
    title: "Power Key, Volume Button & Side Flex Replacement in Giridih",
    hindiTitle: "पावर बटन, वॉल्यूम की और साइड फ्लेक्स रिप्लेसमेंट",
    shortTagline: "Sticky Buttons Restored • 20–30 Mins Express Swap • 90 Days Warranty",
    heroSummary:
      "Power button jammed, volume keys not clicking, or phone stuck in fastboot mode because of a shorted volume key? Super Telecom on Barganda Road, Giridih replaces tactile micro-switches and internal side flex cables for all phone models in 20–30 minutes.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "20–35 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe",
    iconName: "ToggleLeft",
    badge: "Quick 20-Min Fix",
    metaDescription:
      "Fix jammed power button, unresponsive volume keys, and side flex ribbon in Giridih at Super Telecom, Barganda Road. Fast 20-min button repair with warranty.",
    keywords: [
      "Power button repair Giridih",
      "Volume key replacement Barganda Road",
      "Phone button jammed fix Giridih",
      "iPhone power flex repair Giridih",
    ],
    symptoms: [
      "पावर बटन दबाने पर क्लिक की आवाज न आना या अंदर धंस जाना (Jammed / Mushy Power Button)",
      "फोन का अपने आप वॉल्यूम कम/ज्यादा होना या सेफ मोड में बूट होना (Shorted Volume Membrane)",
      "पावर बटन दबाने पर भी स्क्रीन का ऑन/ऑफ न होना (Torn Internal Switch Flex)",
      "फोन चालू करते ही फास्टबूट (Fastboot) या रिकवरी मेनू में चले जाना (Stuck Volume Down Key)",
    ],
    customerGuidelines: [
      "धंसे हुए बटन को बाहर खींचने के लिए चाकू या ब्लेड न घुसाएं, इससे फोन का बाहरी मेटल फ्रेम कट जाता है।",
      "अक्सर धूल या पसीने से बटन का इंटरनल डोम स्विच जाम हो जाता है, जिसे 20 मिनट में नया फ्लेक्स लगाकर ठीक किया जा सकता है।",
      "यदि वॉल्यूम की शॉर्ट होने से फोन बार-बार फास्टबूट में जा रहा हो, तो परेशान न हों—यह सॉफ्टवेयर नहीं, बल्कि एक साधारण हार्डवेयर बटन फॉल्ट है जो नए फ्लेक्स से आसानी से ठीक हो जाता है।",
      "सुपर टेलीकॉम पर ओरिजिनल क्लिकी और वाटर-सील्ड बटन्स लगाए जाते हैं।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Tactile Switch & Membrane Continuity Check",
        hindiTitle: "स्विच निरंतरता व क्लिक जांच",
        description: "मल्टीमीटर से साइड फ्लेक्स के इंटरनल डोम स्विच और ग्राउंडिंग की जांच।",
        duration: "5 Mins",
      },
      {
        stepNumber: "02",
        title: "OEM Side Flex Cable Replacement",
        hindiTitle: "नया ओरिजिनल फ्लेक्स इंस्टालेशन",
        description: "पुराने घिसे हुए फ्लेक्स को हटाकर नए रिबन केबल की सुरक्षित फिटिंग।",
        duration: "15 Mins",
      },
      {
        stepNumber: "03",
        title: "Tactile Click & Frame Alignment Test",
        hindiTitle: "क्लिक रिस्पॉन्स व डिलीवरी",
        description: "पावर ऑन/ऑफ, स्क्रीनशॉट और वॉल्यूम अप/डाउन की स्मूथ क्लिक टेस्टिंग।",
        duration: "5 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo, Oppo Power & Volume Flex",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "20–30 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S-Series, OnePlus Alert Slider & Button Flex",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "25–35 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Power/Flash/Volume Action Flex",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "पावर बटन बदलने में कितना खर्च आता है?",
        answer: "सामान्य एंड्रॉइड फोन का पावर या वॉल्यूम बटन फ्लेक्स केवल मॉडल अनुसार के बीच बदल जाता है।",
      },
      {
        question: "बटन बदलने में कितना समय लगता है?",
        answer: "यह एक बहुत तेज रिपेयर है जो केवल 20 से 30 मिनट में आपके सामने पूरी हो जाती है।",
      },
      {
        question: "क्या बटन बदलने के लिए फोन को फॉर्मेट किया जाता है?",
        answer: "बिल्कुल नहीं! आपका एक भी फोटो या मैसेज डिलीट नहीं होता, सारा डेटा 100% सुरक्षित रहता है।",
      },
      {
        question: "क्या रिपेयर के बाद बटन में पहले जैसी ओरिजिनल 'क्लिक' आवाज आएगी?",
        answer: "हाँ! हम ओरिजिनल मेटल डोम वाले फ्लेक्स लगाते हैं जिससे बिल्कुल नए फोन जैसा क्रिस्प और स्मूथ क्लिक मिलता है।",
      },
    ],
    aliases: ["button-repair", "power-key-repair", "volume-button-fix", "side-flex-repair"],
    relatedSlugs: ["charging-port-repair", "battery-replacement", "software-flashing-unlock"],
    authenticVisual: {
      badgeText: "Tactile Dome Switches",
      caption: "Precision internal side button flex cable installation on Barganda Road",
      image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "mobile-data-recovery",
    title: "Dead Phone Photo, Contact & Storage Data Recovery in Giridih",
    hindiTitle: "डेड फोन फोटो, कॉन्टैक्ट व मेमोरी डाटा रिकवरी",
    shortTagline: "100% Confidential • Zero-Snooping Pledge • Hardware Chip-Off Tech",
    heroSummary:
      "Phone completely smashed, dropped in water, or dead with priceless photos, family videos, and WhatsApp chats inside? Super Telecom Giridih specializes in hardware-level data extraction, temporary board revival, and chip-off memory reads with strict डेटा सुरक्षा प्रोटोकॉल privacy.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "2–6 Hours / Same Day",
    warrantyPeriod: "100% Privacy Guarantee",
    dataSafetyGuarantee: "Hardware Repair — Stored Data Preserved",
    iconName: "HardDrive",
    badge: "100% Confidential",
    metaDescription:
      "Recover photos, contacts, WhatsApp data from dead, water-damaged, broken phones in Giridih at Super Telecom, Barganda Road. 100% private data recovery.",
    keywords: [
      "Dead phone data recovery Giridih",
      "Recover photos from broken phone Barganda Road",
      "Mobile data extraction Giridih",
      "Water damaged phone data recovery Giridih",
    ],
    symptoms: [
      "फोन का पूरी तरह कुचल जाना या दो टुकड़ों में टूट जाना लेकिन अंदर का डेटा जरूरी होना (Physically Smashed Phone)",
      "फोन पानी में गिरकर डेड हो चुका है और चालू नहीं हो रहा (Dead Water Damaged Motherboard)",
      "स्क्रीन पूरी तरह काली है और फोन कंप्यूटर से कनेक्ट नहीं हो रहा (Black Screen No USB Detection)",
      "फोन बार-बार रीस्टार्ट हो रहा है और मेमोरी का बैकअप नहीं बन पा रहा (Memory Access Loop)",
    ],
    customerGuidelines: [
      "डेटा बहुत अनमोल है: सुपर टेलीकॉम पर 'Zero-Snooping Pledge' लागू है; हम आपके निजी फोटो या चैट को कभी नहीं देखते।",
      "डेटा निकालने के बाद हम उसे आपकी पेनड्राइव या नए फोन में पूरी सुरक्षा के साथ ट्रांसफर कर देते हैं।",
      "दुकान आने के बाद डेटा का काम पूरा होते ही हमारे सिस्टम से सभी अस्थायी कैश फाइलें स्थायी रूप से मिटा दी जाती हैं।",
      "यदि मदरबोर्ड की मेमोरी चिप सुरक्षित है तो 90% से अधिक मामलों में 100% डेटा सुरक्षित बाहर निकाल लिया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Power Rail Stabilization & Emergency USB Interface",
        hindiTitle: "इमरजेंसी पाॅवर रेल स्टेबिलाइजेशन",
        description: "शॉर्टेज हटाकर मेमोरी चिप तक 1.8V और 3.3V पाॅवर लाइन की अस्थाई बहाली।",
        duration: "30 Mins",
      },
      {
        stepNumber: "02",
        title: "Block-Level Readout & Database Extraction",
        hindiTitle: "ब्लॉक-लेवल मेमोरी एक्सट्रैक्शन",
        description: "फोटो, वीडियो, कॉन्टैक्ट्स और व्हाट्सएप डेटाबेस की बिट-बाय-बिट क्लोनिंग।",
        duration: "1–3 Hours",
      },
      {
        stepNumber: "03",
        title: "Verification & Encrypted Pendrive Handover",
        hindiTitle: "वेरिफिकेशन व पेनड्राइव हैंडओवर",
        description: "ग्राहक के सामने कुल फाइलों की संख्या का सत्यापन और एन्क्रिप्टेड पेनड्राइव में सुरक्षित सुपुर्दगी।",
        duration: "15 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo Dead Phone Full Data Extraction",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "2–4 Hours",
        warranty: "No Data = No Charge Policy",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung UFS 3.1/4.0 Storage Extraction, OnePlus Dead Recovery",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "3–5 Hours",
        warranty: "No Data = No Charge Policy",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 15 Smashed / Dead Logic Board Data Recovery",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "Same Day / 4–6 Hours",
        warranty: "No Data = No Charge Policy",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "अगर फोन पूरी तरह चालू न हो, तब भी क्या मेरा फोटो और डेटा मिल सकता है?",
        answer: "हाँ! फोन चालू न होने पर भी यदि उसकी स्टोरेज मेमोरी चिप सुरक्षित है, तो हम चिप-लेवल पाॅवर बाईपास तकनीक से आपका पूरा फोटो, वीडियो, कॉन्टैक्ट और व्हाट्सएप डेटा निकाल लेते हैं।",
      },
      {
        question: "क्या मेरी पर्सनल फोटो या डेटा सुरक्षित रहेगा?",
        answer: "शत-प्रतिशत! सुपर टेलीकॉम ग्राहक डेटा सुरक्षा और जीरो-स्नूपिंग प्रोटोकॉल का कड़ाई से पालन करता है। ग्राहक का डेटा सीधे उनकी पेनड्राइव में जाता है और हमारे सिस्टम में कभी स्टोर नहीं किया जाता।",
      },
      {
        question: "अगर डेटा नहीं निकला तो क्या पैसे लगेंगे?",
        answer: "बिल्कुल नहीं! हमारी नीति 'No Data, No Charge' है। यदि हम आपका आवश्यक डेटा निकालने में सफल नहीं होते हैं, तो आपसे कोई शुल्क नहीं लिया जाता।",
      },
      {
        question: "डेटा रिकवर होने के बाद मुझे किस रूप में मिलेगा?",
        answer: "आप अपनी पेनड्राइव या हार्डडिस्क ला सकते हैं, या हम आपके नए स्मार्टफोन में सारा डेटा सीधे ट्रांसफर करके देते हैं।",
      },
    ],
    aliases: ["data-recovery", "dead-phone-data-recovery", "mobile-data-extraction"],
    relatedSlugs: ["motherboard-ic-repair", "water-damage-revival", "software-flashing-unlock"],
    authenticVisual: {
      badgeText: "High-Security Data Lab",
      caption: "Direct eMMC/UFS memory read and emergency data recovery workstation on Barganda Road",
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "phone-hanging-performance-fix",
    title: "Mobile Overheating, Lag & Thermal Optimization in Giridih",
    hindiTitle: "फोन हैंगिंग, ओवरहीटिंग व स्पीड ऑप्टिमाइज़ेशन",
    shortTagline: "Deep Storage Flush • Thermal Paste Reapplication • 30–60 Mins",
    heroSummary:
      "Is your phone lagging, taking seconds to open apps, or burning your hands during charging and gaming? Super Telecom on Barganda Road, Giridih performs hardware thermal paste reapplication, heat dissipation copper cleaning, and deep OS cache optimization.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "30–60 Minutes",
    warrantyPeriod: "60 Days Service Warranty",
    dataSafetyGuarantee: "100% Data Safe — No Reset Required",
    iconName: "Flame",
    badge: "Speed Booster",
    metaDescription:
      "Fix phone lag, overheating, and freezing in Giridih at Super Telecom, Barganda Road. Hardware thermal copper cleaning and deep storage optimization in 45 mins.",
    keywords: [
      "Phone hanging problem repair Giridih",
      "Mobile overheating fix Barganda Road",
      "Speed up slow phone Giridih",
      "Phone thermal paste repair Giridih",
    ],
    symptoms: [
      "ऐप्स खोलते समय फोन का 3-5 सेकंड के लिए फ्रीज हो जाना (App Freeze / UI Stutter)",
      "कॉलिंग या 10 मिनट वीडियो देखने पर ही फोन का आग जैसा गर्म होना (Thermal Overheating)",
      "गेम खेलते समय अचानक फ्रेम ड्रॉप और लैग होना (Severe Thermal Throttling)",
      "मेमोरी में खाली जगह होने पर भी 'Storage Space Low' का गलत एरर आना (Corrupted System Caches)",
    ],
    customerGuidelines: [
      "प्ले स्टोर के फर्जी 'रैम क्लीनर' या 'कूलर ऐप्स' इंस्टॉल न करें; वे खुद भारी विज्ञापन चलाकर फोन को और धीमा करते हैं।",
      "अक्सर फोन के अंदर की पुरानी थर्मल पेस्ट सूख जाने से सीपीयू की गर्मी बाहर नहीं निकल पाती और फोन हैंग होता है।",
      "सुपर टेलीकॉम पर बिना डेटा मिटाए इंटरनल हार्डवेयर कूलिंग और सिस्टम क्लीनअप किया जाता है।",
      "रिपेयर के बाद अंतूतु (AnTuTu) या 3DMark पर तापमान 10°C से 15°C तक कम पाया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Thermal Signature & Storage I/O Benchmark",
        hindiTitle: "थर्मल सिग्नेचर व मेमोरी टेस्ट",
        description: "इन्फ्रारेड गन से सीपीयू टेम्परेचर और स्टोरेज रीड/राइट स्पीड का बेंचमार्क।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "Copper Shield Clean & High-K Thermal Paste",
        hindiTitle: "कॉपर शील्ड व थर्मल पेस्ट सर्विस",
        description: "सूखी हुई पेस्ट हटाकर नई हाई-थर्मल कंडक्टिविटी पेस्ट और ग्रेफाइट शीट लगाना।",
        duration: "25 Mins",
      },
      {
        stepNumber: "03",
        title: "Deep Cache Flush & Background Load Audit",
        hindiTitle: "सिस्टम कैश क्लीनअप व कूलिंग टेस्ट",
        description: "जंक कैशे फाइलों की सफाई और 15 मिनट 60fps वीडियो प्लेबैक पर तापमान ऑडिट।",
        duration: "15 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Redmi, Realme, Poco, Vivo Deep Clean & Thermal Care",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "60 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "OnePlus, Samsung Galaxy S-Series, iQOO Gaming Thermal Optimization",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "35–50 Mins",
        warranty: "60 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 15 Battery Throttling Fix & Thermal Service",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "40–60 Mins",
        warranty: "60 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "क्या फोन की हैंगिंग समस्या बिना डेटा डिलीट किए ठीक हो सकती है?",
        answer: "हाँ, बिल्कुल! हम हार्डवेयर थर्मल सर्विसिंग और सिस्टम कैश क्लीनअप करते हैं जिसमें आपका एक भी फोटो, ऐप या चैट डिलीट नहीं होता।",
      },
      {
        question: "फोन बहुत ज्यादा गर्म क्यों होता है?",
        answer: "2-3 साल पुराने फोन में सीपीयू और कॉपर शील्ड के बीच लगी थर्मल पेस्ट सूख जाती है। नई पेस्ट लगाने और बैटरी हेल्थ सुधारने से ओवरहीटिंग 100% बंद हो जाती है।",
      },
      {
        question: "इस सर्विसिंग में कितना खर्च आता है?",
        answer: "सामान्य फोन क्लीनिंग और थर्मल सर्विस केवल डिवाइस मॉडल और पार्ट्स के अनुसार तय होती है।",
      },
      {
        question: "क्या इसके बाद फोन की बैटरी बैकअप में भी सुधार होगा?",
        answer: "हाँ! जब सीपीयू ठंडा रहेगा तो वह कम बिजली खींचेगा, जिससे बैटरी लाइफ में 20% से 30% तक का सुधार महसूस होता है।",
      },
    ],
    aliases: ["phone-hanging-repair", "lag-fix", "thermal-overheating-fix", "phone-speedup"],
    relatedSlugs: ["battery-replacement", "software-flashing-unlock", "motherboard-ic-repair"],
    authenticVisual: {
      badgeText: "High-Conductivity Thermal Gel",
      caption: "CPU copper heat-pipe cleaning and high-performance thermal pad installation in Giridih",
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    slug: "iphone-back-glass-repair",
    title: "iPhone & Flagship Back Glass Replacement in Giridih",
    hindiTitle: "आईफोन व फ्लैगशिप बैक ग्लास लेजर रिप्लेसमेंट",
    shortTagline: "High-Precision Laser Separation • Zero Frame Scratch • 45–90 Mins",
    heroSummary:
      "Shattered back glass on your iPhone 11, 12, 13, 14, 15, or 16? Super Telecom on Barganda Road, Giridih utilizes high-precision laser separation technology to cleanly disintegrate factory glue without damaging the wireless charging coil or camera rings.",
    priceRangeInr: "Consultation Required",
    startingPrice: 0,
    turnaroundTime: "45–90 Minutes",
    warrantyPeriod: "90 Days Warranty",
    dataSafetyGuarantee: "100% Data Safe — No Internal Disassembly Needed",
    iconName: "Shield",
    badge: "Laser Technology",
    metaDescription:
      "Laser back glass replacement for iPhone 11-16 Pro Max in Giridih at Super Telecom, Barganda Road. No frame scratches, retains wireless charging with warranty.",
    keywords: [
      "iPhone back glass repair Giridih",
      "Laser back glass replacement Barganda Road",
      "Broken phone back cover fix Giridih",
      "Samsung back panel glass Giridih",
    ],
    symptoms: [
      "पीछे का कांच बुरी तरह टूट जाना जिससे हाथ में कांच के कण चुभते हैं (Cracked Rear Glass Shards)",
      "कैमरा रिंग के चारों तरफ का बैक ग्लास उखड़ जाना (Exposed Camera Sub-Frame)",
      "वायरलेस चार्जिंग कॉइल पर दबाव या कांच टूटने से चार्जिंग में रुकावट (Interrupted MagSafe / Qi Charge)",
      "बैक पैनल अलग होने से फोन के अंदर धूल और पानी जाने का खतरा (Compromised Dust / Water Seal)",
    ],
    customerGuidelines: [
      "हाथ से कांच के टुकड़ों को जबरदस्ती न खींचें, इससे नीचे की कॉपर वायरलेस चार्जिंग कॉइल कट सकती है।",
      "टूटे बैक ग्लास पर तुरंत कवर लगा लें ताकि कांच झड़कर बच्चों या हाथ को नुकसान न पहुंचाए।",
      "सुपर टेलीकॉम पर आधुनिक लेजर मशीन से केवल पुराने गोंद को जलाया जाता है जिससे मूल फ्रेम पर एक भी स्क्रैच नहीं आता।",
      "रिपेयर के बाद बिल्कुल नया ओरिजिनल फ्रॉस्टेड मैट फिनिश ग्लास आपके सामने लगाया जाता है।",
    ],
    labSteps: [
      {
        stepNumber: "01",
        title: "Laser Beam Outline Calibration",
        hindiTitle: "कंप्यूटराइज्ड लेजर अलाइनमेंट",
        description: "कैमरा रिंग और वायरलेस कॉइल को छोड़कर सटीक लेजर बीम पाथ की सॉफ्टवेयर मैपिंग।",
        duration: "10 Mins",
      },
      {
        stepNumber: "02",
        title: "Cold Glue Vaporization & Clean Removal",
        hindiTitle: "लेजर गोंद पृथक्करण व सफाई",
        description: "फैक्ट्री एडहेसिव को लेजर से खत्म कर बिना स्क्रैच के टूटे कांच को अलग करना।",
        duration: "30 Mins",
      },
      {
        stepNumber: "03",
        title: "Original Big-Hole Glass Vacuum Bonding",
        hindiTitle: "ओरिजिनल ग्लास फिटिंग व वारंटी",
        description: "ओरिजिनल फ्रॉस्टेड ग्लास की वाटर-टाइट पेस्टिंग और 90 दिन का वारंटी बिल।",
        duration: "20 Mins",
      },
    ],
    brandPricingTable: [
      {
        category: "Android Budget",
        modelsExample: "Realme, Redmi, Poco, OnePlus Nord Glass & Polycarbonate Backs",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "30–45 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Android Flagship & Curved",
        modelsExample: "Samsung S21/S22/S23 Ultra Gorilla Glass Victus Back Covers",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "40–60 Mins",
        warranty: "90 Days Warranty",
      },
      {
        category: "Apple iPhone",
        modelsExample: "iPhone 11 through 16 Pro Max Frosted Matte & Ceramic Glass",
        priceRange: "Consultation Required",
        startingPrice: 0,
        turnaroundTime: "45–90 Mins",
        warranty: "90 Days Warranty",
      },
    ],
    localAreasServed: [...GIRIDIH_AREAS_SERVED],
    faqs: [
      {
        question: "आईफोन का बैक ग्लास बदलने में कितना समय लगता है?",
        answer: "हमारी हाई-प्रिसिजन लेजर मशीन की मदद से अधिकांश आईफोन का बैक ग्लास केवल 45 से 90 मिनट के भीतर बदल दिया जाता है।",
      },
      {
        question: "क्या बैक ग्लास बदलने के लिए पूरा आईफोन खोलना पड़ता है?",
        answer: "नहीं! आधुनिक लेजर तकनीक के कारण फोन के अंदरूनी मदरबोर्ड और बैटरी को खोलने की आवश्यकता नहीं होती, जिससे फोन की ओरिजिनल असेंबली सुरक्षित रहती है।",
      },
      {
        question: "क्या रिपेयर के बाद MagSafe और वायरलेस चार्जिंग काम करेगी?",
        answer: "हाँ! लेजर तकनीक वायरलेस कॉइल को बिल्कुल नहीं छूती। रिपेयर के बाद MagSafe और वायरलेस चार्जिंग 100% सही काम करती है।",
      },
      {
        question: "आईफोन बैक ग्लास रिप्लेसमेंट का क्या खर्च है?",
        answer: "आईफोन 11 से लेकर आईफोन 16 प्रो मैक्स तक का खर्च मॉडल के आधार पर मॉडल अनुसार के बीच आता है।",
      },
    ],
    aliases: ["back-glass-repair", "iphone-glass-back", "rear-glass-repair", "iphone-repair-specialist-giridih"],
    relatedSlugs: ["camera-lens-repair", "screen-display-replacement", "battery-replacement"],
    authenticVisual: {
      badgeText: "Laser Glue Disintegration",
      caption: "Precision laser back glass separation ensuring zero scratches on titanium chassis",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
    },
  },
];

// Helper to look up service by canonical slug or legacy alias
export function getServiceBySlugOrAlias(slug: string): DedicatedServiceData | undefined {
  const normalized = slug.trim().toLowerCase();
  return REPAIR_SERVICES_SILO_DATA.find(
    (s) => s.slug === normalized || s.aliases.includes(normalized)
  );
}
