# ERÜ Kayak & Snowboard Kulübü (Snowriders) - Management System

[![Frontend: React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Style: Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A premium, full-stack event management and registration platform tailored for the **Erciyes University Kayak & Snowboard Club (Snowriders)**. This project focuses on high-performance UX, secure authentication, and scalable club administration.

## 🏔️ The Nordic Peak Experience
Designed with a "Nordic Peak" aesthetic, the application provides a glassmorphism UI that mirrors the snowy atmosphere of Erciyes Mountain. It’s not just an app; it’s a premium experience for club members.

## 🛠️ Tech Stack & Architecture

### Frontend (SPA)
- **Framework:** React 19 with Vite for lightning-fast HMR.
- **Styling:** Tailwind CSS 4.0 using a cohesive dark-mode design system.
- **State Management:** Custom React Context API for global authentication and user state.
- **Internationalization:** `i18next` for seamless Turkish/English support.
- **Routing:** Component-based routing with `react-router-dom` (v7).

### Backend (RESTful API)
- **Environment:** Node.js & Express.js.
- **Database:** MongoDB with Mongoose ODM for flexible yet structured data modeling.
- **Security:**
  - JWT (JSON Web Tokens) for stateless, secure session management.
  - PBKDF2-based password hashing via `bcryptjs`.
  - Role-Based Access Control (RBAC) ensuring administrative integrity.
- **Integrations:**
  - `Nodemailer` for automated email confirmations and password resets.
  - `Multer` for efficient multipart/form-data (image) handling.

## 🚀 Key Engineering Highlights

### 1. Robust Authentication Flow
Implemented a comprehensive auth system including email verification, secure password resets with time-limited tokens, and persisted sessions.

### 2. Scalable Event Registration Logic
Designed a backend logic that handles participant limits, registration deadlines, and concurrent user requests, ensuring data consistency during high-traffic registration periods.

### 3. Localization Strategy
Developed a custom localization solution using `i18next`, allowing the entire platform to adapt to the user's preferred language (TR/EN) instantly without reloading.

### 4. Admin Command Center
Built a centralized dashboard where administrators can manage events, monitor participant lists in real-time, and trigger system-wide updates through a Floating Action Button (FAB) interface.

## ⚙️ Local Development

1. **Clone & Install**:
   ```bash
   git clone [repository-url]
   cd eru-snowriders
   ```
2. **Backend Setup**:
   - Create a `.env` in `snowriders/backend` with `MONGODB_URI`, `JWT_SECRET`, and SMTP credentials.
   - Run: `cd snowriders/backend && npm install && npm run dev`
3. **Frontend Setup**:
   - Run: `cd snowriders/frontend && npm install && npm run dev`

## 👨‍💻 Developer
**Enes Otlu**  
*Full Stack Developer*  
[GitHub Profile](https://github.com/enesotlu) | [LinkedIn](https://www.linkedin.com/in/enesotlu/)

---
*Developed for Erciyes University Snowriders Club.*