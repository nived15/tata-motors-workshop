# User Stories & Acceptance Criteria
## Money Manager Application

**Document Version:** 1.0  
**Date:** January 19, 2026  
**Related Document:** [BRD.md](BRD.md)

---

## 1. User Personas

### Primary Persona: Sarah - Freelance Consultant
**Demographics:** 32 years old, freelance marketing consultant  
**Technical Proficiency:** Moderate (comfortable with web apps)  
**Goals:** Track multiple income streams, understand revenue trends, prepare tax documentation  
**Pain Points:** Manually tracking income in spreadsheets is error-prone and time-consuming  
**Motivations:** Financial clarity, reduce tax season stress, identify profitable clients

### Secondary Persona: Raj - Small Business Owner
**Demographics:** 45 years old, runs a small retail business  
**Technical Proficiency:** Low-to-moderate (prefers simple interfaces)  
**Goals:** Monitor daily sales, categorize revenue sources, export reports for accountant  
**Pain Points:** Existing tools too complex or lack necessary security for financial data  
**Motivations:** Business insights, compliance readiness, data security

---

## 2. User Stories

### Epic 1: Account Security & Access

#### US-1: Secure Account Registration
**As a** new user  
**I want to** create an account with strong security measures  
**So that** my financial data is protected from unauthorized access

**Priority:** Must-have  
**Story Points:** 5  
**Sprint:** Sprint 1

**Acceptance Criteria:**
1. Registration form includes email, password (min 12 characters with complexity requirements), and confirm password fields
2. System validates email format and checks for existing accounts
3. Password strength indicator displays in real-time (weak/moderate/strong)
4. Email verification link sent within 60 seconds of registration
5. Account is inactive until email verification is complete
6. User receives confirmation message after successful verification
7. Password must contain: uppercase, lowercase, number, and special character
8. Error messages are clear and actionable (e.g., "Password must contain at least one number")

**Technical Notes:**
- Use bcrypt with salt rounds = 12 for password hashing
- Email verification token expires after 24 hours
- Implement rate limiting: 5 registration attempts per IP per hour

**Dependencies:** None

---

#### US-2: Multi-Factor Authentication Setup
**As a** security-conscious user  
**I want to** enable multi-factor authentication on my account  
**So that** I have an additional layer of protection against unauthorized access

**Priority:** Must-have  
**Story Points:** 8  
**Sprint:** Sprint 1

**Acceptance Criteria:**
1. MFA setup option visible in account settings after initial login
2. User can choose MFA method: authenticator app (TOTP) or SMS
3. QR code displayed for authenticator app setup with manual entry option
4. User must enter verification code to complete MFA activation
5. Backup codes (10 codes) generated and displayed once during setup
6. User must confirm saving backup codes before proceeding
7. MFA can be disabled with current password + MFA code verification
8. Login flow prompts for MFA code after successful password entry
9. Account lockout after 3 failed MFA attempts with 15-minute cooldown

**Technical Notes:**
- Use TOTP standard (RFC 6238) for authenticator apps
- Backup codes hashed before storage
- Session invalidated across all devices when MFA is enabled/disabled

**Dependencies:** US-1 (Secure Account Registration)

---

### Epic 2: Income Transaction Management

#### US-3: Add Income Transaction
**As a** user managing multiple income sources  
**I want to** quickly add income transactions with relevant details  
**So that** I can maintain an accurate record of all my earnings

**Priority:** Must-have  
**Story Points:** 8  
**Sprint:** Sprint 2

**Acceptance Criteria:**
1. "Add Income" button prominently displayed on dashboard and transactions page
2. Form includes fields: Amount, Source, Category (dropdown), Date (date picker), Notes (optional)
3. Amount field validates:
   - Positive numbers only
   - Up to 2 decimal places
   - Maximum value: 999,999,999.99
   - Displays with currency symbol
