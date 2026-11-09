# WhereIsIt (read-only)

Public, read-only catalog of data DVDs: find which disc holds a file without inserting any disc.
Deployed on Vercel from `main`. The data is added with the local read-write app (`rw_WhereIsIt`)
and copied to MongoDB Atlas with Compass.

## Pages

| Route | What it does |
|---|---|
| `/search` | File name search, `*` as wildcard, case-insensitive (`*Tesla*`) |
| `/browse` | Five DVDs around a number (`222`), arrows move by 5 |
| `/oneDvd?name=DVD-222` | Full tree of one DVD |
| `/allComments` | DVDs that have a comment |
| `/statistics` | Total number and size of files |

## Run locally

```bash
npm install
npm run dev        # uses MONGODB_URI from .env.local
```

`MONGODB_URI` is required (`.env.local` locally, Vercel environment variables in production).
`SITE_URL` (optional, Vercel) sets the domain in the generated sitemap.

Data model: one document per DVD in `whereisit.dvds`: `{ name: "DVD-222", contents: DirectoryItem[], date, comment }`.
