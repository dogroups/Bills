# Quick Start Guide - Soofi Attars

## 🚀 Quick Deployment to Vercel

### Prerequisites
- Node.js installed (v14 or higher)
- MongoDB Atlas account (free tier works)
- Vercel account (free)

### Step-by-Step Deployment

#### 1️⃣ Setup MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `soofi-attars`

#### 2️⃣ Install Dependencies

```bash
cd d:/Bill
npm install
```

#### 3️⃣ Setup Environment Variables

Create a `.env` file:

```bash
# Copy the example file
copy .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/soofi-attars?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_min_32_characters_long
NODE_ENV=production
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 4️⃣ Seed Initial Users

```bash
npm run seed
```

✅ This creates:
- Admin user: `admin` / `admin123`
- Cashier user: `cashier` / `cashier123`

#### 5️⃣ Test Locally (Optional)

```bash
npm run dev
```

Visit `http://localhost:3000/api/health` - you should see `{"status":"OK"}`

#### 6️⃣ Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

During deployment, Vercel will ask you to add environment variables. Add:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key

#### 7️⃣ Configure MongoDB Network Access

In MongoDB Atlas:
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

⚠️ **Note**: For production, you should restrict this to Vercel's IP ranges.

#### 8️⃣ Update Frontend

Your Vercel deployment URL will be something like: `https://your-app.vercel.app`

You'll need to update your frontend to call this API instead of using localStorage.

---

## 📱 Testing the API

### Using curl:

**Login:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Inventory:**
```bash
curl https://your-app.vercel.app/api/inventory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman:

1. Import the API endpoints
2. Set Authorization header: `Bearer YOUR_TOKEN`
3. Test all endpoints

---

## 🔧 Common Issues & Solutions

### Issue: "MongoServerError: bad auth"
**Solution**: Check your MongoDB username and password in the connection string

### Issue: "Cannot connect to MongoDB"
**Solution**: 
- Verify Network Access in MongoDB Atlas allows 0.0.0.0/0
- Check your connection string format
- Ensure database user exists with proper permissions

### Issue: "JWT Secret not defined"
**Solution**: Add `JWT_SECRET` to your Vercel environment variables

### Issue: CORS errors in frontend
**Solution**: The API allows all origins by default. If you still get CORS errors, check your request headers.

---

## 📊 Next Steps

1. **Change Default Passwords**: Login and change admin/cashier passwords
2. **Add Inventory Items**: Use the inventory management interface
3. **Test Billing**: Create a test invoice
4. **Customize**: Update shop details in HTML files
5. **Secure**: Restrict MongoDB network access to Vercel IPs only

---

## 🎯 API Endpoints Quick Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/inventory` | Get all items | Yes |
| POST | `/api/inventory` | Add item | Admin |
| GET | `/api/sales` | Get sales | Yes |
| POST | `/api/sales` | Create sale | Yes |
| GET | `/api/sales/invoice-number` | Next invoice # | Yes |

---

## 💡 Pro Tips

1. **Backup**: MongoDB Atlas provides automatic backups
2. **Monitoring**: Use Vercel Analytics to monitor API performance
3. **Logs**: Check Vercel deployment logs for debugging
4. **Security**: Rotate JWT secret periodically
5. **Testing**: Test in development before deploying to production

---

## 📞 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review Vercel deployment logs
- Check MongoDB Atlas monitoring
- Verify environment variables are set correctly

---

**🎉 Congratulations! Your billing system is now deployed!**