4. Source field: required, max 255 characters, trimmed whitespace
5. Category dropdown populated with default + custom categories
6. Date picker defaults to today, cannot select future dates
7. Notes field: optional, max 1000 characters, character counter displayed
8. Real-time validation with error messages displayed inline
9. "Save" button disabled until all required fields are valid
10. Success toast notification displayed after successful save
11. Transaction appears immediately in dashboard and transaction list
12. Form resets after successful submission for quick consecutive entries

**Technical Notes:**
- API endpoint: POST /api/transactions
- Client-side and server-side validation required
- Audit log entry created with user ID, timestamp, action type

**Dependencies:** Category management system (at least default categories)

---

#### US-4: Edit and Delete Income Transactions
**As a** user who occasionally makes entry mistakes  
**I want to** edit or delete transactions  
**So that** my financial records remain accurate

**Priority:** Must-have  
**Story Points:** 5  
**Sprint:** Sprint 2

**Acceptance Criteria:**
1. Edit icon displayed next to each transaction in list view
2. Clicking edit opens form pre-populated with current values
3. All fields editable except creation timestamp
4. "Last modified" timestamp displayed and updated on save
5. Delete icon displayed with confirmation modal: "Are you sure you want to delete this transaction? This action can be undone within 30 days."
6. Deleted transactions marked as soft-deleted (not removed from database)
7. "Undo" option available for 10 seconds after deletion via toast notification
8. Deleted transactions move to "Archived" section (accessible from settings)
9. Audit trail logs all edits: old value, new value, timestamp, user ID
10. Transaction modifications reflect immediately across all views

**Technical Notes:**
- API endpoints: PUT /api/transactions/:id, DELETE /api/transactions/:id
- Soft delete: set `deleted_at` timestamp instead of removing record
- Permanent deletion job runs monthly for transactions deleted > 30 days ago

**Dependencies:** US-3 (Add Income Transaction)

---

### Epic 3: Data Visualization & Insights

#### US-5: View Income Dashboard
**As a** user tracking income over time  
**I want to** see visual summaries and trends on a dashboard  
**So that** I can quickly understand my financial situation and make informed decisions

**Priority:** Must-have  
**Story Points:** 13  
**Sprint:** Sprint 3

**Acceptance Criteria:**
1. Dashboard displays four summary cards:
   - Total income (current month) with % change vs. last month
   - Year-to-date total income
   - Top income category with percentage
   - Total transaction count (current month)
2. Monthly income trend chart:
   - Line chart showing last 12 months
   - Hover tooltip displays exact amount and month
   - Y-axis auto-scales based on data range
   - X-axis shows month abbreviations (Jan, Feb, Mar)
3. Category distribution chart:
   - Pie or donut chart showing percentage breakdown
   - Legend with category names and percentages
   - Hover highlights corresponding segment
   - Click on segment filters recent transactions list
4. Recent transactions list:
   - Displays last 10 transactions
   - Shows: date, source, amount, category
   - "View All" link navigates to full transaction list
5. Date range filter:
   - Presets: This Month, Last Month, Last 3 Months, This Year, Custom
   - Custom range: date picker with start and end dates
   - Filter applies to all dashboard components simultaneously
6. Dashboard loads within 2 seconds (with up to 10,000 transactions)
7. Loading skeleton displayed while data fetches
8. Empty states with helpful messages when no data available

**Technical Notes:**
- API endpoint: GET /api/dashboard?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
- Implement Redis caching for dashboard data (5-minute TTL)
- Database queries optimized with indexes on date and category fields
- Chart library: Chart.js or Recharts

**Dependencies:** US-3 (Add Income Transaction), Category management system

---

## 3. Use Cases

### Use Case 1: First-Time User Onboarding

**Actor:** New User (Sarah)  
**Preconditions:** User has navigated to application homepage  
**Trigger:** User clicks "Get Started" or "Sign Up"

