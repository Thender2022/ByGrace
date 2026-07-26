# ByGrace Skateboards
### www.bygraceskate.com

A custom e-commerce platform for skateboard products built with Next.js, featuring a headless architecture with a database backend.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with ISR support
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Backend & Services
- **Custom E-Commerce Engine** - Built from scratch with Next.js API routes
- **Database** - PostgreSQL (or your database choice) - Product and customer data storage
- **Stripe** - Payment processing
- **Email Service** - Order confirmations and notifications

### Deployment
- **Vercel** (Recommended) - Hosting and automatic deployments

## ✨ Features

### Current Implementation
- ✅ Product pages with ISR (Incremental Static Regeneration)
- ✅ Custom product management system
- ✅ Stripe payment integration
- ✅ Webhook handling for payment events
- ✅ Add to cart functionality
- ✅ Checkout process with shipping information
- ✅ Order management
- ✅ Environment variable configuration
- ✅ Type-safe API routes
- ✅ Test mode support for development

### Coming Soon
- ⏳ Database integration (PostgreSQL)
- ⏳ Customer authentication
- ⏳ Order history
- ⏳ Admin dashboard
- ⏳ Inventory management
- ⏳ Email notifications for orders

## 📦 Project Structure


## 🛒 E-Commerce Flow
- Browse Products: Customers view skateboard products
- Add to Cart: Products are added to shopping cart
- Checkout: Customer enters shipping and payment information
- Payment: Stripe processes the payment securely
- Order Confirmation: Customer receives order confirmation

## 🗺️ Roadmap
- PostgreSQL database integration
- Customer authentication (Clerk or NextAuth)
- Order history for customers
- Admin dashboard for store management
- Inventory management
- Email notifications (order confirmations, shipping updates)
- Product categories and filtering
- Search functionality
- Reviews and ratings

# Clone the repository
git clone https://github.com/Thender2022/ByGrace.git
cd bygrace

# Install dependencies
npm install or bun install
# Set up environment variables
cp .env.example .env.local
# Run development server
npm run dev
# or
bun dev