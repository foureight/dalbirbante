# Dal Birbante – nový web

Moderní web pizzerie **Dal Birbante** (Praha 9 – Vinoř) s texty a fotkami z původního webu a mapou z Reservo.

## Spuštění

```bash
npm install
npm run dev -- --port 43123
```

Otevřete [http://127.0.0.1:43123](http://127.0.0.1:43123).

## Administrace textů

- Adresa: [/admin](http://127.0.0.1:43123/admin)
- Výchozí heslo: `dalbirbante`

Heslo a tajný klíč session můžete změnit přes prostředí:

```bash
ADMIN_PASSWORD=vasheheslo
ADMIN_SECRET=nahodny-dlouhy-retezec
```

V administraci lze upravit prakticky všechny texty webu (úvod, menu, o nás, kontakt, rozvoz, patička) a uložit je do `data/content.json`.

## Co je na webu

- Typografie **Omnes** (Regular / Semibold / Black) – stejné fonty jako na původním webu
- Úvodní stránka s hero, nabídkou, galerií a CTA
- Kompletní menu (pizza, pasta, panozzo, nápoje, sýry)
- Stránka O nás
- Kontakt + mapa z Reservo (`system/map.php`) + rozvozové zóny
- Odkaz na online objednávku Reservo Eats

## Data a SEO JSON

- Texty webu: `data/content.json` (editovatelné v `/admin`)
- Schema.org data z původního webu: `data/schema.json`
  - `Restaurant`, `WebSite`, page schemas (`WebPage`, `AboutPage`, `ContactPage`)
  - FAQ schema se skládá z FAQ v `content.json`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

## Kontaktní formulář (SMTP)

Formulář odesílá e-maily přes SMTP. Do `.env.local` doplňte:

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=vas@email.cz
SMTP_PASS=heslo
CONTACT_TO=mangio@dalbirbante.cz
CONTACT_FROM=web@dalbirbante.cz
```

Bez těchto hodnot formulář vrátí chybu o chybějícím SMTP (web dál běží).

## Poznámka k ukládání

Ukládání obsahu zapisuje do souboru `data/content.json`. Funguje lokálně a na běžném Node serveru (`npm start`). Na serverless hostingu (např. Vercel) souborový zápis nepřetrvává — tam je potřeba napojit databázi nebo headless CMS.
