
# 📌 Project Prompt / Requirements

## ✅ Project Goal:
Create a boilerplate authentication system that meets the following criteria:

---

## ⚙️ Tech Stack
- **Frontend**: Next.js (latest) + Tailwind CSS
- **Backend / API**: Node.js Express (deployable on Railway)
- **Authentication & Database**: Supabase
- **SMS Verification**: Supabase Phone Auth with Twilio Verify (configured in Supabase, no Twilio SDK calls)
- **Deployment**: Frontend on Vercel, API on Railway

---

## ✅ Features & Requirements

### 🔐 **User Types & Role-Based Dashboards**
- Three user types:
  - **Provider**
  - **Client**
  - **Admin** (optional lightweight admin panel)
- Each user type has their own dashboard

---

### 📲 **Signup / Registration Flow**
- Signup using **Phone Number only**
- Phone is verified via **Supabase Phone Auth (Twilio handled internally)**
- After verification, user selects account type (**Provider** or **Client**)
- User must create a **unique username**
  - System checks username availability
  - User can only change username **once every 7 days**

---

### 🚀 **First-Time User Onboarding**
- Prompt user to complete their profile:
  - **First Name**
  - **Last Name**
- Collect **backup email and password**
  - **Email verification required**
- Store all user data in **Supabase (auth and profile tables)**

---

### 🔑 **Login Flow**
- Primary login: **Phone Number (via Supabase)**
- Secondary login: **Email and Password (Backup)**

---

### 🔁 **Forgot Password Flow (Fully Required)**
- User verifies phone number
- System fetches associated email
- Sends a **secure password reset link** to the user’s email
- User resets password via the link

✅ **This flow must be implemented via a dedicated API route**

---

### ⚙️ **User Settings Page**
- Allow users to edit and update:
  - **First Name**
  - **Last Name**
  - **Phone Number**
  - **Email Address**
- Change **Username** (check uniqueness, enforce the 7-day change limit)

---

### ✅ **Admin Panel**
- Lightweight and simple
- View, search, and filter users by role
- Ability to **edit user profiles**
- Deployable:
  - Alongside frontend on Vercel
  - Or separately if needed

---

## ✅ **Seeding / Test Users**
- Include a script to seed **sample authenticated users** with:
  - Phone number
  - Auto-assigned username
  - User type
  - Email
  - Password

---

## ✅ **Deployment Requirements**
- **Frontend** (Next.js + Tailwind) deployable on **Vercel**
- **Backend API** (Node.js Express) deployable on **Railway**
- Provide:
  - `README.md` with setup & deployment instructions
  - `setup.md` for credentials/config prompts
  - `.env.example` with only required variables (Supabase, no Twilio)

---

## ✅ **Node.js API Boilerplate (Railway Ready)**
- Include an `index.js` with Express setup
- Use `/routes/`, `/controllers/`, `/middleware/` folder structure
- All API endpoints must be environment-variable driven
- **Include CORS middleware** to handle cross-origin requests from the Vercel frontend
- Designed for easy deployment by copying to Railway and running `node index.js`

---

## ✅ **Documentation**
Project must include:
- Project Overview
- Setup Instructions
- Database / Supabase config
- Deployment steps for Vercel and Railway
- API Route Overview (including forgot password logic)
- Include this updated `PROMPT.md` file

---

## ✅ **Version Control**
- Initialize Git
- Include `.gitignore`
- Provide basic Git usage instructions:
```bash
git add .
git commit -m "Initial commit"
git push
```

---

## ✅ **Additional Notes / Future Proofing**
- Code must be modular and easy to extend
- Follow best practices for:
  - Security
  - Data validation
  - Environment variable management
- Potential future integrations:
  - Stripe payments
  - Webhooks
  - Marketing SMS (if needed, Twilio SDK can be added)

---

## ✅ **Final Checklist for 100% Coverage**
- [x] Phone OTP flow via Supabase
- [x] Role-based user system
- [x] First-time onboarding
- [x] Username change logic (7-day limit)
- [x] Forgot password flow (phone verification → email reset link)
- [x] Admin panel
- [x] Seed script for test users
- [x] Complete deployment + documentation
- [x] `.env.example` aligned to **Supabase-only**

---

📌 **End of Updated Prompt**
