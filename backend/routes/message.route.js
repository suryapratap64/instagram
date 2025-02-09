import express from "express"

import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { register } from "../controllers/user.controller.js";
import { sendMessage,getMessage } from "../controllers/message.controller.js";
const router=express.Router();
router.route('/send/:id').post(isAuthenticated,sendMessage)
router.route('/all/:id').get(isAuthenticated,getMessage)
export default router