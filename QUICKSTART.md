# 🍦 ICE B2B Platform - Quick Start Guide

**Project Location:** `C:\Users\devel\OneDrive\Desktop\ice`

---

## ⚡ 5-Minute Setup

### Step 1: Create Database (2 min)
```bash
# Open Command Prompt or PowerShell
psql -U postgres
```
```sql
CREATE DATABASE ice_db;
\q
```

### Step 2: Setup Backend (2 min)
```bash
cd C:\Users\devel\OneDrive\Desktop\ice\backend

# Copy and edit environment file
copy .env.example .env
notepad .env
# ↑ Update DATABASE_URL line:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/ice_db?schema=public"

# Install and setup
npm install
npm run prisma:generate
npm run migrate

# Start backend
npm run dev
```

**✅ Backend running at:** http://localhost:5000

### Step 3: Setup Frontend (1 min)
```bash
# Open new terminal
cd C:\Users\devel\OneDrive\Desktop\ice\frontend

# Copy env (no changes needed)
copy .env.example .env

# Install and start
npm install
npm start
```

**✅ Frontend running at:** http://localhost:3000

---

## 🎯 Test It Works

### Test 1: API Health Check
Open browser: http://localhost:5000/api/health

Should see: `{"status":"OK","message":"ICE B2B API is running"}`

### Test 2: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@shop.com\",\"password\":\"test123\",\"businessName\":\"Test Shop\",\"primaryContactName\":\"John Doe\",\"phone\":\"+919876543210\",\"businessAddress\":\"Mumbai\",\"businessType\":\"RETAIL_SHOP\"}"
```

Should see: `{"message":"Registration successful. Awaiting admin approval."}`

### Test 3: Create Admin User

1. Open Prisma Studio:
```bash
cd backend
npm run prisma:studio
```

2. Browser opens at http://localhost:5555
3. Click **User** model
4. Click **Add record**
5. Fill in:
   - email: `admin@ice.com`
   - password: `$2a$10$...` (copy hashed password from the test@shop.com user)
   - role: `ADMIN`
   - status: `APPROVED`
   - businessName: `Admin`
   - primaryContactName: `Admin User`
   - phone: `+919876543210`
   - businessAddress: `HQ`
   - businessType: `OTHER`
6. Click **Save**

### Test 4: Login

```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@ice.com\",\"password\":\"test123\"}"
```

Should get back a JWT token!

---

## 📂 Project Files

```
ice/
│
├── 📄 README.md              # Project overview
├── 📄 SETUP.md               # Detailed setup
├── 📄 PROJECT_SUMMARY.md     # What's been created
├── 📄 QUICKSTART.md          # This file
├── 📄 .gitignore             # Git ignore rules
├── 📄 package.json           # Root scripts
│
├── 📁 frontend/              # React App
│   ├── .env.example          # Template
│   ├── package.json          # Dependencies
│   ├── tailwind.config.js    # Design tokens
│   ├── public/
│   └── src/
│       ├── index.js          # Entry point
│       ├── index.css         # Tailwind + fonts
│       ├── App.js            # Main component
│       ├── api/
│       │   └── axios.js      # ✅ API client
│       ├── components/       # UI components
│       ├── pages/            # Pages
│       ├── hooks/            # Custom hooks
│       ├── store/            # State management
│       └── utils/            # Helpers
│
├── 📁 backend/               # Express API
│   ├── .env.example          # Template
│   ├── package.json          # Dependencies
│   ├── prisma/
│   │   └── schema.prisma     # ✅ Database schema (9 models)
│   ├── src/
│   │   ├── server.js         # ✅ Express app
│   │   ├── config/
│   │   │   └── database.js   # ✅ Prisma client
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # ✅ JWT auth
│   │   ├── controllers/
│   │   │   ├── auth.controller.js  # ✅ Register/Login
│   │   │   └── product.controller.js  # ✅ Product CRUD
│   │   └── routes/
│   │       ├── auth.routes.js      # ✅ Auth endpoints
│   │       ├── product.routes.js   # ✅ Product endpoints
│   │       ├── order.routes.js     # ⏳ To implement
│   │       └── rfq.routes.js       # ⏳ To implement
│   └── uploads/              # File uploads
│
└── 📁 docs/                  # Documentation
```

---

## 🎨 Design System

**Already configured in Tailwind!**

### Colors
```javascript
// Primary (warm orange - ice cream feel)
bg-primary-500     // #FF8659
text-primary-600   // #E6754D

