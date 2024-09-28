export default (sequelize, DataTypes) => {
    const ImageSchema = sequelize.define('images', {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id',
            },
        },
    }, {
        timestamps: true,
    });

    return ImageSchema;
};
