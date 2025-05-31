import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ sucess: false, messaege: "Missing Details" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = new newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ sucess: true, token, user: { name: user.name } });
  } catch (error) {}
  console.log(error);
  res.json({ sucess: false, messaege: error.message });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res({ sucess: false, messaege: " User Does Not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({ sucess: true, token, user: { name: user.name } });
    } else {
      return res({ sucess: false, messaege: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ sucess: false, message: error.message });
  }
};
