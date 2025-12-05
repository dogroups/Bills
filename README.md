# Soofi Attars - Billing & Inventory Management System

A complete billing and inventory management web application with MongoDB backend, designed for deployment on Vercel.

## Features

- 🔐 **User Authentication** - JWT-based authentication with role-based access (Admin/Cashier)
- 📦 **Inventory Management** - Add, update, and track stock levels
- 🧾 **Billing System** - Create invoices with automatic stock updates
- 📊 **Sales Reports** - Track daily sales and generate reports
- 🔢 **Auto Invoice Numbering** - Automatic invoice sequence per year
- 💾 **MongoDB Database** - Cloud-based data persistence
- 🚀 **Vercel Deployment** - Serverless deployment ready

## Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- LocalStorage for offline capability

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Project Structure

```
d:/Bill/
├── api/
│   └── index.js          # Vercel serverless entry point
├── config/
│   └── db.js             # MongoDB connection
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   ├── User.js           # User model
│   ├── InventoryItem.js  # Inventory model
│   ├── Sale.js           # Sales model
│   └── InvoiceSequence.js # Invoice numbering
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── inventory.js      # Inventory CRUD routes
│   └── sales.js          # Sales & reporting routes
├── index.html            # Dashboard
├── billing.html          # Billing interface
├── inventory.html        # Inventory management
├── app.js                # Frontend JavaScript
├── server.js             # Local development server
├── seed.js               # Database seeding script
├── package.json
├── vercel.json           # Vercel configuration
└── .env.example          # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Create a database user with read/write permissions

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soofi-attars?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
PORT=3000
```

### 4. Seed Initial Users

```bash
node seed.js
```

This creates two default users:
- **Admin**: username: `admin`, password: `admin123`
- **Cashier**: username: `cashier`, password: `cashier123`

### 5. Run Locally

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user (admin only)

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add new item (admin only)
- `PUT /api/inventory/:id` - Update item (admin only)
- `PATCH /api/inventory/:id/stock` - Adjust stock (admin only)
- `DELETE /api/inventory/:id` - Delete item (admin only)

### Sales
- `GET /api/sales` - Get all sales (with optional date filter)
- `POST /api/sales` - Create new sale
- `GET /api/sales/invoice-number` - Get next invoice number
- `POST /api/sales/increment-invoice` - Increment invoice sequence
- `GET /api/sales/summary` - Get sales summary

### Health Check
- `GET /api/health` - API health status

## Deploying to Vercel

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables in Vercel

```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

Or add them through the Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key

### Step 4: Deploy

```bash
vercel --prod
```

### Step 5: Seed Users on Production

After deployment, run the seed script with your production MongoDB:

```bash
node seed.js
```

## Frontend Integration

Update your frontend `app.js` to use the API instead of localStorage. Here's an example:

```javascript
// API Configuration
const API_URL = 'https://your-vercel-app.vercel.app/api';
let authToken = localStorage.getItem('authToken');

// Login Function
async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  if (response.ok) {
    authToken = data.token;
    localStorage.setItem('authToken', authToken);
    return data.user;
  }
  throw new Error(data.message);
}

// Get Inventory
async function getInventory() {
  const response = await fetch(`${API_URL}/inventory`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return await response.json();
}

// Create Sale
async function createSale(saleData) {
  const response = await fetch(`${API_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(saleData)
  });
  return await response.json();
}
```

## Security Notes

⚠️ **Important Security Measures:**

1. **Change Default Passwords** - Immediately change the default admin/cashier passwords after first login
2. **Use Strong JWT Secret** - Generate a strong random string for JWT_SECRET
3. **HTTPS Only** - Vercel provides HTTPS by default, ensure all API calls use HTTPS
4. **Environment Variables** - Never commit `.env` file to version control
5. **MongoDB Security** - Enable IP whitelisting and use strong database passwords

## MongoDB Atlas Configuration

1. **Network Access**: Add `0.0.0.0/0` to allow Vercel's dynamic IPs (or use MongoDB's Vercel integration)
2. **Database Access**: Create a user with `readWrite` permissions
3. **Connection String**: Use the SRV connection string format

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### Vercel Deployment Issues
- Check environment variables are set correctly
- Review Vercel deployment logs
- Ensure `vercel.json` is properly configured

### CORS Issues
- The backend is configured to allow all origins
- For production, update CORS settings in `api/index.js`

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
