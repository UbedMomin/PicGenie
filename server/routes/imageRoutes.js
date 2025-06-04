import express from 'express';
import { generateImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js"; // Ensure path is correct

const router = express.Router();

router.post('/generate-image', userAuth, generateImage);

export default router;