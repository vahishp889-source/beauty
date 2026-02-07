# BEAUTY - Luxury Makeup E-Commerce Platform

A premium full-stack e-commerce web application for selling makeup products with a stunning dark-themed design inspired by Sephora, Fenty Beauty, and MAC Cosmetics.

![BEAUTY Luxury E-commerce](https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=1200)

## ✨ Features

### 🎨 Design System
- **Dark Theme**: Matte black (#0F0F0F) primary color
- **Rose Gold Accents**: Gradient accents in rose gold and deep crimson
- **Glassmorphism**: Beautiful glass-effect cards with backdrop blur
- **Typography**: Playfair Display (headings) + Inter (body)
- **Micro-interactions**: Smooth animations with Framer Motion

### 👩‍💼 User Interface
- **Landing Page**: Full-width hero section with animated backgrounds
- **Product Catalog**: Filterable grid layout with sorting options
- **Product Details**: Large image previews, shade selectors, quantity controls
- **Shopping Cart**: Slide-in cart panel with quantity management
- **Checkout**: Multi-step checkout with payment UI mock
- **User Profile**: Order history, wishlist, account settings
- **Authentication**: Login/Register with social login options

### 🛠 Admin Dashboard
- **Analytics**: Sales, revenue, and user statistics
- **Product Management**: CRUD operations with image upload support
- **Order Management**: Track and update order statuses
- **User Management**: View and manage customer accounts

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Zustand** - Lightweight state management
- **React Hot Toast** - Beautiful toast notifications
- **Swiper** - Modern touch slider

### Backend
- **Node.js + Express** - Server runtime and framework
- **MongoDB + Mongoose** - Database and ODM
- **JSON Web Token (JWT)** - Authentication
- **Bcrypt.js** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/beauty.git
   cd beauty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your MongoDB URI and other configurations.

4. **Seed the database (optional)**
   ```bash
   # Start the server first, then:
   curl -X POST http://localhost:5000/api/seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 5000).

## 🎯 Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero section |
| `/products` | Product catalog with filters |
| `/products/[id]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/login` | Authentication page |
| `/profile` | User account dashboard |
| `/admin` | Admin dashboard |

## 🎨 Design Highlights

### Color Palette
- **Primary**: Matte Black (#0F0F0F)
- **Accent**: Rose Gold (#B76E79)
- **Secondary**: Deep Crimson (#8B1538)
- **Backgrounds**: Glass gradients with backdrop blur

### Typography
```css
font-display: 'Playfair Display', serif;  /* Headings */
font-body: 'Inter', sans-serif;          /* Body text */
```

### Animations
- Floating product cards with hover lift effects
- Smooth page transitions with fade/blur
- Magnetic button interactions
- Parallax hero sections
- Loading shimmer effects

## 🔐 Admin Credentials

After seeding the database:
- **Email**: admin@beauty.com
- **Password**: admin123

## 📁 Project Structure

```
beauty/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── Navigation.jsx
│   │   └── Hero.jsx
│   ├── products/          # Products pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout flow
│   ├── login/             # Authentication
│   ├── profile/           # User dashboard
│   ├── admin/             # Admin dashboard
│   ├── store/             # Zustand stores
│   └── globals.css        # Global styles
├── server/                # Express backend
│   └── index.js          # Server entry point
├── tailwind.config.js    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── package.json
```

## 🛣 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order status

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:
```javascript
colors: {
  primary: { DEFAULT: '#0F0F0F' },
  accent: { DEFAULT: '#B76E79' },
  // ... add more colors
}
```

### Fonts
The project uses Google Fonts. Update `app/globals.css` to change fonts.

## 📱 Responsive Design

Fully optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🚀 Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Render/Railway/Heroku)
1. Set environment variables
2. Deploy the `server/` directory
3. Update frontend API URL

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion
