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

const getRecursivePaginatedResponse = (data, page, limit, totalCount) => {
    return {
        page_data: data,
        page_information: {
            total_data: totalCount,
            last_page: Math.ceil(totalCount / limit),
            current_page: page,
            previous_page: page > 1 ? page - 1 : null,
            next_page: page < Math.ceil(totalCount / limit) ? page + 1 : null,
        },
    };
};

const getTotalCommentCount = async (Comments,postId) => {
    const totalCount = await Comments.count({
        where: {
            postId,
        },
    });

    return totalCount;
};

export { getPaginationMetadata, getPaginatedResponse, getRecursivePaginatedResponse, getTotalCommentCount };
