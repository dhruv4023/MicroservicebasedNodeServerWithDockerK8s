# Node.js Microservices with Docker
This repository contains a Node.js microservice-based application consisting of the following services:

 - **Main Service** - The core service that interacts with other services.
 - **Auth Service** - Handles authentication and authorization.
 - **Post Service** - Manages the posts.
 - **Comment Service** - Manages comments on posts.
All services are containerized using Docker for easy deployment and scaling.

## Prerequisites
Ensure you have the following installed on your local machine:

- Docker (https://www.docker.com/get-started)

## Getting Started
1. Clone the Repository
    ```bash
    git clone https://github.com/dhruv4023/MicroservicebasedNodeServerWithDocker.git
    cd MicroservicebasedNodeServerWithDocker
    ```

2. Build Docker Images and start running a compose container
Each service has its own Dockerfile. To build and run all services, execute the following command:

    ```bash
    docker-compose up --build
    ```

    ***Note**: use following to detach the terminal after build*
    ```bash
    docker-compose up --build -d
    ```
    
    This will build and start all the services, and you can view the logs in the terminal.

3. to stop and remove compose container with data
    ```bash
    docker-compose down -v
    ```

3. Accessing Services
    - Main Service: Accessible at http://localhost:5000
    - Auth Service: Accessible at http://localhost:5001
    - Post Service: Accessible at http://localhost:5002
    - Comment Service: Accessible at http://localhost:5003