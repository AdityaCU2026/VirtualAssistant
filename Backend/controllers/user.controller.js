import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getcurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error in getcurrentUser:", err);
    // Use 500 for server-side errors like database failures
    return res.status(500).json({ message: "Internal server error while fetching user." });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateAssistant:", error);
    // Use 500 for server-side errors (e.g., Cloudinary or DB fails)
    return res.status(500).json({ message: "Internal server error while updating assistant." });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Note: For better performance, user details like name could be stored in the JWT
    // to avoid this database call on every command.
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found for assistant command." });
    }
    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    // This check is important if geminiResponse returns null/undefined on error
    if (!result) {
        return res.status(503).json({ response: "The assistant service is currently unavailable." });
    }

    const JsonMatch = result.match(/{[\s\S]*}/);
    if (!JsonMatch) {
      return res.status(400).json({ response: "Sorry, I couldn't understand the request's format. Please try again." });
    }

    const gemResult = JSON.parse(JsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `The current date is ${moment().format("DD MMMM YYYY")}`,
        });
      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `The current time is ${moment().format("hh:mm A")}`,
        });
      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `The current month is ${moment().format("MMMM")}`,
        });
      case 'get-year':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `The current year is ${moment().format("YYYY")}`,
        });

      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({ response: "Sorry, I couldn't recognize that command type." });
    }
  } catch (error) {
    console.error("Error in askToAssistant:", error);

    // Check for specific API errors like rate limiting
    if (error.response && error.response.status === 429) {
        return res.status(429).json({ message: "Too many requests to the assistant. Please wait a moment." });
    }

    return res.status(500).json({ message: "An internal error occurred while asking the assistant." });
  }
};