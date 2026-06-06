import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer, type InlineConfig } from "vite";
import viteConfig from "../../vite.config";

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bravocareercenter.com/</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://bravocareercenter.com/#services</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bravocareercenter.com/#about</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://bravocareercenter.com/#contact</loc>
    <lastmod>2026-06-06</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  // Create a custom Vite config
  const customConfig: InlineConfig = {
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  };

  const vite = await createViteServer(customConfig);

  // Add sitemap middleware BEFORE vite.middlewares
  app.use((req, res, next) => {
    if (req.path === "/sitemap.xml") {
      res.type("application/xml");
      res.send(SITEMAP_XML);
      return;
    }
    next();
  });

  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Add sitemap middleware BEFORE static files
  app.use((req, res, next) => {
    if (req.path === "/sitemap.xml") {
      res.type("application/xml");
      res.send(SITEMAP_XML);
      return;
    }
    next();
  });

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
