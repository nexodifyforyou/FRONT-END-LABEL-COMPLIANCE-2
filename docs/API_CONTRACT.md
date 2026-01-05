# Nexodify AVA Label Compliance Preflight - API Contract

## Overview

This document describes the API endpoints that the React frontend expects from the Node/Express backend. All endpoints should be prefixed with `/api` and accessible at `https://api.nexodify.com`.

## Base URL

- **Production**: `https://api.nexodify.com`
- **Local Development**: `http://localhost:4100`

---

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Inc",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account."
}
```

**Error Response (400):**
```json
{
  "error": "Email already registered"
}
```

---

### POST /api/auth/login

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "role": "user",
    "email_verified": true,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "credits": 10.0
}
```

---

### POST /api/auth/verify-email

Verify email address using token from email link.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If an account exists, reset instructions have been sent"
}
```

---

### POST /api/auth/reset-password

Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### POST /api/auth/logout

Logout current user (optional - invalidate token server-side).

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## User Endpoints

### GET /api/me

Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Inc",
    "role": "user",
    "email_verified": true,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "credits": 10.0
}
```

---

### PUT /api/me

Update user profile.

**Request Body:**
```json
{
  "name": "John Updated",
  "company": "New Company Inc"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "user_abc123",
    "name": "John Updated",
    "email": "john@example.com",
    "company": "New Company Inc",
    "role": "user"
  }
}
```

---

### PUT /api/me/password

Change user password.

