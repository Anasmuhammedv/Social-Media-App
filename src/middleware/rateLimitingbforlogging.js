import rateLimit from 'express-rate-limit';


//---------------->token based rate limiting


export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
  message: 'Too many requests from this user, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false, 
  keyGenerator: (req, res) => {
   
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return token || "unknown"; 
    }
    return "unknown"; 
  },
});



//2------------->ip address based rate limiting

// import rateLimit from "express-rate-limit";

// export const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 12, 
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => {
//     return req.ip; 
//   },
// });

