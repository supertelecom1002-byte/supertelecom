import { defineMcp } from "@lovable.dev/mcp-js";

import listServicesTool from "./tools/list-services";
import getServiceTool from "./tools/get-service";
import listBlogPostsTool from "./tools/list-blog-posts";
import getBlogPostTool from "./tools/get-blog-post";
import getStoreInfoTool from "./tools/get-store-info";

export default defineMcp({
  name: "super-telecom-hub",
  title: "Super Telecom Hub",
  version: "0.1.0",
  instructions:
    "Public tools for Super Telecom, a mobile repair and second-hand smartphone store on Barganda Road, Giridih, Jharkhand, India. Use `list_repair_services` and `get_repair_service` for repair offerings, pricing ranges, turnaround times and FAQs; `list_blog_posts` and `get_blog_post` for local repair guides; and `get_store_info` for address, phone, WhatsApp, hours and directions.",
  tools: [listServicesTool, getServiceTool, listBlogPostsTool, getBlogPostTool, getStoreInfoTool],
});