**Main Flow:**
1. User clicks "Sign Up" button on homepage
2. System displays registration form
3. User enters email address: sarah@example.com
4. User creates password meeting complexity requirements
5. System displays password strength indicator (Strong)
6. User confirms password
7. User clicks "Create Account"
8. System validates inputs, creates account (inactive status)
9. System sends verification email to sarah@example.com
10. System displays message: "Verification email sent. Please check your inbox."
11. User opens email and clicks verification link
12. System activates account and redirects to login page
13. User logs in with credentials
14. System displays onboarding tutorial overlay
15. Tutorial highlights: "Add Income" button, Dashboard features, Account settings
16. User clicks "Get Started" to dismiss tutorial
17. System displays empty dashboard with prompt: "Add your first income transaction to get started!"

**Alternate Flows:**
- **3a. Email already registered:** System displays error: "An account with this email already exists. Please login or use a different email."
- **5a. Weak password:** System displays error: "Password is too weak. Please add numbers and special characters."
- **11a. Verification link expired:** System displays error with option to resend verification email

**Postconditions:** User has verified account and understands basic application navigation

---

### Use Case 2: Adding Monthly Income with Categorization

**Actor:** Active User (Sarah - Freelance Consultant)  
**Preconditions:** User is logged in, has previously set up account  
**Trigger:** User receives payment from client and wants to record it

**Main Flow:**
1. User navigates to dashboard and clicks "Add Income" button
2. System displays income entry form
3. User enters amount: 3,500.00
4. User enters source: "Marketing Campaign - ABC Corp"
5. User selects category from dropdown: "Freelance"
6. User selects date: January 15, 2026 (using date picker)
7. User enters notes: "Q1 2026 retainer payment"
8. System validates all required fields in real-time (all valid)
9. User clicks "Save Transaction"
10. System creates transaction record with audit log
11. System displays success notification: "Income transaction added successfully"
12. System updates dashboard:
    - Total income (current month) increases by 3,500.00
    - Transaction appears in "Recent Transactions" list
    - Category distribution chart updates to reflect new transaction
13. User sees updated dashboard within 1 second

**Alternate Flows:**
- **3a. Invalid amount (negative):** System displays error: "Amount must be a positive number"
- **6a. Future date selected:** System displays error: "Date cannot be in the future"
- **9a. Network error:** System displays error: "Unable to save. Please check your connection and try again." Transaction saved locally for retry.

**Postconditions:** Transaction is persisted in database, audit log created, dashboard reflects new data

---

## 4. Story Prioritization (MoSCoW)

### Must-Have (MVP Launch)
- ✅ US-1: Secure Account Registration
- ✅ US-2: Multi-Factor Authentication Setup
- ✅ US-3: Add Income Transaction
- ✅ US-4: Edit and Delete Income Transactions
- ✅ US-5: View Income Dashboard

### Should-Have (Post-MVP - Phase 2)
- Data export functionality (CSV/PDF)
- Custom category creation and management
- Advanced filtering and search
- Transaction import from CSV
- Email notifications for important events

### Could-Have (Future Enhancements)
- Mobile app (iOS/Android)
- Recurring income automation
- Multi-currency support
- Budget goals and alerts
- Expense tracking integration

### Won't-Have (Out of Scope)
- Investment portfolio tracking
- Cryptocurrency management
- Bill payment integration
- Social sharing features
- Third-party banking API integration (for MVP)

---

## 5. Story Dependencies

```
US-1 (Account Registration)
    └── US-2 (Multi-Factor Authentication)
    
US-3 (Add Income Transaction)
    └── US-4 (Edit/Delete Transactions)
    └── US-5 (View Dashboard)

Category Management System (prerequisite)
    └── US-3 (Add Income Transaction)
    └── US-5 (View Dashboard)
```

---

## 6. Acceptance Testing Checklist

### Pre-Launch Testing Requirements

**Security Testing:**
- [ ] Penetration testing completed with zero critical vulnerabilities
- [ ] All passwords hashed (verify no plain-text in database)
- [ ] MFA functioning correctly for multiple authenticator apps
- [ ] Rate limiting prevents brute-force attacks
- [ ] Session management secure (timeouts, token rotation)

