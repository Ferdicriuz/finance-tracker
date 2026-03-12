

# Finance Tracker API
Backend API for tracking personal finances: signup, login, and balance tracking.

## Installation

1. Clone repo:
   git clone https://github.com/ferdicriuz/finance-tracker.git
2. Install dependencies:
   npm install
3. Create `.env` in root:
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
4. Run dev server:
   npm run dev
5. Run tests:
   npm test

## API Endpoints

- POST /api/auth/signup → Register new user
- POST /api/auth/login → Login user
- GET /api/auth/me → Get current user (protected)

## Technologies

- Node.js
- Express
- MongoDB / Mongoose
- JWT for authentication
- bcrypt for password hashing

### Transactions

- POST /api/transactions → Create transaction
- GET /api/transactions → List transactions (pagination & filter)
- PUT /api/transactions/:id → Update transaction
- DELETE /api/transactions/:id → Delete transaction

## Author
Eneanya ferdinand