**Request Body:**
```json
{
  "current_password": "oldPassword123",
  "new_password": "newSecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## Run (Audit) Endpoints

### POST /api/run

Create and execute a new compliance audit.

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| product_name | string | Yes | Name of the product |
| company_name | string | Yes | Company name |
| country_of_sale | string | Yes | Target country/region |
| languages_provided[] | string[] | Yes | Languages on label (multiple) |
| halal_audit | boolean | No | Include halal compliance |
| attach_pdf | boolean | No | Generate PDF report |
| customer_name | string | No | Customer name (optional) |
| customer_email | string | No | Email to send report |
| label_file | File | Yes | Label image/PDF (max 20MB) |
| tds_file | File | Yes | TDS document (max 20MB) |

**Response (200 OK):**
```json
{
  "run_id": "run_xyz789",
  "status": "Compliant",
  "score": 0.92,
  "created_at": "2025-01-15T14:30:00Z",
  "product_name": "Omega-3 Fish Oil",
  "company_name": "NutraLife Inc",
  "country_of_sale": "United States",
  "languages_provided": ["English", "Spanish"],
  "credits_used": 1.2,
  "report": {
    "summary": "Product label is mostly compliant with FDA regulations.",
    "checks": [
      {
        "title": "Nutrition Facts Panel",
        "status": "Pass",
        "severity": "high",
        "detail": "Nutrition facts panel meets FDA format requirements.",
        "fix": null,
        "sources": ["21 CFR 101.9"]
      },
      {
        "title": "Allergen Statement",
        "status": "Fail",
        "severity": "critical",
        "detail": "Fish allergen not declared in required format.",
        "fix": "Add 'Contains: Fish' statement below ingredients.",
        "sources": ["FALCPA Section 403(w)"]
      }
    ]
  },
  "pdf_url": "/api/runs/run_xyz789/report.pdf",
  "json_url": "/api/runs/run_xyz789/report.json"
}
```

---

### GET /api/runs

List user's audit runs with pagination and filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search by product/company name |
| status | string | Filter by status: pass, fail, warning |

**Response (200 OK):**
```json
{
  "runs": [
    {
      "run_id": "run_xyz789",
      "product_name": "Omega-3 Fish Oil",
      "company_name": "NutraLife Inc",
      "country_of_sale": "United States",
      "status": "Compliant",
      "score": 0.92,
      "created_at": "2025-01-15T14:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "passed": 18,
  "failed": 7
}
```

---

### GET /api/runs/:run_id

Get detailed results for a specific audit run.

**Response (200 OK):**
```json
{
  "run_id": "run_xyz789",
  "product_name": "Omega-3 Fish Oil",
  "company_name": "NutraLife Inc",
  "country_of_sale": "United States",
  "languages_provided": ["English", "Spanish"],
  "halal_audit": false,
  "status": "Compliant",
  "score": 0.92,
  "created_at": "2025-01-15T14:30:00Z",
  "credits_used": 1.2,
  "report": {
    "summary": "Product label is mostly compliant with FDA regulations.",
    "checks": [
      {
        "title": "Nutrition Facts Panel",
        "status": "Pass",
        "severity": "high",
        "detail": "Nutrition facts panel meets FDA format requirements.",
        "fix": null,
        "sources": ["21 CFR 101.9"]
      }
    ]
  },
  "corrections": [
    {
      "text": "Updated allergen statement to include fish",
      "submitted_at": "2025-01-15T15:00:00Z"
    }
  ]
}
```

---

### GET /api/runs/:run_id/report.pdf

Download PDF report for a run.

**Response:** Binary PDF file with `Content-Type: application/pdf`

---

### GET /api/runs/:run_id/report.json

Download JSON report for a run.

**Response:** JSON file with full report data

---

### POST /api/runs/:run_id/rerun

Re-run audit with corrections (uses stored evidence_text).

**Request Body:**
```json
{
  "correction_text": "Updated the allergen statement to comply with FALCPA."
}
```

**Response (200 OK):** Same as POST /api/run response

---

## Corrections Endpoint (Existing)

### POST /api/save-corrections

Save correction text for a product.

**Request Body:**
```json
{
  "run_id": "run_xyz789",
  "correction_text": "Updated allergen labeling to include fish declaration."
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Billing Endpoints

### GET /api/billing/wallet

Get user's credit balance.

**Response (200 OK):**
```json
{
  "balance": 10.5,
  "plan": "growth",
  "plan_credits": 30,
  "plan_renews_at": "2025-02-15T00:00:00Z"
}
```

---

### GET /api/billing/ledger

Get credit transaction history.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | number | Number of transactions (default: 20) |
| offset | number | Offset for pagination |

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "id": "tx_123",
      "type": "spend",
      "credits_delta": -1.2,
      "reason": "Audit run: Omega-3 Fish Oil",
      "run_id": "run_xyz789",
      "ts": "2025-01-15T14:30:00Z"
    },
    {
      "type": "grant",
      "credits_delta": 30,
      "reason": "Monthly subscription grant",
      "ts": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### GET /api/billing/plans

Get available subscription plans.

**Response (200 OK):**
```json
{
  "plans": [
    {
      "id": "starter",
      "name": "Starter",
      "price": 29,
      "credits": 10,
      "stripe_price_id": "price_xxx"
    },
    {
      "id": "growth",
      "name": "Growth",
      "price": 79,
      "credits": 30,
      "stripe_price_id": "price_yyy"
    }
  ]
}
```

---

### POST /api/billing/checkout

Create Stripe checkout session for subscription.

**Request Body:**
```json
{
  "price_id": "starter"
}
```

**Response (200 OK):**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_xxx..."
}
```

---

### POST /api/billing/portal

Create Stripe customer portal session.

**Response (200 OK):**
```json
{
  "url": "https://billing.stripe.com/p/session/xxx..."
}
```

---

### POST /api/billing/topup

Create checkout for one-time credit purchase.

**Request Body:**
```json
{
  "amount": 15
}
```

**Response (200 OK):**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_xxx..."
}
```

---

### POST /api/stripe/webhook

Stripe webhook endpoint for payment events.

**Headers:**
```
Stripe-Signature: <stripe_signature>
```

**Events to Handle:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

## Admin Endpoints (Protected)

### GET /api/admin/stats

Get system statistics (admin only).

**Response (200 OK):**
```json
{
  "totalUsers": 156,
  "totalRuns": 1247,
  "totalCredits": 5230.5
}
```

---

### GET /api/admin/users

List all users (admin only).

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| limit | number | Items per page |
| offset | number | Pagination offset |
| search | string | Search by name/email |

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "user_abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Inc",
      "credits": 10.5,
      "role": "user",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 156
}
```

---

### POST /api/admin/grant-credits

Manually grant credits to a user (admin only).

**Request Body:**
```json
{
  "user_id": "user_abc123",
  "credits": 10,
  "reason": "Testing grant"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "new_balance": 20.5
}
```

---

## Existing Endpoints (Do Not Modify)

These endpoints already exist on your Node/Express server. The frontend calls them through the web layer.

### GET /health

Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "service": "ava",
  "ts": 1705324800000
}
```

---

### POST /api/check-label

Core compliance checking endpoint (existing).

**Request Body:**
```json
{
  "evidence_text": "Full extracted text from label and TDS...",
  "product_name": "Omega-3 Fish Oil",
  "company_name": "NutraLife Inc",
  "country_of_sale": "United States",
  "languages_provided": ["English"]
}
```

**Response:** Returns compliance check results with X-AVA-* debug headers.

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 429: Too Many Requests (rate limited)
- 500: Internal Server Error

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token should be stored in localStorage as `ava_token` by the frontend.

---

## Rate Limiting

Recommended rate limits:
- Auth endpoints: 10 requests/minute per IP
- Run endpoints: 30 requests/minute per user
- Other endpoints: 60 requests/minute per user

---

## File Storage

All run artifacts are stored at:
```
/srv/ava/data/runs/<run_id>/
├── label.<ext>           # Original label file
├── tds.<ext>             # Original TDS file
├── label_text.txt        # Extracted label text
├── tds_text.txt          # Extracted TDS text
├── evidence_text.txt     # Combined evidence text
├── request.json          # Original request payload
├── report.json           # Compliance report
├── report.pdf            # PDF report
└── corrections_snapshot.json  # Correction history
```
