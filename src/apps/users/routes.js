import express from "express"
import { createRefreshToken, createUser, followUser, googleAuthCallback, logout, userLogin } from "./controller.js"
import passport, { initializeGoogleStrategy } from '../../middleware/googleAuth.js';
import { userToken } from "../../middleware/user-token.js";
const router = express.Router()

router.route("/account")
  .post(createUser)
  .get(userLogin)
  .put(createRefreshToken)
  .delete(logout)

  router.post("/user/:id/follower/:followId",userToken,followUser)



  // routes/authRoutes.ts

// Route for student Google OAuth
router.get('/google/student', (req, res, next) => {
    initializeGoogleStrategy('http://localhost:4000/api/auth/google/callback/student');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback/student', googleAuthCallback);



export default router
