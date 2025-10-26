 import sitemap from '@astrojs/sitemap';
 import robotsTxt from '@astrojs/robots-txt';
@@
 export default defineConfig({
   site: 'https://www.techhilfepro.de',
   vite: { plugins: [tailwindcss()] },
-  integrations: [icon(), react(), sitemap(), robotsTxt(), image({ serviceEntryPoint: '@astrojs/image/sharp' })]
+  integrations: [
+    icon(),
+    react(),
+    sitemap(),
+    robotsTxt({
+      policy: [{ userAgent: '*', allow: '/' }],
+      sitemap: true
+    }),
+    image({ serviceEntryPoint: '@astrojs/image/sharp' })
+  ]
 });
