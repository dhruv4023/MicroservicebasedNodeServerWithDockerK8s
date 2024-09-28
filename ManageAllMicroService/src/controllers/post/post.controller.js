import FormData from 'form-data';

import RESPONSE from '../../helpers/response.helper.js';
import config from '../../config/config.js';
import { sendRequest } from '../../helpers/handle_request_axios.js';

const POST_API_END = config.micro_services.post_api_end;


export const getPosts = async (req, res) => {
    try {
        const response = await sendRequest('get', `${POST_API_END}/api/v1/post/`, { 'Content-Type': 'application/json' }, {}, req.query);

        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        const response = await sendRequest('get', `${POST_API_END}/api/v1/post/user/${req.params.userId}`, { 'Content-Type': 'application/json' }, {}, req.query);

        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const getPostById = async (req, res) => {
    try {
        const response = await sendRequest('get', `${POST_API_END}/api/v1/post/${req.params.postId}`, { 'Content-Type': 'application/json' }, {}, req.params);

        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const createPost = async (req, res) => {
    try {
        const formData = new FormData();

        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                formData.append(key, req.body[key]);
            }
        }

        for (let i in req.files) {
            formData.append('imgs', req.files[i].buffer, {
                filename: req.files[i].originalname,
                contentType: req.files[i].mimetype,
            });
        }

        const response = await sendRequest('post', `${POST_API_END}/api/v1/post/`, { ...formData.getHeaders(), 'Authorization': req.header("Authorization") }, formData);

        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const updatePost = async (req, res) => {
    try {
        const formData = new FormData();

        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                formData.append(key, req.body[key]);
            }
        }

        for (let i in req.files) {
            formData.append('imgs', req.files[i].buffer, {
                filename: req.files[i].originalname,
                contentType: req.files[i].mimetype,
            });
        }

        const response = await sendRequest('put', `${POST_API_END}/api/v1/post/${req.params.postId}`, { ...formData.getHeaders(), 'Authorization': req.header("Authorization") }, formData);

        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const deletePost = async (req, res) => {
    try {
        const response = await sendRequest('delete', `${POST_API_END}/api/v1/post/${req.params.postId}`, { 'Authorization': req.header("Authorization") });
        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};