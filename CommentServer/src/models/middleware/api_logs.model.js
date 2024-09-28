export default (sequelize, Sequelize) => {
    const ApiLogSchema = sequelize.define(
        'api_logs',
        {
            id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            api_method: {
                type: Sequelize.STRING,
            },
            api_url: {
                type: Sequelize.TEXT,
            },
        }
    );
    return ApiLogSchema;
};