const userModel = require('../models/user');
const cloudinary = require('../config/cloudinary');
const bcrypt = require('bcrypt');
const fs = require('fs');

exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existUser = await userModel.findOne({ email: email.toLowerCase() });

    if (existUser) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: `User with Email: ${email} already exist`
      })
    };

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      profile: {
        publicId: result.public_id,
        imageUrl: result.secure_url
      }
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      data: user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      message: 'All users below',
      totalUsers: users.length,
      data: users
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
};


exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const existUser = await userModel.findById(id);
    res.status(200).json({
      message: 'Check user below',
      data: existUser
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const data = {
      password,
      profile: user.profile
    };

    if (req.file && req.file.path) {
      await cloudinary.uploader.destroy(user.profile.publicId);
    };

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    data.profile = {
      imageUrl: result.secure_url,
      publicId: result.public_id
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    };

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (deletedUser) {
      await cloudinary.uploader.destroy(user.profile.publicId)
    }

    res.status(200).json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
};