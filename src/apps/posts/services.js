import postModel from "./modle.js"



export const createPostDB = async (title,image, userId) => {
    console.log(userId,title,image,"this all are datsa cmeing from frontend");
  const post = new postModel({
    title: title,
    image: image,
    userId,  
  });

  await post.save();
  return post;
};

  

export const getAllPostDB = async()=>{
    const allPost = await postModel.find().populate('userId')
    return allPost
}

export const getUserPostDB = async(userId)=>{
    const userpost = await postModel.find({userId:userId}).populate("userId")
    return userpost

}