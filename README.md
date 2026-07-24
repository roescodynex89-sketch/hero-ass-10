# 🎨 ArtHub – Online Art Marketplace

![ArtHub Preview](https://i.ibb.co.com/5HC9X0C/set1.png)

A feature-rich, dynamic digital platform built using Next.js and Tailwind CSS that connects art enthusiasts, collectors, and buyers with world-class digital artists. Users can browse, purchase, review original artworks, and manage their experience through role-based dashboards.

---

## 🌐 Live Demo & Credentials

- **Live Site**: [https://hero-ass-10.vercel.app](https://hero-ass-10.vercel.app)
- **Client Repository**: [https://github.com/roescodynex89-sketch/hero-ass-10](https://github.com/roescodynex89-sketch/hero-ass-10)
- **Server Repository**: [https://github.com/roescodynex89-sketch/hero-ass-10-server](https://github.com/roescodynex89-sketch/hero-ass-10-server)
- **Admin Access**:
  - **Email**: `admin@arthub.com`
  - **Password**: `Admin@123`

---

## ✨ Key Features

- **🔐 Authentication & Role-Based Access Control**:
  - Secure Email/Password registration & login alongside Google OAuth using **BetterAuth**.
  - Dynamic user roles: **User (Buyer)**, **Artist**, and **Admin**.
  - Token-based persistent authentication with JWT.

- **🎨 Marketplace & Dynamic Browse**:
  - Publicly accessible gallery with search, category filtering, price range filter, and multi-tier sorting.
  - Server-side/client-side pagination support.
  - Sold status badges for purchased artworks.

- **💳 Stripe Integration & Tier System**:
  - Direct Stripe Checkout integration for purchasing artwork and upgrading subscription tiers (**Free**, **Pro**, **Premium**).

- **💬 Verified Purchase Comment System**:
  - Exclusive comment & feedback feature on artwork details pages available only to verified buyers.
  - Full CRUD operations on user's own comments.

- **📊 Role-Specific Responsive Dashboards**:
  - **User**: View purchase history, bought gallery, manage subscription tier, and edit profile.
  - **Artist**: Manage created artworks (Add, Edit, Delete with imgBB image host), view real-time sales history.
  - **Admin**: Overview charts, manage users & roles, track total system transactions, and moderate artwork listings.

- **🌐 Interactive UI & UX**:
  - Fully responsive, modern design with clean dark/light mode toggle.
  - Eye-catching animations, skeleton loaders for fetch states, and custom 404/Error Boundary screens.

---

## 🛠️ Tech Stack & Packages Used

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS,React (Icons), Framer Motion
- **State & Auth**: BetterAuth, Axios / TanStack Query
- **Payment & Uploads**: Stripe SDK, imgBB API Integration
- **Charts**: Recharts

---
👨‍💻 Developed By

Estiak Aktar Roes

Full Stack Developer