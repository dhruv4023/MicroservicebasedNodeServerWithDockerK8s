
const RESPONSE = {};
RESPONSE.success = function (res, response) {
    return res.status(response.status).json(response.data);
};

RESPONSE.error = function (res, error) {
    return res.status(error?.response?.status || 500).json(error?.response?.data || error);
};

export default RESPONSE;