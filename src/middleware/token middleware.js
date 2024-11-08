import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // Verify the access token using the access token secret
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Access token expired', err });
        }
        return res.status(403).json({ message: 'Invalid access token', err });
      }
      req.user = decoded;
      next();

    });
  } else {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }
};



//typescript code 

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// interface DecodedToken {
//   id: string; // Add any other properties as per your JWT payload structure
//   [key: string]: any; // For any additional dynamic fields
// }

// export const verifyToken = (req: Request, res: Response, next: NextFunction): Response | void => {
//   const authHeader = req.headers.authorization;

//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
//       if (err) {
//         if (err.name === 'TokenExpiredError') {
//           return res.status(401).json({ message: 'Access token expired', err });
//         }
//         return res.status(403).json({ message: 'Invalid access token', err });
//       }

//       // Cast decoded token to DecodedToken interface if needed
//       req.user = decoded as DecodedToken;
//       next();
//     });
//   } else {
//     return res.status(401).json({ message: 'Token missing or invalid' });
//   }
// };

