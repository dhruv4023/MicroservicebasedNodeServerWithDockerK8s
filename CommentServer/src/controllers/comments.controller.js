import db from "../models/index.js";
import RESPONSE from "../helpers/response.helper.js";
import isValidData from "../helpers/validation/data_validator.js";
import { getRecursivePaginatedResponse, getTotalCommentCount, getPaginatedResponse, getPaginationMetadata } from "../helpers/pagination.helper.js";

const { Comments } = db

export const createComment = async (req, res) => {
    const { body: { content }, params: { postId, parentCommentId }, tokenData: { userId } } = req;

    const validationErr = await isValidData({ content }, {
        content: 'required|string',
    });

    if (validationErr) {
        return RESPONSE.error(res, validationErr);
    }

    try {

        const newComment = await Comments.create({
            content,
            postId,
            userId,
            parentCommentId,
        });

        RESPONSE.success(res, 4002, newComment);
    } catch (error) {

        RESPONSE.error(res, 9999, 500, error);
    }
};

export const updateComment = async (req, res) => {
    const { body: { content }, tokenData: { userId }, params: { commentId } } = req;

    const validationErr = await isValidData({ content }, {
        content: 'string'
    });

    if (validationErr) {
        return RESPONSE.error(res, validationErr);
    }

    try {
        const [rowsUpdated] = await Comments.update(
            { content },
            {
                where: { id: commentId, userId },
                returning: true,
            }
        );

        if (rowsUpdated > 0) {
            RESPONSE.success(res, 4004);
        } else {
            RESPONSE.error(res, 4003, 404);
        }
    } catch (error) {

        RESPONSE.error(res, 9999, 500);
    }
};

export const deleteComment = async (req, res) => {
    const { tokenData: { userId }, params: { commentId } } = req;

    try {
        const rowsDeleted = await Comments.destroy({
            where: { id: commentId, userId },
        });

        if (rowsDeleted > 0) {
            RESPONSE.success(res, 4005, { commentId });
        } else {
            RESPONSE.error(res, 4003, 404);
        }
    } catch (error) {

        RESPONSE.error(res, 9999, 500);
    }
};

export const getComments = async (req, res) => {
    const { params: { postId, parentCommentId }, query } = req;

    try {
        const { page, limit, offset } = getPaginationMetadata(query);

        const comments = await Comments.findAndCountAll({
            where: { postId, parentCommentId: parentCommentId ? parentCommentId : null },
            limit,
            offset,
        });

        const paginatedResponse = getPaginatedResponse(comments, page, limit);
        RESPONSE.success(res, 4001, paginatedResponse);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};

export const getNestedComments = async (req, res) => {
    const { params: { postId }, query } = req;

    try {
        const { page, limit, offset } = getPaginationMetadata(query);
        const nestedComments = await getNestedCommentsPaginated(postId, offset, limit);

        const totalCount = await getTotalCommentCount(Comments, postId);

        const paginatedResponse = getRecursivePaginatedResponse(nestedComments, page, limit, totalCount);

        RESPONSE.success(res, 4006, paginatedResponse);
    } catch (error) {
        RESPONSE.error(res, 9999, 500, error);
    }
};


const getNestedCommentsPaginated = async (postId, offset, limit, parentCommentId = null) => {
    const comments = await Comments.findAll({
        where: {
            postId,
            parentCommentId,
        },
        limit,
        offset,
    });

    const nestedComments = [];

    for (const comment of comments) {
        const replies = await getNestedCommentsPaginated(postId, 0, limit, comment.id);

        nestedComments.push({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            postId: comment.postId,
            parentCommentId: comment.parentCommentId,
            replies: replies,
        });
    }

    return nestedComments;
};