// Secondary (cool blue)
bg-secondary-500   // #0EA5E9

// Status colors
bg-success         // Green
bg-error           // Red
bg-warning         // Yellow
```

### Typography
```javascript
font-sans          // Inter (body text)
font-display       // Sora (headings)

text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
```

### Shadows
```javascript
shadow-level1      // Cards, small elements
shadow-level2      // Dropdowns, popovers
shadow-level3      // Modals, drawers
```

---

## 🚀 Available Scripts

### Root (from `/ice`)
```bash
npm run dev              # Run both frontend + backend
npm run install:all      # Install all dependencies
```

### Backend (from `/backend`)
```bash
npm run dev              # Start with nodemon (auto-reload)
npm start                # Start production
npm run migrate          # Run Prisma migrations
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open DB GUI
```

### Frontend (from `/frontend`)
```bash
npm start                # Start dev server (port 3000)
npm run build            # Build for production
npm test                 # Run tests
```

---

## 🗄️ Database Schema

**9 Models Created:**

1. **User** - Buyers & Admins (with approval workflow)
2. **Product** - Ice cream SKUs (stock, pricing)
3. **TieredPricing** - Volume-based pricing
4. **CustomPricing** - Buyer-specific prices
5. **Order** - Customer orders (with payment states)
6. **OrderItem** - Order line items
7. **Invoice** - Generated PDFs
8. **Address** - Shipping addresses
9. **RFQ** - Request for Quote (negotiation)
10. **Settings** - App configuration

---

## 📝 Environment Variables

### Backend `.env`
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/ice_db"
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp (optional for now)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### Frontend `.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_NUMBER=+919876543210
REACT_APP_SUPPORT_EMAIL=support@ice.com
```

---

## ✅ What's Working

- ✅ Database schema (9 models)
- ✅ User registration (buyer accounts)
- ✅ User login (JWT authentication)
- ✅ Protected routes (middleware)
- ✅ Role-based access (ADMIN/BUYER)
- ✅ Product CRUD (get all, get by SKU, create, update)
- ✅ Custom pricing per buyer
- ✅ Stock management (reserved stock logic)
- ✅ React app with Tailwind CSS
- ✅ API client with auto-auth

---

## 🔜 Next: Build the UI

### 1. Create ProductCard Component
```bash
cd frontend/src/components/buyer
# Create ProductCard.jsx
```

### 2. Create Catalog Page
```bash
cd frontend/src/pages/buyer
# Create Catalog.jsx
```

### 3. Setup React Router
```bash
# Edit src/App.js
# Add routes for:
# - / (Catalog)
# - /login
# - /register
# - /cart
# - /orders
```

### 4. Implement Cart
```bash
# Create Zustand store for cart
# Create CartDrawer component
# Add "Add to Cart" logic
```

---

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check credentials in backend/.env
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ice_db"
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Prisma Client Not Found
```bash
cd backend
npm run prisma:generate
```

---

## 📞 Support

**Created by:** Claude (AI Assistant)
**Date:** October 10, 2025
**Project:** ICE B2B Ice Cream Ordering Platform

For help:
1. Check [SETUP.md](SETUP.md) for detailed instructions
2. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete overview
3. Review code comments in files

---

## 🎉 You're All Set!

The project foundation is complete. Start building the UI components and implementing the features!

**Happy Coding! 🚀🍦**
