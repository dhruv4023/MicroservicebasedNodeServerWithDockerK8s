const MESSAGES = {
    // Post messages
    3001: 'Post created successfully',
    3002: 'Post updated successfully',
    3003: 'Post not found',
    3004: 'Post deleted successfully',
    3005: 'retrived all post',
    3006: 'retrived requested post',

    // Authorization messages
    5001: 'Unauthorized - Admin access required',
    5002: 'Access denied - Unauthorized',
    5003: 'Your session expired! Please log in again',
    
    // General messages
    9999: 'Internal Server Error',
};

const getMessage = messageCode => {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};

export default getMessage;