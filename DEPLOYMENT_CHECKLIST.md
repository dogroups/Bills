# Deployment Checklist for Soofi Attars

## Pre-Deployment Checklist

### ✅ MongoDB Setup
- [ ] MongoDB Atlas account created
- [ ] Cluster created (free tier is fine)
- [ ] Database user created with readWrite permissions
- [ ] Network access configured (0.0.0.0/0 for Vercel)
- [ ] Connection string copied and tested

### ✅ Local Development
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with MongoDB URI and JWT secret
- [ ] Database seeded with initial users (`npm run seed`)
- [ ] Local server tested (`npm run dev`)
- [ ] API health check working (`http://localhost:3000/api/health`)

### ✅ Code Preparation
- [ ] All sensitive data removed from code
- [ ] `.env` file added to `.gitignore`
- [ ] `vercel.json` configuration verified
- [ ] API routes tested locally

### ✅ Vercel Setup
- [ ] Vercel account created
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged into Vercel (`vercel login`)

## Deployment Steps

### 1. Environment Variables in Vercel
```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string

vercel env add JWT_SECRET
# Paste your JWT secret (32+ characters)
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Verify Deployment
- [ ] Deployment successful (check Vercel dashboard)
- [ ] API health endpoint working: `https://your-app.vercel.app/api/health`
- [ ] Test login endpoint with curl or Postman

### 4. Test API Endpoints

**Health Check:**
```bash
curl https://your-app.vercel.app/api/health
```

**Login:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Inventory (with token):**
```bash
curl https://your-app.vercel.app/api/inventory \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Post-Deployment

### ✅ Security
- [ ] Change default admin password
- [ ] Change default cashier password
- [ ] Verify JWT secret is strong and random
- [ ] Review MongoDB network access settings
- [ ] Enable MongoDB Atlas monitoring

### ✅ Frontend Integration
- [ ] Update `API_CONFIG.BASE_URL` in `api-integration.js`
- [ ] Test login from frontend
- [ ] Test inventory operations
- [ ] Test billing and sales creation
- [ ] Verify stock updates work correctly

### ✅ Testing
- [ ] Create test inventory items
- [ ] Create test sale
- [ ] Verify invoice numbering works
- [ ] Check sales reports
- [ ] Test with both admin and cashier roles

### ✅ Monitoring
- [ ] Check Vercel deployment logs
- [ ] Monitor MongoDB Atlas metrics
- [ ] Set up error alerts (optional)
- [ ] Configure backup schedule in MongoDB Atlas

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Check:**
- [ ] Connection string format is correct
- [ ] Database user exists and has permissions
- [ ] Network access allows 0.0.0.0/0
- [ ] Password doesn't contain special characters that need encoding

**Solution:**
```bash
# URL encode special characters in password
# @ becomes %40
# : becomes %3A
# / becomes %2F
```

### Issue: JWT Token Invalid
**Check:**
- [ ] JWT_SECRET is set in Vercel environment variables
- [ ] JWT_SECRET matches between local and production
- [ ] Token is being sent in Authorization header

### Issue: CORS Errors
**Check:**
- [ ] API allows your frontend domain
- [ ] Request includes proper headers
- [ ] Using HTTPS for production

### Issue: 404 on API Routes
**Check:**
- [ ] `vercel.json` is properly configured
- [ ] Routes start with `/api/`
- [ ] Deployment was successful

## Performance Optimization

### ✅ Database
- [ ] Create indexes on frequently queried fields
- [ ] Enable MongoDB Atlas auto-scaling (if needed)
- [ ] Monitor slow queries

### ✅ API
- [ ] Implement caching for inventory (if needed)
- [ ] Add pagination for large datasets
- [ ] Optimize database queries

### ✅ Frontend
- [ ] Minimize API calls
- [ ] Implement loading states
- [ ] Cache inventory data locally
- [ ] Handle offline scenarios

## Backup & Recovery

### ✅ Data Backup
- [ ] MongoDB Atlas automatic backups enabled
- [ ] Export critical data periodically
- [ ] Test restore process

### ✅ Code Backup
- [ ] Code pushed to Git repository
- [ ] Environment variables documented
- [ ] Deployment configuration saved

## Maintenance

### Regular Tasks
- [ ] Review MongoDB Atlas usage
- [ ] Check Vercel usage and limits
- [ ] Update dependencies monthly
- [ ] Review and rotate JWT secret quarterly
- [ ] Backup database monthly
- [ ] Review user access and permissions

### Updates
- [ ] Test updates in development first
- [ ] Use Vercel preview deployments
- [ ] Keep dependencies up to date
- [ ] Monitor for security vulnerabilities

## Production URLs

After deployment, update these:

- **API Base URL:** `https://your-app.vercel.app/api`
- **Frontend URL:** `https://your-app.vercel.app`
- **MongoDB Dashboard:** `https://cloud.mongodb.com`
- **Vercel Dashboard:** `https://vercel.com/dashboard`

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT.io](https://jwt.io/)

---

## ✅ Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Default passwords changed
- [ ] Environment variables set
- [ ] MongoDB secured
- [ ] API endpoints tested
- [ ] Frontend integrated
- [ ] Error handling implemented
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Documentation updated

**🎉 Ready for Production!**

---

**Date Deployed:** _________________

**Deployed By:** _________________

**Vercel URL:** _________________

**MongoDB Cluster:** _________________
