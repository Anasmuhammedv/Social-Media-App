import userModel from "./model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";




export const createUserDB = async(data) => {

  if (!data.email || !data.password) {
    return { status: "failed", message: 'Email and password are required' };
  }
  const salt = await bcrypt.genSalt(10);

  // Check if the user already exists
  const existingUser = await userModel.findOne({email: data.email});
  if(existingUser) {
      // Return a failed message when user already exists
      return { status: "failed", message: 'User already exists' };
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, salt);
  data.password = hashedPassword;

  // Create a new user and save to the database
  const userCreate = new userModel(data);
  await userCreate.save();

  // Return a success message along with the created user
  return { success: true, user: userCreate };
};



//login user and pass jwt token
export const loginUserDB = async (email, password) => {
 
  const existingUser = await userModel.findOne({ email });
  
  
  if (!existingUser) {
    // User not found
    return null;
  }

  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  
  if (!isPasswordCorrect) {
    // Invalid password
    return null;
  }

  // const jwt_secret = process.env.JWT_SECRET || "HEY THIS IS SECRET KEY";
  // const token = jwt.sign(
  //   { id: existingUser._id, email: existingUser.email }, 
  //   jwt_secret, 
  //   { expiresIn: '12m' }
  // );

     
  

  const accessToken = generateAccessToken(existingUser)
  const refreshToken = generateRefreshToken(existingUser)

   // Store refresh token in the database
   existingUser.refreshToken = refreshToken;
   await existingUser.save();

  // Return both the user and token
  return { existingUser,accessToken,refreshToken };
};


// export const verifyTokenDB=async(id,refreshToken)=>{
//   const user =await userModel.findOne({_id:id,refreshToken:refreshToken})
//     //  Generate a new access token
//        const newAccessToken = generateAccessToken(user);
//        return newAccessToken
// }



//login in google authentication


export const checkEmailDB = async (email,token) => {
  if (!email) {
      throw new Error('Email not provided');
  }

  const user = await userModel.findOne({email:email});

  if (user) {
      return user
  } else {
      console.log('Login failed: Email not found');
      return null;
  }
};

//follow user

export const followUserDB = async (id, followersId) => {
   
        // Find the user by their ID
        const user = await userModel.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the followersId already exists in the followers array
        if (!user.followers.includes(followersId)) {
            // Add the followersId to the followers array
            user.followers.push(followersId);
            await user.save();
        }

        return user;
    
};






export const verifyTokenDB = async (userId, token) => {
  try {
    // Check if the user exists and the refresh token matches
    const user = await User.findById(userId);
    
    if (!user || user.refreshToken !== token) {
      return false;  // Invalid token
    }
    
    return true;  // Valid token
  } catch (error) {
    console.error('Error verifying token in DB:', error);
    return false;
  }
};



