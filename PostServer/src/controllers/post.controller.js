import db from "../models/index.js"
import RESPONSE from "../helpers/response.helper.js";
import isValidData from "../helpers/validation/data_validator.js";
import { deleteImages, uploadFile } from "../helpers/cloudinary.helper.js";
import { getPaginatedResponse, getPaginationMetadata } from "../helpers/pagination.helper.js";

const { Posts, sequelize, Images } = db;

export const getPosts = async (req, res) => {
    try {
        // Extract pagination parameters from the query string
        const { page, limit, offset } = getPaginationMetadata(req.query);

        // Assuming you are using Sequelize to fetch paginated posts from the database
        const data = await Posts.findAndCountAll({
            include: [{ model: Images, as: 'images' }],
            limit,
            offset,
        });

        // Construct a paginated response
        const paginatedResponse = getPaginatedResponse(data, page, limit);

        // Send a success response with the paginated posts
        RESPONSE.success(res, 3005, paginatedResponse);
    } catch (error) {
        // If an error occurs during post retrieval, log the error and send a 500 Internal Server Error response
        RESPONSE.error(res, 9999, 500);
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        // Extract pagination parameters from the query string
        const { params: { userId } } = req;
        const { page, limit, offset } = getPaginationMetadata(req.query);
        // Assuming you are using Sequelize to fetch paginated posts from the database
        const data = await Posts.findAndCountAll({
            where: { userId },
            include: [{ model: Images, as: 'images' }],
            limit,
            offset,
        });

        // Construct a paginated response
        const paginatedResponse = getPaginatedResponse(data, page, limit);

        // Send a success response with the paginated posts
        RESPONSE.success(res, 3005, paginatedResponse);
    } catch (error) {
        // If an error occurs during post retrieval, log the error and send a 500 Internal Server Error response
        RESPONSE.error(res, 9999, 500);
    }
};

export const getPostById = async (req, res) => {
    const { params: { postId } } = req;

    try {
        const post = await Posts.findOne({
            where: { id: postId },
            include: [{ model: Images, as: 'images' }],
        });
        (post) ? RESPONSE.success(res, 3006, post) : RESPONSE.error(res, 3003, 404);
    } catch (error) {
        RESPONSE.error(res, 9999, 500);
    }
};

export const createPost = async (req, res) => {
    const validationErr = await isValidData(req.body, {
        title: 'required|string|min:2|max:255',
        content: 'required|string',
    });

    if (validationErr)
        return RESPONSE.error(res, validationErr);

    const t = await sequelize.transaction();

    try {
        const { body: { title, content }, tokenData: { userId } } = req;

        const newPost = await Posts.create({
            title,
            content,
            userId,
        }, { transaction: t });

        const imgUrls = await uploadImages(req.files, userId, t);

        // Create associated images with the post
        await Images.bulkCreate(
            imgUrls.map(imageUrl => ({ imageUrl, postId: newPost.id })),
            { transaction: t }
        );

        await t.commit();  // Commit the transaction

        RESPONSE.success(res, 3001, newPost);
    } catch (error) {
        await t.rollback();  // Rollback the transaction if an error occurs
        RESPONSE.error(res, 9999, 500);
    }
};

export const uploadImages = async (files, userId, transaction) => {
    const fileName = (new Date()).getTime();
    const filePublicIds = [];
    try {
        for (let i in files) {
            const fileData = await uploadFile({
                file: files[i],
                newImgFileName: String(fileName) + "_" + String(i),
                dirAddress: `Users/${userId}/posts/images/`,
            }, transaction);
            filePublicIds.push(fileData.public_id);
            // console.log(fileData.public_id)
            // fileName = 5;
        }
        return filePublicIds;
    } catch (error) {
        await deleteImages(filePublicIds)
        throw Error("Error occured while uploading image")
    }
};

export const updatePost = async (req, res) => {
    const { body: { title, content, rmImgs }, params: { postId }, tokenData: { userId } } = req;

    const validationErr = await isValidData({ title, content }, {
        title: 'string|min:2|max:255',
        content: 'string',
    });

    if (validationErr)
        return RESPONSE.error(res, validationErr);

    const transaction = await sequelize.transaction();

    try {
        const imgUrls = await uploadImages(req.files, userId, transaction);
        // Create associated images with the post
        await Images.bulkCreate(
            imgUrls.map(imageUrl => ({ imageUrl, postId })),
            { transaction }
        );

        const [rowsUpdated] = await Posts.update(
            {
                title,
                content,
            },
            {
                where: { id: postId, userId },
                transaction,
            }
        );
        if (rmImgs && typeof rmImgs === "object") {
            // Delete images in a transaction
            await deleteImages(rmImgs);
            await Images.destroy({
                where: {
                    imageUrl: rmImgs,
                },
                transaction,
            });
        }
        if (rowsUpdated > 0) {
            await transaction.commit();  // Commit the transaction
            try {
                const updatedPost = await Posts.findOne({
                    where: { id: postId },
                    include: [{ model: Images, as: 'images' }],
                });
                RESPONSE.success(res, 3002, updatedPost);
            } catch (error) {
                RESPONSE.success(res, 3002);
            }
        } else {
            await transaction.rollback();  // Rollback the transaction if no rows were updated
            RESPONSE.error(res, 3003, 404);
        }

    } catch (error) {
        await transaction.rollback();  // Rollback the transaction if an error occurs
        RESPONSE.error(res, 9999, 500);
    }
};


export const deletePost = async (req, res) => {
    const { params: { postId } } = req;

    const transaction = await sequelize.transaction();

    try {
        // Find images associated with the post
        const images = await Images.findAll({
            where: { postId },
            transaction,
        });

        // Delete images on Cloudinary
        images?.length > 0 && await deleteImages(images.map(img => img.imageUrl), transaction);

        // Delete the post
        const rowsDeleted = await Posts.destroy({
            where: { id: postId, userId: req.tokenData.userId },
            transaction,
        });

        if (rowsDeleted > 0) {
            await transaction.commit();  // Commit the transaction
            RESPONSE.success(res, 3004, { postId });
        } else {
            await transaction.rollback();  // Rollback the transaction if no rows were deleted
            RESPONSE.error(res, 3003, 404);
        }
    } catch (error) {
        await transaction.rollback();  // Rollback the transaction if an error occurs
        RESPONSE.error(res, 9999, 500);
    }
};
