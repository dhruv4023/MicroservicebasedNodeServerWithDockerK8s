import dotenv from 'dotenv';
dotenv.config();

export default {
    // database details
    database: {
        database: process.env.DB_NAME || 'comment_db',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        dialect: process.env.DB_DIALECT || 'mysql',
        port: process.env.DB_PORT || '3306',
    },
    //  ssl Keys details
    certificate: {
        privkey: process.env.SERVER_KEY || './/ssl//server-key.pem',
        fullchain: process.env.SERVER_CERT || './/ssl//server-cert.pem', 
    },
    port: process.env.APP_PORT || 5003,
    protocol: process.env.PROTOCOL || 'http',
    app_base_url: process.env.APP_BASE_URL || 'http://localhost:5003/api/v1',
    app_project_path: process.env.APP_PROJECT_PATH || 'http://localhost:5003',
    node_env: process.env.NODE_ENV || 'development', 
    jwt_secret: process.env.JWT_SECRET || "123jwttest",
};
