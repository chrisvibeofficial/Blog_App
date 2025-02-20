const postModel = require('../models/post');
const userModel = require('../models/user');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const files = req.files;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const imageArr = [];

    for (const images of files) {
      const result = await cloudinary.uploader.upload(images.path);
      fs.unlinkSync(images.path);
      const img = {
        imageUrl: result.secure_url,
        publicId: result.public_id
      };
      imageArr.push(img)
    };

    const post = new postModel({
      content,
      images: imageArr,
      user: user.fullName,
      userId: user._id
    });

    await post.save();
    user.postId.push(post._id);
    await user.save();
    res.status(201).json({
      message: 'Post created successfully',
      data: post
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Interna Server Error'
    })
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel.find();

    res.status(200).json({
      message: 'Check all posts below',
      totalPost: posts.length,
      data: [posts]
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Interna Server Error'
    })
  }
};


exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await postModel.findOne({ userId: id });

    if (!user) {
      return res.status(404).json({
        message: 'No post for non-existing user'
      })
    }

    const post = await postModel.findOne({ userId: user.userId });

    res.status(200).json({
      message: 'User post below',
      data: post
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Interna Server Error'
    })
  }
};


exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const files = req.files;
    const user = await postModel.findOne({ userId: id });

    if (!user) {
      return res.status(404).json({
        message: 'No post for non-existing user'
      })
    }

    const data = {
      content
    }

    if (files && files[0]) {
      user.images.forEach(async (e) => {
        await cloudinary.uploader.destroy(e.publicId)
      });
    };

    const imageArr = [];

    for (const images of files) {
      const result = await cloudinary.uploader.upload(images.path);
      fs.unlinkSync(images.path);
      const img = {
        imageUrl: result.secure_url,
        publicId: result.public_id
      }
      imageArr.push(img)
    }

    data.images = imageArr;
    const postId = user._id;
    const updatedPost = await postModel.findByIdAndUpdate(postId, data, { new: true });
    res.status(200).json({
      message: 'Post updated successfully',
      data: updatedPost
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Interna Server Error'
    })
  }
};


exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await postModel.findOne({ userId: id });

    if (!user) {
      return res.status(404).json({
        message: 'No post for non-existing user'
      })
    }

    const deletedPost = await postModel.deleteOne({ userId: id });

    if (deletedPost) {
      user.images.forEach(async (e) => {
        await cloudinary.uploader.destroy(e.publicId)
      })
    }

    res.status(200).json({
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Interna Server Error'
    })
  }
}