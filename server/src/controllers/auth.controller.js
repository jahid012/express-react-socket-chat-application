import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {

  const { fullName, email, password } = req.body;

  try {
    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //minimum password controll
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "User creation failed" });
    }

    generateToken(newUser._id, res);

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  
  try{
    const {profilePicture} = req.body;
    const userId = req.user._id;
    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    await cloudinary.uploader.upload(profilePicture, {
      folder: "profile_pictures",
    }, async (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Image upload failed", error });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: result.secure_url },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
        },
      });
    });

  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const checkAuth = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      message: "User is authenticated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error during authentication check:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};