# Nexodify AVA Label Compliance Preflight - Frontend

A premium React frontend for the AVA Label Compliance Preflight system.

## Overview

This frontend provides a complete user interface for:
- User authentication (login, register, email verification, password reset)
- Compliance audit wizard (product info → file upload → run → results)
- Run history and detailed results viewing
- Credit-based billing management
- Admin panel for user management

## Technology Stack

- **React 19** with React Router 7
- **Tailwind CSS** for styling
- **Shadcn/UI** components
- **Framer Motion** for animations
- **React Hook Form + Zod** for form validation
- **Axios** for API requests

## Project Structure

```
/app/frontend/src/
├── components/
│   ├── layout/
│   │   └── DashboardLayout.jsx    # Main app layout with sidebar
│   ├── ui/                        # Shadcn UI components
│   └── ProtectedRoute.jsx         # Auth route guards
├── context/
│   └── AuthContext.jsx            # Authentication state
├── lib/
│   ├── api.js                     # API client configuration
│   └── utils.js                   # Utility functions
├── pages/
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   └── VerifyEmailPage.jsx
│   ├── audit/
│   │   └── NewAuditPage.jsx       # Multi-step audit wizard
│   ├── runs/
│   │   ├── RunHistoryPage.jsx
│   │   └── RunDetailPage.jsx      # Results + correction box
│   ├── admin/
│   │   └── AdminPage.jsx
│   ├── DashboardPage.jsx
│   ├── BillingPage.jsx
│   ├── SettingsPage.jsx
│   └── LandingPage.jsx
├── App.js                         # Main app with routes
└── index.css                      # Global styles
```

## Configuration

### Environment Variables

Set in `/app/frontend/.env`:

```env
# Backend API URL - point to your Node/Express server
REACT_APP_BACKEND_URL=https://api.nexodify.com
```

## API Contract

The frontend expects these endpoints from your Node/Express backend. See `/app/docs/API_CONTRACT.md` for full specification.

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User
- `GET /api/me` - Get current user + credits
- `PUT /api/me` - Update profile
- `PUT /api/me/password` - Change password

### Runs (Audits)
- `POST /api/run` - Create new audit (multipart/form-data)
- `GET /api/runs` - List runs with pagination/filtering
- `GET /api/runs/:run_id` - Get run details
- `GET /api/runs/:run_id/report.pdf` - Download PDF
- `POST /api/runs/:run_id/rerun` - Re-run with corrections

### Billing
- `GET /api/billing/wallet` - Get credit balance
- `GET /api/billing/ledger` - Transaction history
- `POST /api/billing/checkout` - Create Stripe checkout
- `POST /api/billing/portal` - Stripe customer portal

### Admin
- `GET /api/admin/stats` - System stats
- `GET /api/admin/users` - List users
- `POST /api/admin/grant-credits` - Manually grant credits

## Development

```bash
# Install dependencies
cd /app/frontend
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

## Deployment

1. Build the frontend:
```bash
yarn build
```

2. Copy to your web server:
```bash
scp -r build/ user@server:/var/www/nexodify-app/
```

3. Configure Nginx (see `/app/docs/NGINX_CONFIG.md`)

## Pages Overview

### Landing Page (`/`)
- Hero section with value proposition
- Features overview
- CTA buttons to register/login

### Auth Pages
- **Login** (`/login`) - Email/password login
- **Register** (`/register`) - Account creation with company info
- **Forgot Password** (`/forgot-password`) - Request reset email
- **Reset Password** (`/reset-password?token=xxx`) - Set new password
- **Verify Email** (`/verify-email?token=xxx`) - Confirm email

### Dashboard (`/dashboard`)
- Quick stats (total audits, passed, failed)
- Recent audit runs
- Quick action cards

### New Audit Wizard (`/audit/new`)
1. **Step 1: Product Info** - Name, company, country, languages
2. **Step 2: Upload Files** - Label and TDS document upload
3. **Step 3: Review & Run** - Confirm details and credit cost
4. **Step 4: Results** - Success/failure summary with link to details

### Run History (`/runs`)
- Searchable/filterable list of all audits
- Status badges and scores
- Quick PDF download

### Run Details (`/runs/:run_id`)
- Overall score and status
- Expandable check cards with:
  - Status (Pass/Fail/Warning)
  - Severity level
  - Details and recommended fixes
  - Regulatory sources
- Correction submission box
- Re-run button

### Billing (`/billing`)
- Current credit balance
- Subscription plans (Starter, Growth, Pro, Enterprise)
- One-time credit top-ups
- Transaction history

### Settings (`/settings`)
- Profile information
- Password change

### Admin (`/admin`)
- System statistics
- User list
- Manual credit granting

## Test IDs

All interactive elements have `data-testid` attributes for testing:
- `login-email-input`, `login-password-input`, `login-submit-btn`
- `register-name-input`, `register-email-input`, etc.
- `new-audit-btn`, `product-name-input`, `run-audit-btn`
- `download-pdf-btn`, `correction-textarea`, `rerun-btn`
