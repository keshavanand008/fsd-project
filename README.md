# MERN Mobile Marketplace

A full-stack e-commerce app for buying/selling mobile phones. Built with:
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth
- **Frontend:** React (Vite), Tailwind CSS, Redux Toolkit
- **Features:** Auth (buyer/seller), product CRUD, cart, checkout (mock), orders, image uploads, reviews, wishlists.

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env
# edit .env with your Mongo URI and JWT secret
npm install
npm run dev
```
Backend runs at http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

Login/Register and try:
- Register as **seller** to add products in **Seller Dashboard**.
- Register as **buyer** to add to cart and place orders (mock checkout).

---
