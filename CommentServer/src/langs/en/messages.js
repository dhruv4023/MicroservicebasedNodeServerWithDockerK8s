const MESSAGES = {
    // comments messages
    4001: 'Comment retrived successfully',
    4002: 'Comment created successfully',
    4003: 'Comment not found',
    4004: 'Comment updated successfully',
    4005: 'Comment deleted successfully',
    
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