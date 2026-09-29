export interface BrandFault {
  fault: string;
  symptom: string;
  benchProcedure: string;
  turnaround: string;
}

export interface BrandRepair {
  title: string;
  serviceSlug: string;
  turnaround: string;
  priceRange: string;
  summary: string;
}

export interface BrandInfo {
  slug: string;
  name: string;
  shortName: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  tagline: string;
  overview: string[];
  commonFaults: BrandFault[];
  supportedRepairs: BrandRepair[];
  popularModels: string[];
  faqs: [string, string][];
  disclaimer: string;
}

export const BRANDS: BrandInfo[] = [
  {
    slug: "iphone",
    name: "Apple iPhone",
    shortName: "iPhone",
    title: "Apple iPhone Repair in Giridih | Screen, Battery, Motherboard IC | Super Telecom",
    description: "Expert Apple iPhone repair in Giridih. Face ID restoration, battery BMS health transplant, screen replacement, and micro-soldering motherboard repair on Barganda Road.",
    keywords: "iPhone repair Giridih, Apple service Giridih, iPhone screen replacement Giridih, iPhone battery change Giridih, iPhone motherboard repair Giridih, Face ID repair Giridih",
    h1: "Apple iPhone Repair Center in Giridih",
    tagline: "Precision micro-soldering, Face ID recovery, and OEM-grade component replacements for all iPhone generations.",
    overview: [
      "Super Telecom provides dedicated Apple iPhone repair services in Giridih at our Barganda Road workshop. Equipped with stereomicroscopes, programmable thermal platforms, and specialized BMS/TrueTone programmer tools, we handle complex hardware faults that standard repair kiosks decline.",
      "Whether your iPhone has suffered an impact cracking the ceramic shield, exhibits the 'Unknown Part' warning after an improper battery replacement, or reboots continuously with panic logs, our bench technicians systematically isolate faults down to board-level components before quoting a fixed repair price.",
    ],
    commonFaults: [
      {
        fault: "Face ID 'TrueDepth Camera Issue' / Move iPhone Lower",
        symptom: "Face ID fails to configure or alerts that TrueDepth camera is disabled after minor drop or moisture exposure.",
        benchProcedure: "Micro-soldering repair of the dot projector crystal and flood illuminator flex without altering camera serialization, restoring biometric unlock safely.",
        turnaround: "2 – 4 Hours",
      },
      {
        fault: "Unknown Part & Battery Health Service Warning",
        symptom: "Battery percentage displays 'Service' or '-' with 'Important Battery Message' following replacement.",
        benchProcedure: "Original Battery Management System (BMS) board spot-welding transplantation onto a fresh high-capacity cell, followed by cycle counter calibration.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "OLED Green Screen / White Screen of Death (13 & 14 Pro)",
        symptom: "Display panel turns solid glowing green or white with touch still registering underneath.",
        benchProcedure: "Precision micro-jumper bypass line repair across the display flex VDD/VGH power distribution trace under microscope, restoring the original 120Hz ProMotion screen without costly panel replacement.",
        turnaround: "2 – 3 Hours",
      },
      {
        fault: "Panic Full / 3-Minute Timed Restarts",
        symptom: "iPhone shuts down and restarts every 180 seconds; diagnostic logs show 'panic-full' or 'mic1/thermal sensor missing'.",
        benchProcedure: "Tracing I2C bus communications on charging port assembly or power management lines to isolate shorted sensors and replacing faulty flex lines.",
        turnaround: "2 – 5 Hours",
      },
      {
        fault: "Audio Loop & Earpiece Static / Speaker Greyed Out",
        symptom: "Call audio speaker button is disabled/greyed out, voice memos cannot record, or phone takes long to boot.",
        benchProcedure: "Audio IC chip reballing with jumper reinforcement on vulnerable trace pads (M8/C12 lines on older generations) or master audio codec swap.",
        turnaround: "3 – 5 Hours",
      },
    ],
    supportedRepairs: [
      {
        title: "iPhone Display & OLED Replacement",
        serviceSlug: "display-replacement",
        turnaround: "30 – 60 Mins",
        priceRange: "₹3,500 – ₹15,000",
        summary: "Original-spec OLED panels with True Tone transfer and 3D Touch/haptic touch calibration.",
      },
      {
        title: "iPhone Battery BMS Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "45 – 90 Mins",
        priceRange: "₹2,000 – ₹7,500",
        summary: "Zero-cycle high density cells with BMS transplantation to maintain native iOS Battery Health readout.",
      },
      {
        title: "iPhone Motherboard IC & Micro-Soldering",
        serviceSlug: "motherboard-repair",
        turnaround: "2 – 8 Hours",
        priceRange: "₹1,800 – ₹6,500",
        summary: "Dual-layer sandwich motherboard splitting, short circuit elimination, and charging IC (Tristar/Hydra) replacement.",
      },
      {
        title: "iPhone Lightning & USB-C Port Repair",
        serviceSlug: "charging-port-repair",
        turnaround: "45 – 60 Mins",
        priceRange: "₹1,200 – ₹3,500",
        summary: "Fixes loose charging cables, slow charging, microphone cutoff, and liquid contamination.",
      },
      {
        title: "iPhone Water Damage Ultrasonic Recovery",
        serviceSlug: "water-damage-repair",
        turnaround: "Same Day / 24h",
        priceRange: "₹1,500 – ₹5,000",
        summary: "Ultrasonic board wash with specialized solvent, corrosion neutralization, and shorted decoupling capacitor removal.",
      },
      {
        title: "iPhone Back Glass Laser Replacement",
        serviceSlug: "screen-replacement",
        turnaround: "2 – 3 Hours",
        priceRange: "₹1,800 – ₹5,500",
        summary: "Clean removal of shattered rear glass using specialized laser separation, preserving MagSafe coils and wireless charging.",
      },
    ],
    popularModels: [
      "iPhone 16 Pro Max / 16 Pro / 16",
      "iPhone 15 Pro Max / 15 Pro / 15",
      "iPhone 14 Pro Max / 14 Pro / 14 Plus / 14",
      "iPhone 13 Pro Max / 13 Pro / 13 / 13 mini",
      "iPhone 12 Pro Max / 12 Pro / 12 / 12 mini",
      "iPhone 11 Pro Max / 11 Pro / 11",
      "iPhone XS Max / XS / XR / X",
      "iPhone 8 Plus / 8 / SE (2nd & 3rd Gen)",
    ],
    faqs: [
      [
        "Will I lose Face ID after screen replacement at Super Telecom?",
        "No. Our technicians carefully transfer your original Face ID sensor and flood illuminator flex to the replacement display assembly, keeping biometric security fully functional.",
      ],
      [
        "Do you retain True Tone after iPhone display repair?",
        "Yes. We use specialized EEPROM programmers to read the color calibration data from your original screen and write it to the replacement display, preserving Apple True Tone.",
      ],
      [
        "Can you fix an iPhone that won't turn on (dead iPhone)?",
        "Yes. We specialize in chip-level logic board diagnostics. Using a DC power supply and thermal imaging, we locate shorted capacitors, faulty charging ICs, or separated motherboard layers.",
      ],
      [
        "How long does an iPhone battery replacement take?",
        "Standard battery replacements take 45 to 60 minutes. If you require BMS transplant to retain native iOS Battery Health percentage, it takes approximately 75 to 90 minutes.",
      ],
      [
        "Where is your iPhone repair center located in Giridih?",
        "We are located on Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301. Walk-ins are welcome daily from 10:00 AM to 9:30 PM.",
      ],
    ],
    disclaimer: "Super Telecom is an independent third-party mobile repair facility in Giridih and is not affiliated with, authorized, or certified by Apple Inc. All Apple brand names, iPhone models, and trademarks are the property of Apple Inc. and are used solely for descriptive and repair identification purposes.",
  },
  {
    slug: "samsung",
    name: "Samsung Galaxy",
    shortName: "Samsung",
    title: "Samsung Phone Repair in Giridih | Galaxy S, A, M Series | Super Telecom",
    description: "Reliable Samsung Galaxy repair in Giridih. Original Dynamic AMOLED screen replacement, green line fix, battery swap, and motherboard repair on Barganda Road.",
    keywords: "Samsung repair Giridih, Samsung service Giridih, Samsung screen replacement Giridih, Samsung green line fix Giridih, Samsung battery Giridih, Galaxy repair Giridih",
    h1: "Samsung Galaxy Smartphone Repair in Giridih",
    tagline: "Dynamic AMOLED screen replacements, charging moisture resolution, and CPU/UFS reballing for Galaxy S, A, M, and F series.",
    overview: [
      "Super Telecom provides comprehensive Samsung smartphone repair services in Giridih. From high-end Galaxy S Ultra flagships to high-volume Galaxy A, M, and F series devices, our workshop is stocked with precision fixtures and OEM-grade parts.",
      "We routinely address common Samsung-specific challenges such as vertical display lines post-update, 'moisture detected in charging port' false sensor warnings, and bootloops caused by fractured solder joints on dual-layer processors.",
    ],
    commonFaults: [
      {
        fault: "Vertical Green / Pink Line on AMOLED Display",
        symptom: "One or more sharp colored lines run vertically down the screen, typically appearing after system updates or subtle drops.",
        benchProcedure: "Micro-flex inspection or direct authentic Dynamic AMOLED panel assembly replacement with optical fingerprint recalibration.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "'Moisture Detected in USB Port' False Alert",
        symptom: "Phone beeps continuously and refuses to charge even when completely dry; wireless charging may still work.",
        benchProcedure: "Ultrasonic cleaning of the Type-C sub-board, thermistor inspection, or replacement of the sub-charging PCB with authentic temperature sensor.",
        turnaround: "30 – 60 Minutes",
      },
      {
        fault: "Stuck on Samsung Galaxy Boot Logo (Bootloop)",
        symptom: "Device powers on, shows Samsung logo, vibrates, and loops indefinitely (frequent in Galaxy A50/A51/M30/S20 series).",
        benchProcedure: "Exynos or Snapdragon CPU and RAM dual-layer desoldering, reballing with 0.30mm leaded solder balls, and re-mounting under digital microscope.",
        turnaround: "3 – 6 Hours",
      },
      {
        fault: "Galaxy Z Fold / Flip Flexible Screen Center Crease Failure",
        symptom: "Black bleeding bar across the folding hinge, unresponsive touch on one half of inner display, or crunching sound on folding.",
        benchProcedure: "Hinge mechanism debris clearance, UTG (Ultra Thin Glass) inspection, or modular replacement of inner folding assembly.",
        turnaround: "1 – 2 Days",
      },
      {
        fault: "Swollen Battery Pushing Rear Glass Cover Out",
        symptom: "Back cover lifts along edges, gaps visible, battery discharges rapidly from 40% to 0%.",
        benchProcedure: "Safe discharge and extraction of bloated lithium pack, chassis cleaning, and installation of fresh Grade-A battery with factory adhesive seal.",
        turnaround: "30 – 45 Minutes",
      },
    ],
    supportedRepairs: [
      {
        title: "Samsung AMOLED & LCD Screen Replacement",
        serviceSlug: "display-replacement",
        turnaround: "30 – 60 Mins",
        priceRange: "₹1,500 – ₹14,000",
        summary: "Super AMOLED & Dynamic 2X AMOLED displays with in-display fingerprint scanner support.",
      },
      {
        title: "Samsung Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹900 – ₹3,800",
        summary: "High-backup certified batteries restoring full-day active performance with 90-day warranty.",
      },
      {
        title: "Samsung Type-C Sub-Board & Port Repair",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹500 – ₹2,200",
        summary: "Resolves 25W/45W Super Fast Charging handshake drop, microphone static, and false moisture alerts.",
      },
      {
        title: "Samsung Exynos / Snapdragon CPU Reballing",
        serviceSlug: "motherboard-repair",
        turnaround: "3 – 6 Hours",
        priceRange: "₹1,500 – ₹4,500",
        summary: "Permanent board-level fix for logo hang, sudden auto-restart, and camera connection errors.",
      },
      {
        title: "Samsung Outer Touch Glass OCA Lamination",
        serviceSlug: "touch-glass-replacement",
        turnaround: "2 – 3 Hours",
        priceRange: "₹1,200 – ₹4,000",
        summary: "Replaces cracked exterior glass while preserving your original Samsung AMOLED display and colors.",
      },
    ],
    popularModels: [
      "Galaxy S24 Ultra / S24+ / S24",
      "Galaxy S23 Ultra / S23 FE / S23",
      "Galaxy S22 / S21 / S20 series",
      "Galaxy A55 / A54 / A35 / A34 / A25",
      "Galaxy M54 / M34 / M14 / F54",
      "Galaxy Z Fold 5/4/3 & Z Flip 5/4/3",
      "Legacy Galaxy A50 / A51 / Note 20 / Note 10",
    ],
    faqs: [
      [
        "Will in-display fingerprint work after Samsung screen replacement?",
        "Yes. When you choose our OEM-grade AMOLED replacement assemblies, the optical or ultrasonic in-display fingerprint sensor remains fully functional after recalibration.",
      ],
      [
        "How do you fix the 'Moisture Detected' error on Samsung phones?",
        "We inspect the Type-C pins under microscope for electrolytic corrosion. In many cases, ultrasonic cleaning clears it; if the internal thermistor resistor is damaged, we replace the charging sub-board.",
      ],
      [
        "Is it possible to replace only the glass if my Samsung AMOLED still shows display?",
        "Yes! If the internal screen displays clear colors without bleeding lines and touch registers across all corners, our OCA laminating machine can replace just the outer glass, saving up to 50% of screen cost.",
      ],
      [
        "Do you provide warranty on Samsung repairs in Giridih?",
        "Yes, our replacement screens, batteries, and charging ports come with our store warranty, protecting against manufacturing touch defects and premature battery degradation.",
      ],
    ],
    disclaimer: "Super Telecom is an independent third-party mobile service lab in Giridih and is not affiliated with, authorized, or certified by Samsung Electronics Co., Ltd. All Samsung and Galaxy trademarks are properties of Samsung Electronics and are cited solely to identify repair services.",
  },
  {
    slug: "xiaomi-redmi",
    name: "Xiaomi, Redmi & POCO",
    shortName: "Xiaomi",
    title: "Xiaomi Redmi & POCO Repair in Giridih | Camera, CPU, Screen | Super Telecom",
    description: "Expert Xiaomi, Redmi, and POCO repair in Giridih. POCO X3 CPU reballing, front camera fix, PMIC chip replacement, and screen repairs on Barganda Road.",
    keywords: "Xiaomi repair Giridih, Redmi repair Giridih, POCO repair Giridih, POCO X3 CPU reballing Giridih, Redmi screen replacement Giridih, Xiaomi motherboard repair Giridih",
    h1: "Xiaomi, Redmi & POCO Repair Center in Giridih",
    tagline: "Specialist CPU reballing, PMIC power IC micro-soldering, and rapid display repairs for Xiaomi, Redmi, and POCO smartphones.",
    overview: [
      "Super Telecom is recognized across Giridih for advanced chip-level repairs on Xiaomi, Redmi, and POCO smartphones. The widespread issues of cold solder joints on mid-range Snapdragon processors and thermal expansion failures require specialized BGA rework equipment.",
      "Rather than swapping entire expensive motherboards, our Barganda Road technicians desolder, clean, and reball original microprocessors and PMICs, restoring dead devices and camera failures at a fraction of the replacement cost.",
    ],
    commonFaults: [
      {
        fault: "POCO X3 / X2 Front Camera Dead & Audio Failure",
        symptom: "Front camera shows black screen, audio stops working in calls, and device begins randomly freezing or restarting.",
        benchProcedure: "Desoldering Snapdragon 732G CPU, cleaning PCB pads under microscope, applying 0.3mm leaded solder balls, and precisely remounting the SoC on our preheater station.",
        turnaround: "2 – 4 Hours",
      },
      {
        fault: "Redmi Note Dead Phone / PMIC Power IC Short",
        symptom: "Phone does not power on, shows 0.02A – 0.05A draw on USB ammeter, and heating is detected near power section.",
        benchProcedure: "Thermal camera diagnostic to isolate shorted PM6150 / PM7150 power management IC or shorted decoupling capacitor, followed by micro-soldering replacement.",
        turnaround: "2 – 5 Hours",
      },
      {
        fault: "Main to Sub-Board FPC Ribbon Connector Burn",
        symptom: "67W/120W fast charging suddenly stops, phone only charges at 5V 0.5A or charging disconnects on slight wire movement.",
        benchProcedure: "Replacing damaged FPC pin headers or the entire flexible interconnect ribbon connecting the lower charging PCB to the main logic board.",
        turnaround: "45 – 60 Minutes",
      },
      {
        fault: "Continuous MIUI / HyperOS Fastboot Loop",
        symptom: "Phone boots straight into 'FASTBOOT' screen or loops on Xiaomi logo following an overnight automatic software update.",
        benchProcedure: "Board test point (EDL 9008) diagnostic, partition verification, and authorized firmware flashing to restore system boot integrity without data wipe where possible.",
        turnaround: "1 – 2 Hours",
      },
      {
        fault: "Shattered Gorilla Glass with Touch Working",
        symptom: "Spiderweb cracks on front glass, but the underlying 120Hz AMOLED or LCD display shows crisp image without black spots.",
        benchProcedure: "Cryogenic freeze separation or diamond cutting wire delamination, followed by optical clear adhesive (OCA) lamination in our clean chamber.",
        turnaround: "2 – 3 Hours",
      },
    ],
    supportedRepairs: [
      {
        title: "POCO & Redmi CPU Reballing",
        serviceSlug: "ic-chip-level-repair",
        turnaround: "2 – 4 Hours",
        priceRange: "₹1,400 – ₹3,200",
        summary: "Specialized bench rework for POCO X3/X2 camera failures, sound loss, and logo hangs.",
      },
      {
        title: "Redmi & POCO Screen Replacement",
        serviceSlug: "screen-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹900 – ₹5,500",
        summary: "High-refresh-rate 90Hz/120Hz display panels with vibrant contrast and zero touch lag.",
      },
      {
        title: "Xiaomi High-Capacity Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹700 – ₹2,200",
        summary: "5000mAh – 6000mAh certified lithium-polymer cells engineered for heavy usage and gaming.",
      },
      {
        title: "Type-C Charging Sub-Board & Port",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹400 – ₹1,400",
        summary: "Restores Quick Charge, Mi Turbo Charge, and clear lower microphone pickup.",
      },
      {
        title: "Software Recovery & Fastboot Fix",
        serviceSlug: "software-repair",
        turnaround: "45 – 90 Mins",
        priceRange: "₹400 – ₹1,200",
        summary: "Fixes bootloops, system corrupt errors, and official HyperOS partition restorations.",
      },
    ],
    popularModels: [
      "POCO X3 / X3 Pro / X2",
      "POCO X5 Pro / X6 Pro / M6 Pro",
      "Redmi Note 13 / 13 Pro+ / 13 Pro",
      "Redmi Note 12 / 12 Pro / 12 5G",
      "Redmi Note 11 / 11T / 10 / 10 Pro",
      "Redmi 13C / 12 5G / 11 Prime",
      "Xiaomi 14 / 13 Pro / 12 / 11X / 11T Pro",
    ],
    faqs: [
      [
        "Why did my POCO X3 front camera suddenly go black?",
        "This is an acknowledged thermal solder fatigue issue on the Snapdragon 732G CPU. The contact balls connecting the camera data lines to the SoC crack. Reballing the CPU permanently fixes both the front camera and audio issues.",
      ],
      [
        "Will CPU reballing delete my photos and WhatsApp chats?",
        "No. During CPU reballing, the separate UFS memory chip where your photos and files are stored remains untouched. In the vast majority of cases, your data stays completely intact.",
      ],
      [
        "How much does a Redmi Note display replacement cost in Giridih?",
        "LCD displays for standard Redmi devices start from ₹900–₹1,600, while vibrant 120Hz AMOLED screens for Note Pro models range between ₹2,200 and ₹4,500 depending on quality selection.",
      ],
      [
        "Do you support 67W and 120W Mi Turbo Charge after port repair?",
        "Yes. We install OEM-grade sub-boards that contain the required charge negotiation chips and high-gauge copper traces to support full turbo charging wattage.",
      ],
    ],
    disclaimer: "Super Telecom is an independent repair service provider in Giridih and is not affiliated with, authorized, or sponsored by Xiaomi Inc. or POCO. Xiaomi, Redmi, POCO, MIUI, and HyperOS are registered trademarks of Xiaomi Inc. and are used solely for descriptive repair identification.",
  },
  {
    slug: "realme",
    name: "Realme",
    shortName: "Realme",
    title: "Realme Smartphone Repair in Giridih | Display, Battery, Port | Super Telecom",
    description: "Fast, dependable Realme phone repair in Giridih. SuperDart charging fixes, cracked curved AMOLED display replacement, and motherboard repairs at Barganda Road.",
    keywords: "Realme repair Giridih, Realme service Giridih, Realme screen replacement Giridih, Realme charging port Giridih, Realme battery Giridih, Narzo repair Giridih",
    h1: "Realme Smartphone Repair Center in Giridih",
    tagline: "SuperDart charging restorations, curved glass OCA laminations, and logic board repairs for Realme Number, Pro, and Narzo series.",
    overview: [
      "Realme smartphones are among the most popular daily drivers across Giridih, known for high wattage charging and vivid displays. Super Telecom maintains a dedicated inventory of replacement parts for Realme Number series, Pro Plus editions, Narzo, and C-series models.",
      "From broken curved display glasses to SuperDart charging handshake failures caused by moisture or cable wear, our workshop provides rapid turnaround times with guaranteed diagnostic transparency.",
    ],
    commonFaults: [
      {
        fault: "Dart / SuperDart Fast Charging Not Triggering",
        symptom: "Phone charges at standard slow speed and does not show yellow/blue SuperDart charging animation on plug-in.",
        benchProcedure: "Replacing damaged CC1/CC2 detection pins in Type-C connector or replacing the charging IC logic module.",
        turnaround: "30 – 60 Minutes",
      },
      {
        fault: "Stuck on 'Realme - Powered by Android' Bootloop",
        symptom: "Device continuously restarts or hangs on yellow logo; often triggered by sudden storage exhaustion or failed updates.",
        benchProcedure: "Power rail voltage test, recovery partition check, or MediaTek Dimensity/Snapdragon CPU cold-joint reballing.",
        turnaround: "2 – 4 Hours",
      },
      {
        fault: "Curved AMOLED Screen Edge Cracked",
        symptom: "Glass cracked along curved side borders on Pro+ models, but touch functions and display colors are intact.",
        benchProcedure: "Curved OCA hot-pressing and bubble-removal autoclave procedure to install fresh curved scratch-resistant glass.",
        turnaround: "2 – 3 Hours",
      },
      {
        fault: "Earpiece Speaker Extremely Faint During Voice Calls",
        symptom: "Caller's voice is barely audible in public settings despite volume set to 100%.",
        benchProcedure: "Ultrasonic cleaning of the micro-acoustic dust grill and replacement of earpiece speaker capsule if membrane is punctured.",
        turnaround: "30 – 45 Minutes",
      },
      {
        fault: "Cracked Rear Camera Protective Ring Glass",
        symptom: "Photos appear blurry or show glare streaks from external cracks without damaging the internal camera sensor.",
        benchProcedure: "Precise thermal removal of cracked outer lens crystal and UV-cured optical grade lens replacement.",
        turnaround: "20 – 30 Minutes",
      },
    ],
    supportedRepairs: [
      {
        title: "Realme Screen & AMOLED Replacement",
        serviceSlug: "display-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹1,000 – ₹6,500",
        summary: "Precision replacement panels matching original brightness, refresh rates, and palm-rejection borders.",
      },
      {
        title: "Realme SuperDart Charging Port Sub-Board",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹400 – ₹1,500",
        summary: "Original sub-board assemblies supporting 33W, 67W, and 80W charging protocols.",
      },
      {
        title: "Realme Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹700 – ₹2,400",
        summary: "Fresh high-density lithium polymer battery cells with safe charging controllers and warranty.",
      },
      {
        title: "Realme Motherboard & Power IC Repair",
        serviceSlug: "motherboard-repair",
        turnaround: "2 – 5 Hours",
        priceRange: "₹1,200 – ₹3,800",
        summary: "Board-level micro-soldering for short-circuited capacitors, dead phones, and charging circuits.",
      },
      {
        title: "Realme Outer Glass OCA Lamination",
        serviceSlug: "touch-glass-replacement",
        turnaround: "2 – 3 Hours",
        priceRange: "₹1,000 – ₹3,500",
        summary: "Replaces cracked exterior glass while keeping your original Realme panel.",
      },
    ],
    popularModels: [
      "Realme 12 Pro+ / 12 Pro / 12 5G",
      "Realme 11 Pro+ / 11 Pro / 11",
      "Realme 10 Pro+ / 10 Pro / 10",
      "Realme 9 Pro+ / 9 / 8 Pro / 8",
      "Realme Narzo 70 Pro / Narzo 60 / 50",
      "Realme C67 / C55 / C53 / C35",
      "Realme GT 6 / GT 2 Pro / GT Neo series",
    ],
    faqs: [
      [
        "How quickly can I get my Realme screen replaced in Giridih?",
        "Standard flat screens are replaced in 30 to 45 minutes on our bench. Curved AMOLED glass repairs take approximately 2 to 3 hours.",
      ],
      [
        "Will my SuperDart fast charging work after replacing the charging port?",
        "Yes. We use authentic sub-board assemblies that contain the proprietary charge-negotiation ICs required to activate Realme's SuperDart charging.",
      ],
      [
        "Do you repair water-damaged Realme phones?",
        "Yes. Bring the phone in as quickly as possible without plugging it into a charger. We perform ultrasonic corrosion clearing and board drying immediately.",
      ],
      [
        "What warranty do you offer on Realme repairs?",
        "We offer comprehensive warranty coverage on display replacements and battery installations against manufacturing defects.",
      ],
    ],
    disclaimer: "Super Telecom is an independent mobile service provider in Giridih and is not affiliated with, authorized, or certified by Realme or its parent entities. Realme, Narzo, and associated model names are trademarks of their respective owners and used only for service identification.",
  },
  {
    slug: "vivo",
    name: "Vivo",
    shortName: "Vivo",
    title: "Vivo Phone Repair in Giridih | V-Series, Y-Series, X-Series | Super Telecom",
    description: "Professional Vivo phone repair in Giridih. Curved V-series AMOLED replacement, camera lens repair, battery fix, and motherboard servicing on Barganda Road.",
    keywords: "Vivo repair Giridih, Vivo service Giridih, Vivo screen replacement Giridih, Vivo V series repair Giridih, Vivo battery replacement Giridih, Vivo camera repair Giridih",
    h1: "Vivo Smartphone Repair Center in Giridih",
    tagline: "Curved AMOLED display lamination, FlashCharge restoration, and Zeiss/Aura Light camera servicing for Vivo smartphones.",
    overview: [
      "Vivo's V-series and Y-series enjoy massive popularity across Giridih for their sleek designs and camera capabilities. However, slim profiles make them susceptible to frame bends, cracked curved screens, and charging sub-board flex tears.",
      "Super Telecom provides expert servicing for Vivo smartphones using specialized curved alignment molds, factory-grade OCA laminators, and precise micro-soldering stations at our Barganda Road shop.",
    ],
    commonFaults: [
      {
        fault: "V-Series Curved AMOLED Edge Crack & Ghost Touch",
        symptom: "Screen cracked near curved edge; erratic touches occur or lower screen portion becomes unresponsive.",
        benchProcedure: "Full frame-matched curved AMOLED assembly replacement or high-vacuum OCA glass replacement preserving the authentic panel.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "Vivo FlashCharge 44W/80W Handshake Failure",
        symptom: "Phone charges slowly with basic charging icon; does not activate high-voltage FlashCharge protocol.",
        benchProcedure: "Replacing damaged Type-C sub-board and testing the charging gate MOSFET circuit on the mainboard.",
        turnaround: "30 – 60 Minutes",
      },
      {
        fault: "Aura Light / Rear Camera Module Shaking & Focus Jam",
        symptom: "Camera buzzes mechanically when opened, photos are completely blurry, or optical image stabilization (OIS) vibrates.",
        benchProcedure: "Restoring broken OIS electromagnetic suspension springs or replacing the primary camera sensor module.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "No SIM Card / Emergency Calls Only After Drop",
        symptom: "SIM is detected but no signal bars appear; baseband unknown in settings menu.",
        benchProcedure: "RF antenna coaxial connector re-anchoring or reballing the WTR radio frequency transceiver IC.",
        turnaround: "2 – 5 Hours",
      },
      {
        fault: "Battery Draining from 30% Rapidly to Zero",
        symptom: "Device powers off unexpectedly during calls or camera usage even with 25-30% battery indicated.",
        benchProcedure: "Installing fresh grade-A lithium-ion battery with calibrated fuel-gauge controller.",
        turnaround: "30 – 45 Minutes",
      },
    ],
    supportedRepairs: [
      {
        title: "Vivo V-Series Curved & Flat Display Replacement",
        serviceSlug: "display-replacement",
        turnaround: "30 – 60 Mins",
        priceRange: "₹1,000 – ₹7,000",
        summary: "Precision AMOLED & IPS screens with vivid color rendering and flawless in-display fingerprint responsiveness.",
      },
      {
        title: "Vivo Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹700 – ₹2,500",
        summary: "Long-lasting battery packs with genuine safety protections against swelling and overheating.",
      },
      {
        title: "Vivo FlashCharge Type-C Port Repair",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹400 – ₹1,500",
        summary: "Restores ultra-fast charging speeds, computer USB connection, and microphone functionality.",
      },
      {
        title: "Vivo Camera Module & Lens Replacement",
        serviceSlug: "camera-repair",
        turnaround: "45 – 90 Mins",
        priceRange: "₹800 – ₹3,500",
        summary: "Fixes scratched lens glass, vibrating OIS motors, and foggy camera sensors.",
      },
      {
        title: "Vivo Motherboard & Power IC Diagnostics",
        serviceSlug: "motherboard-repair",
        turnaround: "2 – 6 Hours",
        priceRange: "₹1,200 – ₹3,800",
        summary: "Board-level micro-soldering fixing dead handsets, water shorts, and network failures.",
      },
    ],
    popularModels: [
      "Vivo V30 Pro / V30 / V30e",
      "Vivo V29 / V29e / V29 Pro",
      "Vivo V27 / V27 Pro / V25",
      "Vivo T3 5G / T3x / T2 Pro / T2 5G",
      "Vivo Y200 / Y100 / Y56 / Y28",
      "Vivo X100 / X90 / X80 Pro series",
    ],
    faqs: [
      [
        "Can you repair curved screens on Vivo V27 and V29 phones?",
        "Yes, we specialize in curved AMOLED repairs. Whether you need an OEM display replacement or outer glass OCA lamination, we have curved vacuum laminating molds in-store.",
      ],
      [
        "Will the in-display fingerprint sensor work after screen repair?",
        "Yes. We use premium display assemblies engineered with transparent optical windows that support factory fingerprint sensor calibration.",
      ],
      [
        "How much does a Vivo charging port repair cost in Giridih?",
        "Standard sub-board port repairs start from ₹400 for Y-series and range between ₹700 to ₹1,500 for high-wattage FlashCharge V-series boards.",
      ],
      [
        "Where is your Vivo repair shop located in Giridih?",
        "We are located on Barganda Road, Near Shivam Clinic, Giridih. You can walk in directly or contact us via WhatsApp for an advance quote.",
      ],
    ],
    disclaimer: "Super Telecom is an independent mobile repair center in Giridih and is not affiliated with, authorized, or certified by Vivo Communication Technology Co. Ltd. Vivo and its model designations are trademarks of their respective owners and used only for repair identification purposes.",
  },
  {
    slug: "oppo",
    name: "OPPO",
    shortName: "OPPO",
    title: "OPPO Phone Repair in Giridih | Reno Series, A-Series, F-Series | Super Telecom",
    description: "Reliable OPPO smartphone repair in Giridih. Reno AMOLED screen replacement, SuperVOOC fast charging repair, battery swap, and motherboard repairs at Barganda Road.",
    keywords: "OPPO repair Giridih, OPPO service Giridih, OPPO screen replacement Giridih, OPPO Reno repair Giridih, OPPO battery Giridih, OPPO charging port Giridih",
    h1: "OPPO Smartphone Repair Center in Giridih",
    tagline: "SuperVOOC high-current charging fixes, Reno AMOLED replacements, and board-level repairs for all OPPO smartphones.",
    overview: [
      "Super Telecom provides full-service hardware and software solutions for OPPO smartphones in Giridih. Whether you own an advanced Reno series handset with specialized portrait lenses or an A-series daily workhorse, our workshop offers rapid diagnostic and repair turnaround.",
      "We keep high-demand parts in stock, including SuperVOOC charging sub-boards, OEM-spec AMOLED and IPS screens, and camera glass replacements.",
    ],
    commonFaults: [
      {
        fault: "SuperVOOC High-Current Charging Failure",
        symptom: "Phone charges at basic 5V 1A rate and disconnects intermittently when moving the cable.",
        benchProcedure: "Replacing oxidized Type-C charging port pins or the entire charging daughterboard with VOOC protocol controllers.",
        turnaround: "30 – 60 Minutes",
      },
      {
        fault: "Reno Series AMOLED Display Flickering or Black Screen",
        symptom: "Screen flashes bright green, flickers at lower brightness levels, or remains black with phone vibrating.",
        benchProcedure: "Display flex bonding inspection or installation of fresh high-contrast AMOLED screen assembly.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "Microphone Static & Calling Echo",
        symptom: "Callers complain of hearing their own voice echoed or cannot hear you unless speakerphone is toggled.",
        benchProcedure: "Cleaning acoustic sound channels and replacing the secondary noise-cancelling microphone flex.",
        turnaround: "30 – 45 Minutes",
      },
      {
        fault: "Power Button & Volume Key Unresponsive",
        symptom: "Buttons click mechanically but do not wake up screen or adjust sound volume.",
        benchProcedure: "Replacing torn micro-switch button ribbon cable behind the chassis mid-frame.",
        turnaround: "30 – 45 Minutes",
      },
      {
        fault: "Pattern / Password Lock After Forgotten PIN",
        symptom: "Phone is locked after PIN is forgotten; attempts exceed allowed thresholds.",
        benchProcedure: "Authorized software servicing with ownership verification to restore factory operating system.",
        turnaround: "45 – 90 Minutes",
      },
    ],
    supportedRepairs: [
      {
        title: "OPPO Reno & A-Series Display Replacement",
        serviceSlug: "display-replacement",
        turnaround: "30 – 60 Mins",
        priceRange: "₹1,000 – ₹7,000",
        summary: "Crystal-clear display panels with true colors, responsive touch digitizers, and fingerprint scanner compatibility.",
      },
      {
        title: "OPPO SuperVOOC Charging Port Sub-Board",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹400 – ₹1,600",
        summary: "OEM sub-boards with heavy copper trace lines to sustain 33W, 67W, and 80W charging safely.",
      },
      {
        title: "OPPO Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹700 – ₹2,600",
        summary: "Brand-tested lithium cells restoring all-day standby and talk-time performance.",
      },
      {
        title: "OPPO Motherboard & Power IC Repair",
        serviceSlug: "motherboard-repair",
        turnaround: "2 – 6 Hours",
        priceRange: "₹1,200 – ₹3,800",
        summary: "Micro-soldering repair for water ingress, shorted circuits, and dead phone recovery.",
      },
      {
        title: "OPPO Camera Lens & Module Repair",
        serviceSlug: "camera-repair",
        turnaround: "30 – 60 Mins",
        priceRange: "₹600 – ₹3,200",
        summary: "Replacing broken camera glass covers and malfunctioning camera sensor assemblies.",
      },
    ],
    popularModels: [
      "OPPO Reno 11 Pro / Reno 11 / 11F",
      "OPPO Reno 10 Pro+ / Reno 10 / 8 Pro",
      "OPPO F25 Pro / F23 / F21s Pro / F21 Pro",
      "OPPO A79 5G / A78 / A59 / A58 / A38",
      "OPPO Find N3 Flip / Find X series",
    ],
    faqs: [
      [
        "How long does an OPPO display replacement take at Super Telecom?",
        "Most standard OPPO screen replacements take between 30 and 60 minutes. You can wait in our shop or pick it up the same day.",
      ],
      [
        "Will my OPPO phone still support SuperVOOC charging after port repair?",
        "Yes. We install quality sub-boards containing the genuine charging negotiation circuitry required to trigger SuperVOOC high-amperage charging.",
      ],
      [
        "What should I do if my OPPO phone falls into water?",
        "Power off the phone immediately and do not plug in the charger. Bring it to Super Telecom on Barganda Road for emergency ultrasonic drying to prevent corrosion.",
      ],
      [
        "Do you provide quotes before repairing my OPPO phone?",
        "Yes! Diagnosis is completely free. We inspect your phone and give you an exact, transparent price quote before starting any work.",
      ],
    ],
    disclaimer: "Super Telecom is an independent repair workshop in Giridih and is not affiliated with, authorized, or certified by Guangdong OPPO Mobile Telecommunications Corp., Ltd. OPPO, Reno, SuperVOOC, and related marks are trademarks of their respective owners.",
  },
  {
    slug: "oneplus",
    name: "OnePlus",
    shortName: "OnePlus",
    title: "OnePlus Phone Repair in Giridih | Screen, Motherboard, Battery | Super Telecom",
    description: "Expert OnePlus repair in Giridih. Green line screen replacement, OnePlus 9/10 dead motherboard repair, battery swap, and Warp charging fixes on Barganda Road.",
    keywords: "OnePlus repair Giridih, OnePlus service Giridih, OnePlus green line fix Giridih, OnePlus screen replacement Giridih, OnePlus motherboard repair Giridih, OnePlus battery Giridih",
    h1: "OnePlus Smartphone Repair Center in Giridih",
    tagline: "Specialist OLED green line resolutions, dual-layer motherboard micro-soldering, and Warp/SUPERVOOC charging repairs.",
    overview: [
      "OnePlus smartphones are acclaimed for flagship performance, but common issues like vertical green lines post-OxygenOS updates and sudden motherboard deaths on Snapdragon 888/8 Gen 1 devices require top-tier repair expertise.",
      "At Super Telecom, Barganda Road, Giridih, our workshop is outfitted with advanced microscope stations, CNC board preheaters, and BGA reballing kits specifically tailored for the demanding dual-layer motherboards found in OnePlus handsets.",
    ],
    commonFaults: [
      {
        fault: "OxygenOS Update Green / Pink Vertical Line on Display",
        symptom: "A thin, neon green or pink vertical laser line suddenly appears down the center or edge of the Fluid AMOLED screen.",
        benchProcedure: "High-grade 120Hz Fluid AMOLED screen replacement with optical in-display fingerprint calibration and color profile matching.",
        turnaround: "45 – 90 Minutes",
      },
      {
        fault: "OnePlus 9 / 10 / 11 Series Sudden Motherboard Dead State",
        symptom: "Phone suddenly powers off during normal use or gaming, refuses to charge, and shows 0.00A on power meter.",
        benchProcedure: "Separation of sandwich motherboard layers, desoldering and reballing Snapdragon CPU and UFS 3.1 memory, and reconnecting interposer lines.",
        turnaround: "3 – 6 Hours",
      },
      {
        fault: "Warp Charge 65 / SUPERVOOC 80W-100W Charging Cutoff",
        symptom: "Charging connects and disconnects repeatedly every 2 seconds, or charges at basic slow speeds.",
        benchProcedure: "Dual-cell battery protection board inspection and replacement of the high-amperage Type-C charging daughterboard.",
        turnaround: "30 – 60 Minutes",
      },
      {
        fault: "Alert Slider Jammed or Sticky",
        symptom: "Three-stage alert slider does not click into Silent, Vibrate, or Ring mode, or moves without triggering sound profile change.",
        benchProcedure: "Disassembly and micro-solvent cleaning of the mechanical slider cavity and tactile electronic switch replacement.",
        turnaround: "30 – 45 Minutes",
      },
      {
        fault: "OnePlus Camera App Crashes / Black Screen",
        symptom: "Opening camera app crashes back to home screen or shows black viewfinder, while flashlight option is disabled.",
        benchProcedure: "Camera sensor power rail voltage test, PMIC LDO filter repair, or optical sensor module replacement.",
        turnaround: "1 – 3 Hours",
      },
    ],
    supportedRepairs: [
      {
        title: "OnePlus Fluid AMOLED Display Replacement",
        serviceSlug: "display-replacement",
        turnaround: "45 – 90 Mins",
        priceRange: "₹2,500 – ₹11,000",
        summary: "120Hz high-refresh rate Fluid AMOLED panels restoring smooth scrolling and factory color accuracy.",
      },
      {
        title: "OnePlus Motherboard & CPU Reballing",
        serviceSlug: "motherboard-repair",
        turnaround: "3 – 6 Hours",
        priceRange: "₹1,800 – ₹5,500",
        summary: "Precision board-level sandwich micro-soldering for OnePlus 9/10/11 series dead phone recovery.",
      },
      {
        title: "OnePlus Warp & SUPERVOOC Charging Port",
        serviceSlug: "charging-port-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹700 – ₹2,500",
        summary: "High-spec daughterboards sustaining rapid 65W, 80W, and 100W charging currents without overheating.",
      },
      {
        title: "OnePlus Battery Replacement",
        serviceSlug: "battery-replacement",
        turnaround: "30 – 45 Mins",
        priceRange: "₹1,200 – ₹3,800",
        summary: "Dual-cell battery replacements with high cycle endurance and integrated temperature monitoring.",
      },
      {
        title: "OnePlus Alert Slider & Button Servicing",
        serviceSlug: "button-repair",
        turnaround: "30 – 45 Mins",
        priceRange: "₹500 – ₹1,500",
        summary: "Restores smooth physical tactile clicks for the signature OnePlus 3-stage alert slider.",
      },
    ],
    popularModels: [
      "OnePlus 12 / 12R",
      "OnePlus 11 / 11R",
      "OnePlus 10 Pro / 10T / 10R",
      "OnePlus 9 Pro / 9 / 9R / 9RT",
      "OnePlus 8 Pro / 8T / 8 / 7T Pro / 7",
      "OnePlus Nord 4 / 3 / 2T / CE 4 / CE 3 / CE 2 Lite",
    ],
    faqs: [
      [
        "How do you fix the OnePlus green line issue in Giridih?",
        "The green line occurs when internal display flex traces degrade from heat or voltage spikes. We replace the display with an authentic 120Hz Fluid AMOLED screen assembly, calibrating the in-display fingerprint scanner so everything functions flawlessly.",
      ],
      [
        "Can a dead OnePlus 9 Pro or 10 Pro motherboard be saved?",
        "Yes! Many local shops declare dead OnePlus 9/10 phones as 'unfixable', but in 85%+ of cases the issue is dry solder joints underneath the Snapdragon CPU. Our chip-level reballing process successfully revives the device without needing a motherboard swap.",
      ],
      [
        "Will Warp Charge / SUPERVOOC still work after battery and port replacement?",
        "Yes. We strictly source dual-cell compatible battery units and authentic daughterboards equipped with the high-current shunt resistors needed to enable Warp Charge and SUPERVOOC.",
      ],
      [
        "Where is Super Telecom in Giridih?",
        "We are located on Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301. We are open daily from 10:00 AM to 9:30 PM.",
      ],
    ],
    disclaimer: "Super Telecom is an independent mobile repair center in Giridih and is not affiliated with, authorized, or certified by OnePlus Technology (Shenzhen) Co., Ltd. OnePlus, Nord, OxygenOS, Warp Charge, and related trademarks are properties of OnePlus Technology and used solely to identify repair services.",
  },
];
