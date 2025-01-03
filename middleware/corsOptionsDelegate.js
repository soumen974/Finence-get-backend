const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  
  // For authenticated CRUD operations
  if (req.header('Origin') === 'http://localhost:3000' || 
      req.header('Origin') === 'https://financeget.vercel.app') {
    corsOptions = {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 200
    }
  } 
  
  // For any other origin, deny access
  else {
    corsOptions = {
      origin: false
    }
  }
  
  callback(null, corsOptions);
}
module.exports = corsOptionsDelegate;