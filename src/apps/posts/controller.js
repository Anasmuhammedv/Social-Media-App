import { createPostDB, getAllPostDB, getUserPostDB } from "./services.js"



export const postCreate = async (req, res) => {
  try {
    const { title } = req.body;  
    const { id } = req.params;   

    const image = req.cloudinaryImageUrl; 
  
    // Create post in the database
    const createPost = await createPostDB(title,image , id); 

    return res.status(201).json({
      status: "success",
      message: "Post successfully created",
      data: createPost,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create post",
    });
  }
};




// get All post

export const getAllPost =async(req,res)=>{
    const Allpost = await getAllPostDB()
    return res.status(201).json({
        status: "success",
        message: "successfully get all post",
        data: Allpost,
      });
}

export const getUserPost = async(req,res)=>{
    const {id} = req.params
    const userPost =await getUserPostDB(id)
    return res.status(201).json({
        status: "success",
        message: "user data is fetched",
        data: userPost,
      });

}  