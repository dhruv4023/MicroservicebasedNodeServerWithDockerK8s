import FormData from 'form-data';
import RESPONSE from '../../helpers/response.helper.js';
import config from '../../config/config.js';
import { sendRequest } from '../../helpers/handle_request_axios.js';

const AUTH_API_END = config.micro_services.auth_api_end;

export const loginControl = async (req, res) => {
    try {
        const response = await sendRequest('post', `${AUTH_API_END}/api/v1/auth/login/`, {
            'Content-Type': 'application/json'
        }, JSON.stringify(req.body));
        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const registerControl = async (req, res) => {
    try {
        const formData = new FormData();
        for (const key in req.body) {
            if (req.body[key] !== undefined) {
                formData.append(key, req.body[key]);
            }
        }
        if (req.file) {
            formData.append('picPath', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });
        }
        const response = await sendRequest('post', `${AUTH_API_END}/api/v1/auth/register/`, {
            ...formData.getHeaders(),
        }, formData);
        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const getUserNames = async (req, res) => {
    try {
        const response = await sendRequest('get', `${AUTH_API_END}/api/v1/auth/get/usernames`, {
            'Content-Type': 'application/json'
        });
        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};

export const changePassControl = async (req, res) => {
    try {
        const response = await sendRequest('put', `${AUTH_API_END}/api/v1/auth/change/password`, {
            'Content-Type': 'application/json',
            'Authorization': req.header("Authorization")
        }, JSON.stringify(req.body));
        RESPONSE.success(res, response);
    } catch (error) {
        RESPONSE.error(res, error);
    }
};
