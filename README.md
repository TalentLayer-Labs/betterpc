## FLUENCE x TALENTLAYER 🚀 BetteRPC - ETH Denver 2023 🚀

## Overview / Description

---

BetterRPC project is built with Fluence, a decentralized serverless platform and computing marketplace powered by blockchain economics.

Fluence peers are a decentralized node that provides computing power and storage for distributed applications.
There is different way to select peers during a call like Random, RoundRobin, or QuorumChecker.

The goal of BetterRPC is to provide a better way to select peers for the application uses by sorting peers by

- Performance
- Reliability
- Latency
- Cost

# Installation

To install and run the project, follow these steps:

1. Install Docker on your machine, if it is not already installed. You can download Docker from the official website: https://www.docker.com/get-started.

2. Pull the BetterRPC Docker image from Docker Hub using the following command:

   `docker pull betterrpc/betterrpc`

   This will download the latest version of the BetterRPC Docker image to your machine.

3. Run the BetterRPC Docker image using the following command:

   `docker run -p 8080:8080 -e FLUENCE_SERVICE_ID=[YOUR_FLUENCE_SERVICE_ID] -e FLUENCE_SERVICE_KEY=[YOUR_FLUENCE_SERVICE_KEY] betterrpc/betterrpc`

   This will start a new Docker container and bind port 8080 on your local machine to port 8080 inside the container. It will also set the FLUENCE_SERVICE_ID and FLUENCE_SERVICE_KEY environment variables, which are required to connect to your Fluence service.

4. Open your browser and navigate to http://localhost:8080. You should see the BetterRPC web interface.

# Folder architecture

# Code details
