import { userCreateBody } from "./schema.js";
import { checkEmailDB, createUserDB, followUserDB, loginUserDB, verifyTokenDB } from "./service.js";
import passport from '../../middleware/googleAuth.js';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from "../../utils/jwt.js";
import userModel from "./model.js";

//user create
export const createUser = async (req, res) => {

    const data = await userCreateBody.validateAsync(req.body);
    // const data =req.body.data

    // console.log(data,"this is data");
    


    const userCreate = await createUserDB(data);
    if(!userCreate){
        return res.status(409).json({
            status: "failed",
            message: "User already found",
          });
    }
    
    return res.status(201).json({
      status: "success",
      message: "User successfully created",
      data: userCreate,
    });
  } 


  
  //user login
  export const userLogin = async (req, res) => {
    const { email, password } = req.query;
    console.log(email,password);
    
  
    // Attempt to log in
    const userLogin = await loginUserDB(email, password);
  
    if (!userLogin) {
      // If no user or password is incorrect, respond with 404
      return res.status(404).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // console.log(userLogin,"cytugftfyuh");
    
  
    // Return success with user data
    return res.status(200).json({
      status: "success",
      message: "User successfully logged in",
      data: userLogin,
    });
  };

  //verify refresh token
  
//  export const VerifyRefreshToken = async(req,res)=>{
//   const { token } = req.body;
//   if (!token) return res.status(401).json({ message: 'Refresh token is required' });

//   try {
//     const decoded = verifyRefreshToken(token);

//     const user = await User.findOne({ _id: decoded.id, refreshToken: token });
//     if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

//     // Generate a new access token
//     const newAccessToken = generateAccessToken(user);

//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }

//  }
  

//login google authentication

// export const createRefreshToken = async (req, res) => {
//   const { token } = req.body;
  
//   if (!token) return res.status(401).json({ message: 'Refresh token is required' });

//   try {
//     // Verify the refresh token using the REFRESH_TOKEN_SECRET
//     const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

//     // Check if the refresh token exists in the database
//     const refreshTokenValid = await verifyTokenDB(decoded._id, token);
//     if (!refreshTokenValid) return res.status(403).json({ message: 'Invalid refresh token' });

//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { id: decoded._id }, 
//       process.env.ACCESS_TOKEN_SECRET, 
//       { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }
//     );

//     // Send the new access token
//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }
// };

const jwt_secret = process.env.JWT_SECRET || "secret key";

// Function to generate JWT
function generateJWT(user) {
    const payload = {
        userId: user._id,
        email: user.email,
        roles: ['student'],
    };
    return jwt.sign(payload, jwt_secret, { expiresIn: '1h' });
}


export const googleAuthCallback = async (req, res, next) => {
  passport.authenticate('google', async (err, profile, info) => {
      if (err) {
          return next(err);
      }
      if (!profile) {
          return res.status(401).send({ message: "Authentication failed" });
      }

      try {
          const email = profile.emails?.[0]?.value;
          const accessToken = profile.accessToken;

          const user = await checkEmailDB(email, accessToken);

          if (!user) {
            res.redirect(`http://localhost:5173/signup`)
            return res.status(401).send({ message: "Student not found" });
          }

          req.logIn(user, (err) => {
              if (err) {
                  return next(err);
              }

              const token = generateJWT(user);

      // Redirect to frontend with token and user data as query params

      //  res.redirect(`auth/callback?token=${token}&user=${JSON.stringify(user)}`);
      // In authController.js
      console.log(token,user);
      res.redirect(`http://localhost:5173/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`)
      // res.redirect(`http://localhost:5173/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`)
      // return res.json(token,user)
      

      
          });
      } catch (error) {
          return next(error);
      }
  })(req, res, next);
};



  //follow users

  export const followUser = async(req,res)=>{
    const {id} = req.params
    const {followId}=req.params
    const userFollows = await followUserDB(id,followId)
    return res.status(201).json({
        status: "success",
        message: "successfully followed",
        data: userFollows,
      });
  }



  export const logout = async(req,res)=>{
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token is required' });
  
    try {
      const user = await User.findOne({ refreshToken: token });
      if (!user) return res.status(400).json({ message: 'Invalid refresh token' });
  
      // Remove refresh token from database
      user.refreshToken = null;
      await user.save();
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


// export const createRefreshToken = async (req, res) => {
//   // const { token } = req.body; 
//   const { userId } =req.body

//   // console.log(token,"thisi s c token");
  

//   // if (!token) return res.status(401).json({ message: 'Refresh token is required' });
//   if (!userId) return res.status(401).json({ message: 'user is required' });

//   try {
//     //            Verify the refresh token using the REFRESH_TOKEN_SECRET

//     // const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
   
//     //           Extract the userId from the decoded token (this should be present in the payload)

//     // const userId = decoded.id;
 
//     // Check if the refresh token exists in the database for the user
//     const user = await userModel.findById(userId);
//     console.log(user,"thusbbus user");
//     if (!user) {
//       return res.status(403).json({ message: 'Invalid refresh token' });
//     }

    

//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { id: user._id },  // Add user id to the new access token
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }
//     );

//     // Send the new access token
//     res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid refresh token' });
//   }
// };



export const createRefreshToken = async (req,res) => {
  const { userId } = req.body;

  if (!userId) return res.status(401).json({ message: 'User ID is required' });

  try {
    
    const user = await userModel.findById(userId);
    
    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: 'Invalid or missing refresh token' });
    }

    const storedRefreshToken = user.refreshToken; 

    const decoded = jwt.verify(storedRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.id !== userId) {
      return res.status(403).json({ message: 'Invalid refresh token for this user' });
    }

    // const newAccessToken = jwt.sign(
    //   { id: user._id },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }
    // );

    const newAccessToken = generateAccessToken(user)

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
};




//controlller fro ts file



// import { Request, Response } from 'express';
// import { createRefreshTokenService } from '../services/refreshTokenService';

// export const createRefreshToken = async (req: Request, res: Response): Promise<Response> => {
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(401).json({ message: 'User ID is required' });
//   }

//   try {
//     const result = await createRefreshTokenService(userId);

//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
//   }
// };



//serice for ts



// import jwt from 'jsonwebtoken';
// import userModel from '../models/userModel'; // Assuming userModel is correctly imported from your models
// import { IUser } from '../interfaces/userInterface'; // Import user interface for type safety

// export const createRefreshTokenService = async (userId: string): Promise<{ accessToken: string }> => {
//   // Fetch the user from the database using the userId
//   const user: IUser | null = await userModel.findById(userId);

//   if (!user || !user.refreshToken) {
//     throw new Error('Invalid or missing refresh token');
//   }

//   const storedRefreshToken = user.refreshToken; // Assuming refreshToken is stored as a string or an array

//   // Verify the stored refresh token
//   const decoded = jwt.verify(storedRefreshToken, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;

//   // Ensure the decoded token's userId matches the provided userId
//   if (decoded.id !== userId) {
//     throw new Error('Invalid refresh token for this user');
//   }

//   // Generate a new access token
//   const newAccessToken = jwt.sign(
//     { id: user._id },
//     process.env.ACCESS_TOKEN_SECRET as string,
//     { expiresIn: process.env.ACCESS_TOKEN_LIFETIME }
//   );

//   // Return the new access token
//   return { accessToken: newAccessToken };
// };





//types for ts 








// export interface IUser {
//   _id: string;
//   refreshToken?: string;
//   // Add other fields as necessary
// }
