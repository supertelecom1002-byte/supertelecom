import { defineTool } from "@lovable.dev/mcp-js";
import { POSTS } from "@/data/blog";
import { SITE_URL } from "@/data/site";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List Super Telecom blog articles about mobile repair in Giridih, with slug, title, date and excerpt.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const posts = POSTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      url: `${SITE_URL}/blog/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(posts, null, 2) }],
      structuredContent: { posts },
    };
  },
});
