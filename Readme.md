# Sweet Shop Management System

Name :- Karan Aggarwal
Email :- mrkaran2k5@gmail.com

A full-stack web application for managing a sweet shop inventory with user authentication, product management, and purchase functionality.

### Screenshots

![banner](https://raw.githubusercontent.com/Myself-Wrathh/Karan-Incubyte-Assign/refs/heads/main/a.png)

![banner](https://raw.githubusercontent.com/Myself-Wrathh/Karan-Incubyte-Assign/refs/heads/main/b.png)

![banner](https://raw.githubusercontent.com/Myself-Wrathh/Karan-Incubyte-Assign/refs/heads/main/c.png)

![banner](https://raw.githubusercontent.com/Myself-Wrathh/Karan-Incubyte-Assign/refs/heads/main/d.png)

## Tech Stack

### Backend

<img src="https://skillicons.dev/icons?i=nodejs,mongodb" />

- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- ES Modules syntax

### Frontend

<img src="https://skillicons.dev/icons?i=nextjs,ts,tailwind" />

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components

### Version Control & Deployment

<img src="https://skillicons.dev/icons?i=git,github,vercel" />

- **Git** with App Router
- **GitHub**
- **Vercel - Frontend**
- **Render - Backend**

## Features

### User Features

- User registration and login with JWT authentication
- Browse all available sweets
- Search sweets by name, category, or price range
- Filter sweets by multiple criteria
- Purchase sweets (decreases inventory)
- Real-time stock status display
- Responsive design for all devices

### Admin Features

- Add new sweets to inventory
- Update sweet details (name, category, price, quantity, description, image)
- Delete sweets from inventory
- Restock sweets (increase quantity)
- View all sweets in admin panel
- Protected admin routes

## Project Structure

```
sweet-shop/
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/
│ │ ├── auth.controller.js # Authentication logic
│ │ └── sweet.controller.js # Sweet CRUD operations
│ ├── middleware/
│ │ ├── auth.middleware.js # JWT verification & role check
│ │ └── validate.js # Request validation
│ ├── models/
│ │ ├── user.model.js # User schema
│ │ └── sweet.model.js # Sweet schema
│ ├── routes/
│ │ ├── auth.routes.js # Auth endpoints
│ │ └── sweet.routes.js # Sweet endpoints
│ └── index.js # Express app entry
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│
└── frontend/
├── app/
│ ├── dashboard/
│ │ ├── admin/
│ │ │ └── page.tsx # Admin panel
│ │ ├── page.tsx # Main dashboard
│ ├── login/
│ │ └── page.tsx # Login page
│ ├── register/
│ │ └── page.tsx # Registration page
│ ├── layout.tsx
│ ├── favicon.ico
│ ├── page.tsx # Home (redirects)
│ └── globals.css # Global styles
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── navbar.tsx # Navigation bar
│ ├── sweet-card.tsx # Sweet display card
│ ├── search-filter.tsx # Search/filter UI
│ ├── sweet-form-dialog.tsx # Add/Edit sweet form
│ └── restock-dialog.tsx # Restock inventory form
├── lib/
│ ├── api.ts # API client functions
│ ├── auth-context.tsx # Auth state management
│ └── utils.ts # Utility functions
├── .env
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file.

4. Configure your environment variables in `.env`:

| Variable           | Description                |
| :----------------- | :------------------------- |
| `PORT`             | 3001 or any other          |
| `MONGODB_URI`      | local or MongoDB Atlas url |
| JWT_SECRET         | secure_random_secret_key   |
| REFRESH_KEY_SECRET | secure_random_secret_key   |
| ACCESS_KEY_SECRET  | secure_random_secret_key   |
| NODE_ENV           | development                |
| JWT_EXPIRES_IN     | 7d                         |
| CORS_PATH          | "http://localhost:3000"    |

5. Start MongoDB ( if running locally else no need):

   ```bash
   mongod
   ```

6. Start the backend server:

   ```bash

   # Development mode with auto-reload

   npm run dev

   # Production mode

   npm start
   ```

   The API will be available at `http://localhost:3001/api`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file.

4. Configure your environment variables (should match backend):

| Variable              | Description               |
| :-------------------- | :------------------------ |
| `NEXT_PUBLIC_API_URL` | http://localhost:3001/api |

5. Start the development server:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user

  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Sweets (Protected - Requires Authentication)

- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets

  - Query params: `name`, `category`, `minPrice`, `maxPrice`
  - Example: `/api/sweets/search?category=chocolate&maxPrice=5`

- `POST /api/sweets` - Add new sweet (Admin only)

  ```json
  {
    "name": "Chocolate Bar",
    "category": "chocolate",
    "price": 2.99,
    "quantity": 50,
    "description": "Delicious milk chocolate",
    "imageUrl": "https://example.com/image.jpg"
  }
  ```

- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory (Protected)

- `POST /api/sweets/:id/purchase` - Purchase sweet (decrease quantity)

  ```json
  {
    "quantity": 1
  }
  ```

- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)
  ```json
  {
    "quantity": 20
  }
  ```

## Creating an Admin User

By default, new users are registered with the "user" role. To create an admin:

### Option 1: During Registration (for testing)

Modify the registration request to include `"role": "admin"`:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Option 2: Update Existing User in MongoDB

```javascript
// Connect to MongoDB
mongo

// Switch to database
use sweetshop

// Update user role
db.users.updateOne(
{ email: "admin@example.com" },
{ $set: { role: "admin" } }
)
```

## Testing

### Manual Testing

1. Start both backend and frontend servers
2. Register a new user at `http://localhost:3000/register`
3. Login at `http://localhost:3000/login`
4. Browse sweets in the dashboard
5. Use search/filter functionality
6. Purchase sweets
7. Create an admin user (see above)
8. Login as admin
9. Navigate to admin panel
10. Test add, edit, delete, and restock operations

### Test User Credentials

After setting up, you can create test accounts:

- Regular User: `user@test.com` / `password123`
- Admin User: `admin@test.com` / `admin123`

## Building for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

The production build will be optimized and ready for deployment.

## Deployment Options

### Backend Deployment

- **Render**: Deploy Node.js backend on render

### Frontend Deployment

<img src="https://skillicons.dev/icons?i=vercel" />

- **Vercel**: Optimized for Next.js

### Database

- **MongoDB Atlas**: Cloud-hosted MongoDB (free tier available)
- **Local MongoDB**: For development only

## My AI Usage

### AI Tools Used

- **ChatGPT**: Used for generating the initial project structure, boilerplate code, and UI components
- **GitHub Copilot**: Assisted with code completion and writing useful comments.

### How AI Was Used

1. **Project Structure**: Used ChatGPT to generate the initial folder structure for both backend and frontend following best practices

```
Used my previous projects structure
```

- Generated comprehensive README files
- Created setup instructions
- Documented API endpoints

### Reflection on AI Impact

Using AI tools significantly accelerated the development process:

**Positive Impacts**:

- Rapid prototyping and boilerplate generation
- Consistent code style and structure
- Comprehensive error handling patterns
- Quick implementation of best practices
- Time saved on repetitive tasks

**Learning Points**:

- AI-generated code still requires review and refinement
- Understanding the underlying concepts is crucial for debugging
- AI tools excel at standard patterns but may need customization
- Human oversight ensures code quality and security

The combination of AI assistance and human expertise resulted in a production-ready application built efficiently while maintaining code quality and best practices.

--- **_Have a Good Day_** **😊** ---