// Import necessary modules
import fs from "fs";
import http from "http";
import https from "https";
import app from "./src/app.js";
import config from './src/config/config.js';

// Initialize server variable
let server;

// Check if the configured protocol is 'https'
if (config.protocol === 'https') {
    // Create server using https
    server = https.createServer(
        {
            key: fs.readFileSync(config.certificate.privkey, 'utf8'),  // Read private key file
            cert: fs.readFileSync(config.certificate.fullchain, 'utf8'),  // Read full chain certificate file
        },
        app
    );
} else {
    // Create server using http if protocol is 'http' or any other value
    server = http.createServer(app);
}

// Start the server and listen to the configured port
server.listen(config.port, () => {
    // Log a message indicating the server is running
    console.log(`Server is running on ${config.protocol}://localhost:${config.port} in ${config.node_env}`);
});
