# TrustLink: Platform Overview & Monetization Guide

Welcome to the TrustLink Platform Guide. This document explains the purpose of the platform, its benefits for everyday users, how you can operate and track it as an administrator, and strategies for monetizing the application as your user base grows.

---

## 1. How Users Will Use TrustLink

**TrustLink** functions as a centralized "Link-in-Bio" tool combined with a professional credibility system.

*   **Sign Up & Profile Creation**: Users register on the site and receive a unique username URL (e.g., `trustlink.app/satyam_shukla`).
*   **Adding Links**: Users paste links to their GitHub, LinkedIn, Personal Portfolios, or small businesses in their dashboard.
*   **Verification & TrustScore**: TrustLink's unique angle is its *TrustScore*. By connecting verified social accounts or confirming ownership of a domain, users gain a "Verified" checkmark on their links and their aggregate TrustScore goes up.
*   **Public Sharing**: Users put their `trustlink.app/username` link in their Instagram, Twitter, or LinkedIn bios. When recruiters or customers click it, they see a highly professional, verified list of destinations.

---

## 2. Why TrustLink is Extremely Useful for Users

In today's digital world, scams, impersonation, and untrustworthy links are rampant. 

1.  **Professional Credibility**: A freelancer or job-seeker sharing a "TrustLink" immediately shows recruiters and clients that their identity is verified and legitimate, standing out from standard link-in-bio alternatives.
2.  **Consolidation**: A single, beautifully animated premium link replaces having to send multiple links in chats or emails.
3.  **Analytics**: Users can view exactly how many people clicked their specific links on their Dashboard, helping them understand their reach and audience engagement.

---

## 3. How You Will Earn Money (Monetization Strategy)

As the owner/creator of TrustLink, you have multiple pathways to generate revenue once your platform scales.

### A. The Freemium Model ("Verified Plus")
Offer a free tier for basic users, but charge **$5/month or $50/year** for premium features:
*   Custom domains (e.g., `links.satyam.com` instead of `trustlink.com/satyam`).
*   Advanced Analytics (demographics of link-clickers and historical charts).
*   A premium "Gold" verified badge.
*   The removal of the "Powered by TrustLink" logo at the bottom of their profile.

### B. Affiliate Links & Sponsored Placements
Because you control the platform, you could partner with companies (like software hosting or fintech startups). 
*   **Ethical Ads**: You can place subtle, sponsored professional links in free users' link lists (e.g., *“Try Notion for Free”*) and earn an affiliate commission for every click or signup.

### C. Enterprise Teams
Sell TrustLink to entire companies so their staff can have unified verified signatures: `trustlink.app/companyname/employee`.

---

## 4. Where to View User Records

As the administrator of this locally developed application, you manage the raw data through your relational **Database**.

Currently, your data is securely stored in a local SQLite file (`dev.db`). The easiest way to view the user records, their emails, their links, and their TrustScores is by using **Prisma Studio**, a visual database editor.

### To view your users:
1. Open a terminal in your `server` directory.
2. Run the command: `npx prisma studio`
3. A browser window will automatically open at `http://localhost:5555`.
4. Click on the **User** or **Profile** models to see exactly who has registered, what their passwords (safely hashed) look like, and edit or delete their details as the administrator!

If you deploy your app to production using PostgreSQL (like Supabase), you will use the Supabase web dashboard to query and view your live user records.
