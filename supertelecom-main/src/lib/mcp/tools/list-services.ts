import { defineTool } from "@lovable.dev/mcp-js";
import { SERVICES } from "@/data/services";
import { SITE_URL } from "@/data/site";

export default defineTool({
  name: "list_repair_services",
  title: "List repair services",
  description:
    "List every mobile repair service offered by Super Telecom in Giridih, with slug, short summary, price range and typical turnaround time.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const services = SERVICES.map((s) => ({
      slug: s.slug,
      name: s.name,
      summary: s.short,
      priceRange: s.priceRange,
      duration: s.duration,
      url: `${SITE_URL}/services/${s.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
      structuredContent: { services },
    };
  },
});
