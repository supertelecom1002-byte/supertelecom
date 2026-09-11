import { defineTool } from "@lovable.dev/mcp-js";
import { SITE_URL } from "@/data/site";

const STORE = {
  name: "Super Telecom",
  tagline: "Professional Mobile Repair & Second-Hand Smartphone Store in Giridih",
  experienceYears: "10+",
  address: "Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301, India",
  city: "Giridih",
  state: "Jharkhand",
  country: "India",
  phone: "+91 80029 03643",
  whatsapp: "https://wa.me/918002903643",
  email: "supertelecom1002@gmail.com",
  hours: "Monday to Sunday, 9:00 AM - 9:00 PM",
  googleMaps: "https://maps.app.goo.gl/mu5XXCehEpocaZWY9",
  geo: { latitude: 24.1854, longitude: 86.304 },
  rating: "5.0",
  reviewCount: "500+",
  website: SITE_URL,
};

export default defineTool({
  name: "get_store_info",
  title: "Get store info",
  description:
    "Get Super Telecom's public shop details: address in Giridih, phone, WhatsApp, email, opening hours, Google Maps link and rating.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(STORE, null, 2) }],
    structuredContent: { store: STORE },
  }),
});
