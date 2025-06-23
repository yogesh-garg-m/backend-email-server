const express = require('express');
const emailRoutes = require('./routes/emailRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use((req,res,next)=>{
  const unprotectedPaths = [/^\/get-user-email\/[^\/]+$/]; // Regex match

  const isUnprotected = unprotectedPaths.some((pattern) =>
    pattern.test(req.path)
  );
  if (isUnprotected) return next();

  const apiKey = req.headers['x-api-key'];
  if(apiKey!== process.env.SUPER_SECRET){
    return res.status(401).json({message: 'Unauthorized'});
  }
  next();
})
// Mount email routes
app.use('/', emailRoutes);
// Mount event routes
app.use('/api', eventRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});