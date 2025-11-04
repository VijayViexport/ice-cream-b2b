# ICE B2B Platform - Setup Guide

Complete setup guide for the ICE B2B ice cream ordering platform.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn**
- **Git** (optional, for version control)

## 🚀 Quick Start

### 1. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ice_db;

# Create user (optional)
CREATE USER ice_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ice_db TO ice_user;

# Exit
\q
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and update DATABASE_URL
# DATABASE_URL="postgresql://ice_user:your_password@localhost:5432/ice_db?schema=public"

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run migrate

# (Optional) Seed database with sample data
npm run seed

# Start development server
npm run dev
```

The backend API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Copy environment file
cp .env.example .env

# Edit .env if needed (API URL already set to http://localhost:5000/api)

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📂 Project Structure

```
ice/
├── frontend/                 # React.js application
│   ├── public/
│   ├── src/
│   │   ├── api/             # API client & endpoints
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── buyer/       # Buyer-specific components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   └── auth/        # Auth components
│   │   ├── pages/           # Page components
│   │   │   ├── buyer/       # Buyer pages
│   │   │   ├── admin/       # Admin pages
│   │   │   └── auth/        # Auth pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── store/           # Zustand store
│   │   └── assets/          # Images, icons
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express.js API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Seed data
│   ├── src/
│   │   ├── config/          # Config files (database)
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── uploads/             # File uploads
│   └── package.json
│
├── docs/                     # Documentation
│   └── DESIGN_SYSTEM_SPECIFICATION.md
│
├── package.json              # Root package.json (monorepo scripts)
├── README.md
└── SETUP.md                  # This file
```

## 🗄️ Database Schema

The project uses Prisma ORM with PostgreSQL. Key models include:

- **User** - Buyer & Admin accounts
- **Product** - Ice cream SKUs
- **Order** - Customer orders
- **OrderItem** - Order line items
- **RFQ** - Request for Quote
- **CustomPricing** - Buyer-specific pricing
- **Invoice** - Generated invoices
- **Address** - Shipping addresses
- **Settings** - App settings

See `backend/prisma/schema.prisma` for full schema.

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/ice_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_NUMBER=+919876543210
REACT_APP_SUPPORT_EMAIL=support@ice.com
REACT_APP_SUPPORT_PHONE=+919876543210
```

## 📝 Available Scripts

### Root (Monorepo)

```bash
npm run install:all      # Install all dependencies
npm run dev              # Run both frontend & backend
npm run build            # Build frontend for production
```

### Backend

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm run migrate          # Run database migrations
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run seed             # Seed database with sample data
```

### Frontend

```bash
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run tests
```

## 🧪 Testing the API

### Create Admin User (via Prisma Studio)

1. Run `npm run prisma:studio` in backend
2. Open http://localhost:5555
3. Navigate to User model
4. Add new record with `role: "ADMIN"` and `status: "APPROVED"`

### Test API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Register buyer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "password123",
    "businessName": "Test Shop",
    "primaryContactName": "John Doe",
    "phone": "+919876543210",
    "businessAddress": "123 Main St, Mumbai",
    "businessType": "RETAIL_SHOP"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "buyer@example.com",
    "password": "password123"
  }'
```

## 🎨 Design System

The project follows the ICE Design System with:

- **Color Palette**: Primary (warm orange), Secondary (sky blue)
- **Typography**: Inter (body), Sora (headings)
- **Spacing**: 4px base scale
- **Components**: Fully specified in docs/DESIGN_SYSTEM_SPECIFICATION.md

Tailwind config is pre-configured with all design tokens.

## 📦 Key Dependencies

### Frontend
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `react-hook-form` - Form handling
- `tailwindcss` - CSS framework

### Backend
- `express` - Web framework
- `@prisma/client` - ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email sending
- `twilio` - WhatsApp integration
- `pdfkit` - PDF generation

## 🚧 Next Steps

1. **Seed Database**: Create sample products and admin user
2. **Build Components**: Implement ProductCard, Header, Cart components
3. **Create Pages**: Catalog, Checkout, Dashboard pages
4. **Implement Features**: Cart, Orders, RFQ flows
5. **Add WhatsApp Integration**: Configure Twilio
6. **Setup Email**: Configure SMTP for notifications
7. **PDF Invoices**: Implement invoice generation
8. **Testing**: Write unit & integration tests
9. **Deployment**: Deploy to production

## 📚 Additional Resources

- [Design System Spec](docs/DESIGN_SYSTEM_SPECIFICATION.md) - Complete design & component specs
- [Prisma Docs](https://www.prisma.io/docs/) - Prisma ORM
- [React Query Docs](https://tanstack.com/query/latest) - Data fetching
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Styling

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Ensure database exists
psql -U postgres -c "\l"
```

### Prisma Client Not Generated

```bash
cd backend
npm run prisma:generate
```

### Port Already in Use

```bash
# Change PORT in backend/.env or kill process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

## 📞 Support

For issues or questions, contact the development team or open an issue in the project repository.

---

**Happy Coding! 🍦**
