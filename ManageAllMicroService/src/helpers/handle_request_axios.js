import axios from "axios";

export const sendRequest = async (method, url, headers, data = {}, params = null) => {
    try {
        return await axios.request({ method, url, headers, data, params });
    } catch (error) {
        throw error;
    }
};