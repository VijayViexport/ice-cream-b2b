# ICE - B2B Ice Cream Ordering Platform

A complete B2B ordering platform for ice cream factory direct sales to shops, restaurants, and distributors.

## Tech Stack

### Frontend
- **React.js** (v18+)
- **React Router** (navigation)
- **Axios** (API calls)
- **Tailwind CSS** (styling)
- **React Query** (data fetching & caching)
- **Zustand** (state management)
- **React Hook Form** (forms)
- **Framer Motion** (animations)

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** (database)
- **Prisma** (ORM)
- **JWT** (authentication)
- **Nodemailer** (email notifications)
- **Twilio** (WhatsApp integration)
- **PDFKit** (invoice generation)

### DevOps
- **Docker** (containerization)
- **Nginx** (reverse proxy)
- **PM2** (process management)

## Project Structure

```
ice/
├── frontend/          # React.js application
├── backend/           # Express.js API server
├── database/          # PostgreSQL schemas & migrations
├── docs/              # Design specs & documentation
└── docker/            # Docker configuration
```

## Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone & Install**
```bash
cd ice
npm run install:all
```

2. **Setup Database**
```bash
cd database
npm run migrate
npm run seed
```

3. **Environment Variables**
```bash
# Copy example env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

4. **Run Development**
```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Features

### Buyer Features
- Browse catalog with filters & search
- Product detail with tiered pricing
- Shopping cart with quantity management
- Request quote (WhatsApp + internal RFQ)
- Checkout with offline payment
- Order tracking & history
- Invoice downloads
- Repeat orders

### Admin Features
- Order management (mark paid, dispatch, track)
- Inventory management (SKU CRUD, stock levels)
- Customer management (approve registrations, custom pricing)
- RFQ queue (send quotes, negotiate)
- Invoice generation (PDF)
- Reports & analytics
- Settings (payment instructions, lead times)

## Documentation

See [docs/DESIGN_SYSTEM_SPECIFICATION.md](docs/DESIGN_SYSTEM_SPECIFICATION.md) for complete design system, component specs, and implementation guide.

## License

Proprietary - All rights reserved
