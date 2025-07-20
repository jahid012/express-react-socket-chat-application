import Message from "../models/message.model.js";
import User from '../models/user.model.js';

export const GetAllMessagedUser = async (req, res) => {
  try {

    const currentUserId = req.user._id;
    const users = await User.find({_id:{$ne:currentUserId}}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMessagesByReceiverId = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  try {
    // Validate input
    if (!receiverId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // Fetch messages for the conversation
    const messages = await Message.find({
      $or: [
        { senderId: receiverId, receiverId: senderId },
        { senderId: senderId, receiverId: receiverId },
      ],
    })
      .populate("sender", "fullName email")
      .sort({ createdAt: -1 });

    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user._id;

  try {
    // Validate input
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    let imageUrl;
    if (image) {
      //upload image to cloud storage and get the URL
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "messages",
        resource_type: "auto",
      });
      imageUrl = uploadResult.secure_url;
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text ? text.trim() : undefined,
      image: imageUrl ? imageUrl.trim() : undefined,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
    // realtime functionaliy will be implemented later
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
