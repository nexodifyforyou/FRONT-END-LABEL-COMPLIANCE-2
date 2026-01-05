# Nexodify AVA Label Compliance Preflight - PRD

## Original Problem Statement
Build a premium React frontend for "Nexodify AVA Label Compliance Preflight" - a label compliance checking application connecting to an existing Node/Express backend on the user's VM.

## User Constraints
- Backend: Existing Node/Express on VM (port 4100, systemd: ava.service)
- Database: SQLite at /srv/ava/data/app.db (NOT MongoDB)
- Storage: All artifacts at /srv/ava/data/runs/<run_id>/
- Stack: Node/Express + Next.js/React (NOT FastAPI)

## What Was Built (Frontend Only)
- **Date**: January 2025
- **Stack**: React 19 + Tailwind CSS + Shadcn/UI + Framer Motion

### Implemented Features
1. **Authentication Pages**
   - Login with email/password
   - Registration with company info
   - Email verification flow
   - Forgot/Reset password flow

2. **Dashboard**
   - Credit balance display
   - Recent audit runs
   - Quick stats (total/passed/failed)

3. **Audit Wizard (4-step)**
   - Step 1: Product info form
   - Step 2: File upload (label + TDS)
   - Step 3: Review & run
   - Step 4: Results summary

4. **Run History & Details**
   - Searchable/filterable run list
   - Detailed results with check cards
   - Correction submission & re-run
   - PDF/JSON download links

5. **Billing Page**
   - 4 subscription tiers
   - Credit top-up packs
   - Transaction ledger

6. **Admin Panel**
   - User management
   - Manual credit granting

## Documentation Provided
- `/app/docs/API_CONTRACT.md` - Full API specification
- `/app/docs/openapi.yaml` - OpenAPI 3.1 spec
- `/app/docs/NGINX_CONFIG.md` - Nginx routing config

## Prioritized Backlog

### P0 - User Must Implement (Backend)
- [ ] Auth endpoints (/api/auth/*)
- [ ] User endpoints (/api/me)
- [ ] Run endpoints (/api/run, /api/runs)
- [ ] OCR pipeline (pdf-parse + Tesseract/Vision)
- [ ] File storage at /srv/ava/data/runs/
- [ ] Credit wallet & ledger

### P1 - Backend (Optional)
- [ ] Stripe billing integration
- [ ] Email verification/reset emails
- [ ] PDF report generation

### P2 - Frontend Enhancements
- [ ] Dark mode toggle
- [ ] Batch audit uploads
- [ ] Export run history to CSV
- [ ] Team collaboration features

## Next Tasks
1. Implement Node/Express backend endpoints per API_CONTRACT.md
2. Set up SQLite database with schema
3. Configure Nginx reverse proxy
4. Deploy frontend build to /var/www/nexodify-app/
5. Test end-to-end with real backend

---

## Landing Page Redesign (January 2025)

### Changes Made
- Complete dark theme redesign (Stripe/Linear/Vercel aesthetic)
- EU-first positioning: Regulation (EU) 1169/2011
- Removed all FDA references
- Removed fake trust claims (98% accuracy, 500+ brands)

### Design System Implemented
- Background: #070A12 (page), #0B1020 (sections)
- Surface: rgba(255,255,255,0.04) with border rgba(255,255,255,0.08)
- Accent: #5B6CFF (indigo), #22D3EE (cyan subtle)
- Text: 92% white headings, 72% body, 55% muted
- Radius: 16px cards, 12px buttons
- Typography: System fonts, H1 56px desktop/36px mobile

### Sections Added
1. Dark hero with product proof montage (dashboard + PDF preview)
2. Feature grid (4 cards): EU checks, cross-check, evidence, PDF audit
3. How it works (3 steps)
4. Example findings (3 issue cards with severity)
5. Sample PDF report preview
6. Security & audit trail
7. FAQ (5 expandable items)
8. Final CTA
9. Clean dark footer

---

## Sample Report Integration (January 2025)

### What Was Built
- Interactive sample report page at `/sample-report`
- 6-page premium report preview matching dark UI theme
- "View Sample Report" button on landing page wired to page

### Report Structure (All 6 Pages)
1. **Executive Summary**: Score (72%), product info, counters
2. **Findings Overview**: 8 issues with severity/source badges
3-4. **Evidence & Fix Details**: Deep dive with extracted text
5. **Cross-Check Summary**: 5 matches, 3 mismatches
6. **Next Steps & Audit Trail**: Checklist + artifact paths

### Sample Data Used
- Product: Omega-3 Capsules 1000mg
- Company: Example Nutrition S.r.l.
- Country: Italy
- Score: 72% (3 Critical, 5 Warnings, 12 Passed)