**Functional Testing:**
- [ ] User can complete full registration flow
- [ ] User can add, edit, delete transactions successfully
- [ ] Dashboard displays accurate data for all date ranges
- [ ] Charts render correctly and are interactive
- [ ] Validation errors display clearly and accurately

**Performance Testing:**
- [ ] Dashboard loads < 2 seconds with 10,000 transactions
- [ ] API endpoints respond < 500ms (95th percentile)
- [ ] Application supports 1,000 concurrent users

**Usability Testing:**
- [ ] 8 participants complete user acceptance testing
- [ ] 80%+ task completion rate achieved
- [ ] Onboarding tutorial clarity verified
- [ ] Error messages understandable by non-technical users

**Data Integrity Testing:**
- [ ] Backup restoration tested and verified
- [ ] Audit trails accurately record all changes
- [ ] Soft delete and recovery functioning correctly
- [ ] Data export matches on-screen data exactly

---

## 7. Definition of Done

A user story is considered "Done" when:

1. **Code Complete:**
   - All acceptance criteria implemented
   - Code reviewed and approved by at least one team member
   - No linting errors or warnings
   - Code merged to develop branch

2. **Testing Complete:**
   - Unit tests written with 80%+ coverage for new code
   - Integration tests pass for all related endpoints
   - Manual QA testing completed
   - Regression testing confirms no broken existing functionality

3. **Documentation Complete:**
   - API endpoints documented (OpenAPI/Swagger)
   - Code comments for complex logic
   - User-facing feature documented in help section (if applicable)

4. **Security Review:**
   - Security checklist completed
   - No new vulnerabilities introduced (automated scan)
   - Authentication/authorization verified

5. **Deployment Ready:**
   - Feature deployed to staging environment
   - Smoke tests passed in staging
   - Product owner acceptance obtained

---

## 8. Sprint Planning Notes

### Sprint 1 (Weeks 1-2): Security Foundation
**Goal:** Establish secure authentication and authorization framework

**Stories:**
- US-1: Secure Account Registration (5 points)
- US-2: Multi-Factor Authentication Setup (8 points)

**Sprint Capacity:** 13 points  
**Team Velocity:** TBD (first sprint)

---

### Sprint 2 (Weeks 3-4): Core Transaction Management
**Goal:** Enable users to create, edit, and manage income transactions

**Stories:**
- US-3: Add Income Transaction (8 points)
- US-4: Edit and Delete Income Transactions (5 points)
- Category management system setup (3 points)

**Sprint Capacity:** 16 points

---

### Sprint 3 (Weeks 5-7): Dashboard and Visualization
**Goal:** Deliver actionable insights through interactive dashboard

**Stories:**
- US-5: View Income Dashboard (13 points)
- Dashboard performance optimization (5 points)

**Sprint Capacity:** 18 points

---

## 9. Open Questions

1. **MFA Method Priority:** Should we prioritize authenticator app (TOTP) over SMS, or offer both equally?
   - *Recommendation:* Prioritize TOTP (more secure), offer SMS as fallback

2. **Transaction Limits:** Should we limit the number of transactions users can add (e.g., 10,000 transactions per account)?
   - *Recommendation:* No hard limit for MVP, monitor usage and adjust if needed

3. **Dashboard Refresh:** Should dashboard auto-refresh when new transactions are added, or require manual refresh?
   - *Recommendation:* Real-time updates within the same session, no auto-refresh across sessions (performance consideration)

4. **Category Limits:** Maximum number of custom categories a user can create?
   - *Recommendation:* 50 custom categories (prevents overwhelming UI)

5. **Export Frequency:** Should we limit how often users can export data (to prevent abuse)?
   - *Recommendation:* 10 exports per day per user (reasonable for legitimate use)

---

## Document Control
- **Author:** Product Team
- **Reviewers:** Development Team, UX Designer
- **Approval:** Pending
- **Next Review Date:** February 19, 2026 (30 days)
