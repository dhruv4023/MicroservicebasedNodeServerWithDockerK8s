import express from 'express';
import { globSync } from 'glob';
import path from 'path';

const router = express.Router();

// Function to load and add routes dynamically
const addRoutes = async (routePath) => {
    const routes = globSync(routePath, {
        ignore: path.join('src', 'routes', '*.js'),
    });

    for (const route of routes) {
        const routeModule = await import(route.replace(path.join('src', 'routes'), './'));
        // Add the route to the router
        router.use('/', routeModule.default);
    }
};

// Specify the directory containing route files
const routeDirectory = 'src/routes/**/index.js';

// Call the function to dynamically add routes
addRoutes(routeDirectory);

// Export the configured router
export default router;
