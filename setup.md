
# Project Setup Guide

## ✅ Prerequisites
- Node.js
- NPM
- Supabase account
- Supabase Phone Auth enabled (Twilio Verify configured in Supabase)

---

## ✅ Environment Variables
Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App Config
NEXT_PUBLIC_APP_URL=
```

### 🔔 **Note:**  
❌ Twilio credentials are **managed directly inside Supabase** (Auth → Phone provider).  
✅ You do **not** need to add Twilio SID, Auth Token, or Verify SID to `.env`.

---

## ✅ Setup Steps

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Setup Supabase**
- Create a new Supabase project
- Configure **Phone Provider** under **Authentication → Sign In / Up**
  - Set **Twilio Verify** credentials directly inside Supabase
- Set up the following tables:
  - `users` (extends `auth.users`)
  - `profiles`
  - `roles`

### 3. **Development**
```bash
npm run dev
```

### 4. **Build for Production**
```bash
npm run build
npm run start
```

---

## ✅ API Routes Structure
```
/api
├── auth
│   ├── login
│   ├── register
│   └── verify
├── profile
│   └── update
└── users
    └── [id]
```

---

## ✅ Authentication Flows
1. **Phone Registration** (via Supabase Auth API)
   - `supabase.auth.signUp({ phone })`
   - Supabase sends OTP (Twilio handled inside Supabase)
   - Verify OTP
   - Create user
   - Select role

2. **Email Setup**
   - Add backup email
   - Verify email
   - Set password

3. **Login Options**
   - Phone (Primary via Supabase)
   - Email/Password (Backup)

---

## ✅ Database Schema
- Key tables and relationships are documented in `README.md`
- Supabase handles phone auth/OTP using **Twilio Verify** (configured in Supabase dashboard)

---

## ⚠️ **Important:**
- **No custom Twilio logic or API calls** in your app code
- Keep `.env.local` **secure** and **NEVER** commit it to Git
