import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_yOgUXNQL8c2s@ep-tiny-feather-a1m4nqs0-pooler.ap-southeast-1.aws.neon.tech/ai-interview?sslmode=require&channel_binding=require",
  },
});
