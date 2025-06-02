import express from 'express';
import { registerUser, loginUser, userCredits } from "../controllers/userController.js";
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected route using auth middleware
userRouter.post('/credits', userAuth, userCredits);

export default userRouter;

// Example routes:
// POST http://localhost:4000/api/user/register
// POST http://localhost:4000/api/user/login
// POST http://localhost:4000/api/user/credits (requires token in Authorization header)
