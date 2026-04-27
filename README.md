# OmniStock-Flow

OmniStock-Flow is a full-stack MERN inventory, warehouse, store, supplier, payments, and invoicing platform with JWT authentication, role-based dashboards, and a production-style project structure.

## Tech stack

- Frontend: React + Vite + Redux Toolkit + Tailwind CSS + Axios
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT access/refresh token
- Payments: Razorpay with mock-safe fallback
- Documents: PDF invoice generation
- Media: Cloudinary-ready upload middleware
- Security: bcryptjs, helmet, cors, express-rate-limit, cookie-parser, dotenv

## Roles

- `ADMIN`
- `STORE_MANAGER` - shown in the UI as Customer / Store Owner
- `WAREHOUSE_MANAGER`
- `SUPPLIER`

## Warehouse Manager access

| Module | Access |
| --- | --- |
| Dashboard | View warehouse stock summary, incoming/outgoing stock, and low-stock alerts |
| Product Management | Add, view, and update product details; delete is Admin-only |
| Stock Management | Add stock, update quantity, and adjust damaged/returned stock through product stock edits |
| Stock Transfer | Transfer stock from warehouse to store and warehouse to warehouse |
| Orders | View store orders visible to warehouse teams and prepare dispatch |
| Delivery Status | Update warehouse delivery state: Packed, Dispatched, Delivered |
| Low Stock Alerts | View products below threshold and respond to replenishment needs |
| Supplier Deliveries | Receive supplier deliveries and automatically add delivered quantity to warehouse stock |
| Invoices/Receipts | View generated invoices related to warehouse dispatch and receiving |
| Reports | Generate/view stock, transfer, and low-stock reports |
| Notifications | Receive alerts for new orders, low stock, delivery, invoice, and payment updates |
| Profile | Update own profile and password |

## Default admin seed

- Email: `admin@omnistock.com`
- Password: `Admin@123`

## Default supplier seed

- Email: `supplier@omnistock.com`
- Password: `Supplier@123`

## Backend setup

1. Open a terminal in the project root.
2. Copy [server/.env.example](/d:/OmniStock-Flow/server/.env.example) to `server/.env` and fill in values.
3. Install dependencies:

```bash
cd server
npm install
```

4. Seed the default admin:

```bash
npm run seed:admin
```

Seed the default supplier:

```bash
npm run seed:supplier
```

Or seed both defaults together:

```bash
npm run seed:defaults
```

5. Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## Frontend setup

1. Copy [client/.env.example](/d:/OmniStock-Flow/client/.env.example) to `client/.env`.
2. Install dependencies:

```bash
cd client
npm install
```

3. Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Helpful root scripts

From the project root:

```bash
npm run dev:server
npm run dev:client
npm run seed:admin
npm run seed:supplier
npm run seed:defaults
```

## Key backend features

- Direct registration and password reset without OTP verification
- JWT login with access token, refresh token persistence, and secure cookies
- Refresh-token rotation endpoint for silent session renewal on the frontend
- Role-based authorization middleware
- Lightweight request validation middleware on core auth and inventory routes
- Product, warehouse, store, order, stock transfer, invoice, payment, and notification APIs
- Automatic invoice creation after payment verification
- PDF invoice download endpoint
- Database-backed notifications for order/payment/invoice/status events

## Key frontend features

- Responsive role-specific dashboards
- Protected routes and role routes
- Redux slices for auth, users, products, orders, payments, invoices, stock, and notifications
- Razorpay-ready checkout flow with graceful mock verification fallback
- Invoice download actions and notification center

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `CRUD /api/products`
- `CRUD /api/warehouses`
- `CRUD /api/stores`
- `POST /api/stock-transfer/warehouse-to-store`
- `POST /api/stock-transfer/warehouse-to-warehouse`
- `GET /api/stock-transfer/history`
- `POST /api/payments/create-order`
- `POST /api/payments/verify-payment`
- `GET /api/orders`
- `POST /api/orders`
- `PUT /api/orders/:id/status`
- `GET /api/invoices`
- `GET /api/invoices/:id/download`
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `GET /api/reports/dashboard`

## Notes

- SMS sending currently uses a placeholder logger unless Twilio credentials are configured.
- Razorpay order creation automatically falls back to a mock order object if keys are missing during local development.
- Product images upload to Cloudinary when configured, otherwise local development stores them under `server/uploads/products`.
