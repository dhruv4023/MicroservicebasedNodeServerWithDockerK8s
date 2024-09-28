// Import necessary modules and models
import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getNestedComments,
} from '../../controllers/comments/comments.controller.js';
import { verifyTokenAndRole } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/post/:postId', getComments); // Get all comments for a specific post
router.get('/post/:postId/parent/:parentCommentId', getComments); // Get all comments for a specific post
router.get('/post/:postId/nested', getNestedComments); // Get all comments for a specific post

router.post('/post/:postId', verifyTokenAndRole(['user', "admin"]), createComment); // Create a new comment on a post
router.post('/post/:postId/parent/:parentCommentId', verifyTokenAndRole(['user', "admin"]), createComment); // Create a new comment on a post

router.put('/:commentId/', verifyTokenAndRole(['user', "admin"]), updateComment); // Update a specific comment
router.delete('/:commentId/', verifyTokenAndRole(['user', "admin"]), deleteComment); // Delete a specific comment

export default router;
