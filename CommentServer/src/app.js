// Import necessary modules
import express from "express";
import cors from "cors";
import config from './config/config.js';

// Create an Express application
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Configure CORS for allowed origins

// Root route that returns a simple "Server is running..." message
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Import logger middleware
import { logger } from "./middlewares/logger.js";

// Use logger middleware only in development environment
if (config.node_env == 'development') {
  app.use(logger);
}

// Import routes
import routes_v1 from './routes/index.routes.js';

// Define routes for API version 1 under '/api/v1/'
app.use('/api/v1/', routes_v1);

// Export the configured Express app
export default app;
