import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from 'sequelize';
import config from "../config/config.js";

// Importing models
import api_logsModel from "./middleware/api_logs.model.js";
import postModel from "./Post/post.model.js";
import imageModel from "./images/image.model.js";

// Initialize Sequelize for master database connection
const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        dialect: config.database.dialect,
        port: config.database.port,
        operatorsAliases: false, // `operatorsAliases` is deprecated, use false instead of 0
        pool: {
            max: 10,
            min: 0,
            acquire: 60000,
            idle: 10000,
        },
        logging: false,
    }
);

// Initialize DB object
const db = {
    Sequelize,
    sequelize,
    ApiLogs: api_logsModel(sequelize, Sequelize),
    Posts: postModel(sequelize, Sequelize),
    Images: imageModel(sequelize, Sequelize)
};

// Define relationships
db.Posts.hasMany(db.Images, { as: 'images', foreignKey: 'postId' });
db.Images.belongsTo(db.Posts, { foreignKey: 'postId' });

// Authenticate and sync database
const initializeDatabase = async () => {
    try {
        // Authenticate the database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('All models synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Run the initialization
initializeDatabase();

// Export the db object
export default db;
