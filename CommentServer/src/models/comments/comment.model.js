export default (sequelize, DataTypes) => {
  const CommentSchema = sequelize.define('comments', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentCommentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
        onDelete: 'CASCADE'
      },
    },
  }, {
    timestamps: true,
  });

  return CommentSchema;
};
