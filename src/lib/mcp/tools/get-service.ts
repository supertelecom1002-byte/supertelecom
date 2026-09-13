import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICES } from "@/data/services";
import { SITE_URL } from "@/data/site";

export default defineTool({
  name: "get_repair_service",
  title: "Get repair service details",
  description:
    "Get full details for one Super Telecom repair service: intro, benefits, repair process, supported brands, FAQs, price range and duration.",
  inputSchema: {
    slug: z
      .string()
      .describe("Service slug, e.g. 'screen-replacement'. Use list_repair_services to discover slugs."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const service = SERVICES.find((s) => s.slug === slug.trim().toLowerCase());
    if (!service) {
      throw new ToolError(
        `Unknown service slug "${slug}". Available: ${SERVICES.map((s) => s.slug).join(", ")}`,
      );
    }
    const payload = {
      ...service,
      faqs: service.faqs.map(([question, answer]) => ({ question, answer })),
      url: `${SITE_URL}/services/${service.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { service: payload },
    };
  },
});
