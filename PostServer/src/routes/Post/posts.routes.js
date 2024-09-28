// routes.js

import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByUserId,
} from '../../controllers/post.controller.js';
import { verifyTokenAndRole } from '../../middlewares/auth.js';
import upload from '../../middlewares/file_uploder.js';

const router = express.Router();

// Define routes
router.get('/', getPosts);
router.get('/:postId', getPostById);
router.get('/user/:userId', getPostsByUserId);
router.post('/', verifyTokenAndRole(['user', "admin"]), upload.array("imgs"), createPost);
router.put('/:postId', verifyTokenAndRole(['user', "admin"]), upload.array("imgs"), updatePost);
router.delete('/:postId', verifyTokenAndRole(['user', "admin"]), deletePost);

export default router;
