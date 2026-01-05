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
