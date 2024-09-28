// Utility functions for paginating user lists

const getPaginationMetadata = (query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}

const getPaginatedResponse = (data, page, limit) => {
    return {
        page_data: data.rows,
        page_information: {
            total_data: data.count,
            last_page: Math.ceil(data.count / limit),
            current_page: page,
            previous_page: 0 + (page - 1),
            next_page: page < Math.ceil(data.count / limit) ? page + 1 : 0
        }
    }
}

export { getPaginationMetadata, getPaginatedResponse };
