# Hananel Dashboard — CLAUDE.md

## Overview
Client-facing dashboard for managing two businesses:
- **קליניקת אסתטיקה** — Aesthetic clinic
- **מרפאת שיניים** — Dental clinic

**Tech stack:** Vite 6 + React 18 + TypeScript + Refine 4 + Ant Design 5 + Supabase

## Commands
```bash
npm run dev    # Start dev server (localhost:5173)
npm run build  # Production build → dist/
npm run lint   # ESLint
```

## Auth
Simple auth — single shared password. No user table.
- Username: `admin`
- Password: set in `.env` as `VITE_DASHBOARD_PASSWORD` (default: `hananel2024`)
- Session stored in `localStorage` key `hananel_auth`
- To change password: update `.env`

## Environment Variables
```
VITE_SUPABASE_URL=https://pzkgvkzztrpzdpyhkggt.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_DASHBOARD_PASSWORD=hananel2024
```

## Project Structure
```
src/
├── App.tsx                     # Refine + routes + resources config
├── main.tsx                    # Entry point
├── supabaseClient.ts           # Supabase client
├── authProvider.ts             # Simple localStorage auth
├── theme.ts                    # Ant Design theme (purple/elegant)
├── index.css                   # RTL global styles, Heebo font
├── interfaces/
│   └── index.ts                # TypeScript interfaces for all tables
├── utils/
│   └── formatters.ts           # Hebrew date/price/unit formatters
└── pages/
    ├── login/                  # Login page
    ├── aesthetic/
    │   ├── media/              # list, create, edit
    │   ├── products/           # list, create, edit
    │   ├── followup/           # list, create, edit
    │   └── clients/            # list, create, edit
    └── dental/
        ├── media/              # list, create, edit
        ├── products/           # list, create, edit
        ├── followup/           # list, create, edit
        ├── clients/            # list, create, edit
        └── doctor/             # list, create, edit (פרופיל רופא)
```

## Database Schema (Supabase project: pzkgvkzztrpzdpyhkggt)

### aesthetic_media
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto |
| file_url | text | URL of file |
| file_name | text | |
| file_type | text | 'image' or 'video' |
| mime_type | text | image/jpeg, image/png, video/mp4 |
| file_size_bytes | bigint | WhatsApp limit: 15MB for video |
| description | text | Purpose of file |
| usage_type | text | product_explanation / client_example / other |
| created_at | timestamptz | |

### aesthetic_products
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | Product name |
| description | text | Used by AI bot |
| price | numeric(10,2) | |
| show_in_pricelist | boolean | Default true |
| is_active | boolean | Default true |
| created_at / updated_at | timestamptz | |

### aesthetic_followup_messages
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| product_id | uuid FK → aesthetic_products | nullable |
| message_text | text | |
| delay_value | integer | Must be > 0 |
| delay_unit | text | hours / days / weeks |
| is_active | boolean | |
| created_at / updated_at | timestamptz | |

### aesthetic_clients
| Column | Type |
|--------|------|
| id | uuid PK |
| full_name | text |
| phone | text |
| email | text |
| notes | text |
| created_at / updated_at | timestamptz |

> ⚠️ Client fields to be expanded — fields TBD by client

### dental_* tables
Same structure as aesthetic_* tables (media, products, followup_messages, clients)

### dental_doctor_profile
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| section_title | text | e.g. "על הרופאה", "עלויות" |
| content | text | Free text |
| display_order | integer | Sort order |
| created_at / updated_at | timestamptz | |

## RLS Policies
RLS is currently **disabled** on all tables (simple auth, no Supabase Auth users).
To enable later: add `auth.uid()` check or API key validation.

## WhatsApp Media Constraints
Enforced via UI alerts:
- Images: PNG or JPEG only (mime_type: image/jpeg or image/png)
- Videos: MP4 only (mime_type: video/mp4), max 15MB

## Price List Feature
The "price list" is not a separate table — it's a filtered view of `*_products`
where `show_in_pricelist = true AND is_active = true`.
The list page has a "Copy Price List" button that copies formatted text to clipboard.

## Adding a New Page
1. Create `src/pages/<section>/<resource>/list.tsx`, `create.tsx`, `edit.tsx`
2. Add resource to `resources[]` in `App.tsx` with `parent` pointing to section
3. Add `<Route>` entries in the routes section of `App.tsx`
4. Create Supabase migration for the new table

## Open Questions / TODO
- [ ] Client table fields: awaiting specification from client
- [ ] Deploy URL (set after Railway/Vercel deployment)
- [ ] Supabase Storage integration for direct file upload (currently uses URL input)
- [ ] Add search/filter to client lists
