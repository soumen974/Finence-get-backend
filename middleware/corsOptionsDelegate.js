const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  
  // For authenticated CRUD operations
  if (req.header('Origin') === 'http://localhost:5173' || 
      req.header('Origin') === 'https://financeget.vercel.app') {
    corsOptions = {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
      optionsSuccessStatus: 200
    }
  } 
 
 else {
    corsOptions = {
      origin: false
    }
  }
  
  callback(null, corsOptions);
}
module.exports = corsOptionsDelegate;