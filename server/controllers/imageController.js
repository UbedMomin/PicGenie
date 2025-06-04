import User from "../models/userModel.js";
import FormData from 'form-data';
import axios from 'axios';

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const user = req.user; // Now properly attached from middleware

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: "Prompt is required" 
      });
    }

    // Check if user has enough credits
    if (user.creditBalance <= 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits",
        creditBalance: user.creditBalance
      });
    }

    // Generate image
    const form = new FormData();
    form.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      form,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API,
          ...form.getHeaders()
        },
        responseType: 'arraybuffer'
      }
    );

    const base64Image = Buffer.from(data, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Update user credits
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { creditBalance: -1 } },
      { new: true } // Return the updated document
    );

    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: updatedUser.creditBalance,
      resultImage
    });

  } catch(error) {
    console.error('Error in generateImage:', error);
    res.status(500).json({
      success: false,
      message: "Image generation failed",
      error: error.message
    });
  }
};