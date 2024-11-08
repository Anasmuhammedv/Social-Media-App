import express from "express"
import { getAllPost, getUserPost, postCreate } from "./controller.js"
import { cloudinaryUploadImg } from "../../middleware/cloudinaryConfig.js"
import { limiter } from "../../middleware/rateLimitingbforlogging.js"
import { verifyToken } from "../../middleware/token middleware.js"
const router = express.Router()

router.route('/post/:id')
   
   .post( limiter,cloudinaryUploadImg,postCreate)
   .get(getUserPost)
   // console.log(authHeader);
router.get('/post',verifyToken, getAllPost)
export default router