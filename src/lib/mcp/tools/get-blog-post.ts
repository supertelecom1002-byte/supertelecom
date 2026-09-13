import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";

function toPlainText(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description: "Get the full text of one Super Telecom blog article by its slug.",
  inputSchema: {
    slug: z.string().describe("Blog post slug. Use list_blog_posts to discover slugs."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = POSTS.find((p) => p.slug === slug.trim().toLowerCase());
    if (!post) {
      throw new ToolError(
        `Unknown blog slug "${slug}". Available: ${POSTS.map((p) => p.slug).join(", ")}`,
      );
    }
    const payload = {
      slug: post.slug,
      title: post.title,
      date: post.date,
      description: post.description,
      body: toPlainText(post.html),
      url: `${SITE_URL}/blog/${post.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { post: payload },
    };
  },
});
