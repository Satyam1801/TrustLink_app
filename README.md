# 🚀 TrustLink: Verified Professional Identity Hub

TrustLink is a scalable, premium web application built for modern professionals to create a consolidated, verified presence of their digital identity. It provides a unique "TrustScore" algorithm and a world-class user experience.

---

## 🧠 System Architecture & Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, Prisma ORM, JSON Web Tokens
- **Database**: PostgreSQL (via local Docker or free tier of Supabase)
- **Deployment Strategy**:
  - Frontend: **Vercel** (Free, excellent Next.js support)
  - Backend: **Render** or **Railway** (Free/cheap tiers for Express)
  - Database: **Supabase** or **Neon PostgreSQL** (Generous free tiers)

---

## 📂 Project Structure
- `/client` - Next.js App Router application (Frontend)
- `/server` - Node.js Express application (Backend APIs)

---

## 🛠 Setup Instructions

### 1. Database Setup
1. Create a free PostgreSQL database on [Supabase](https://supabase.com/).
2. Get the connection string.

### 2. Backend Setup (`/server`)
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Configure the environment variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="generate_a_strong_random_secret"
   CLIENT_URL="http://localhost:3000"
   ```
4. Run Prisma database push to sync the schema:
   `npx prisma db push`
   (or apply migrations if you generate them).
5. Start the backend server:
   `npm run dev`

### 3. Frontend Setup (`/client`)
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the Next.js development server:
   `npm run dev`
4. Access the UI at `http://localhost:3000`

---

## 🔐 Security & Privacy Features Included
- Password hashing using `bcryptjs`.
- Security HTTP Headers applied via `helmet`.
- Cross-Origin Resource Sharing (`cors`) locked down.
- Express Rate Limiting against DDoS attacks.
- JWT stored in HTTP-Only cookies to prevent XSS.
- Modern ORM (`Prisma`) avoids SQL injection vectors natively.

---

## 🧪 Testing Strategies
- **React Components**: Add `Jest` and `@testing-library/react` to `/client`.
- **API Endpoints**: Use `Supertest` alongside `Jest` in the `/server` directory to perform integration tests on Express routes.
- Examples: 
  - Ensure JWT returns properly on `/api/auth/login`.
  - Validate Error 401 on restricted endpoints if Token is not provided.

---

## 💰 Monetization Strategy (Free Tier Available)
1. **Freemium Tier**: Include up to 3 verified links, basic layout.
2. **Pro Tier ($5/mo)**: Unlimited links, custom domains, detailed analytics (views/clicks over time), priority trust scoring calculation.
3. **Ads**: Could utilize ethical ad placements or sponsored link slots for free-tier users.

---

Designed & Architected for Production-Ready Standards. 
