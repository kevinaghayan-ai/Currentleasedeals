# CurrentLeaseDeals.com (Next.js + Tailwind, no-terminal starter)

This project is preconfigured so you can deploy **without using the terminal**.

## 1) Put it on GitHub (no terminal)
- Go to https://github.com → New → **Create a new repository** (public or private).
- Name it `currentleasedeals`.
- Click **Create repository**.
- Click **Add file → Upload files**.
- Drag & drop the **entire folder contents** of this ZIP (or upload the ZIP and let GitHub extract is not possible; you must upload files/folders).
- **Commit** the changes.

> Tip: You can also click "Add file → Create new file" and then drag the **folder** onto the browser to upload all files at once.

## 2) Deploy with Vercel (no terminal)
- Go to https://vercel.com → **New Project** → **Import Git Repository** → pick your repo.
- Accept defaults and click **Deploy**.
- After the build, you’ll get a live URL like `https://currentleasedeals.vercel.app`.

## 3) Connect your GoDaddy domain
- In Vercel → Project → **Settings → Domains** → **Add** `currentleasedeals.com`.
- In GoDaddy → DNS for `currentleasedeals.com`:
  - **A** record: Host `@` → Value `76.76.21.21`
  - **CNAME**: Host `www` → Value `cname.vercel-dns.com`
- Save. Wait a few minutes; SSL will be automatic.

## Editing content
- Edit `src/app/page.tsx` to change UI text and mock data.
- Commit to GitHub → Vercel redeploys automatically.
