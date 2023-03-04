# 🚀 BetteRPC

Transactions on blockchains are still centralized when broadcasted by Remote Call Procedure (RPC), which makes them susceptible to censorship, as well as problems related to reliability and integrity.
BetteRPC aims to accelerate the future of Web3 Infrastructure decentralization by providing an open and configurable decentralized RPC gateway. BetteRPC achieves anonymity by creating a peer-to-peer network for RPCs powered by (fluence ♥)[https://fluence.dev/docs/learn/overview]

## How it works? 

BetterRPC project is built with (fluence ♥)[https://fluence.dev/docs/learn/overview], a decentralized serverless platform and computing marketplace powered by blockchain economics.

### Configuration

There is different way to select peers during a call like Random, RoundRobin, or QuorumChecker.

The goal of BetterRPC is to provide a better way to select peers for the application uses by sorting peers by

- Performance
- Reliability
- Latency
- Cost

### Prerequites

- Install Docker on your machine: https://www.docker.com/get-started.
- Having fluence setup: 
```bash
npm -g i @fluencelabs/cli@latest
```

### Installation

Clone the repo

```bash
git clone git@github.com:TalentLayer-Labs/betterpc.git
```

Build fluence:
```bash
cd fluence
fluence build
```

Deploy the deal and follow the instructions: 
```bash
fluence deal deploy
```

Configure the frontend demo:
```bash
cp -n indie-frontend/.env.example indie-frontend/.env
```

Launch frontend demo and backend gateway via docker

```bash
docker-compose up -d
```

Now you can access to:
- Frontend: http://localhost:5173
- Backend Gateway: http://localhost:8080

