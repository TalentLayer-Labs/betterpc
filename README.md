# 🚀 BetteRPC

Despite decentralization being one of the core principles of web3, most dApps currently rely on centralized RPC providers to read/write data to the blockchain. This not only means that they have a single point of failure, but also that they are subceptible to censorship and reliability issues.

BetteRPC aims to accelerate the future of Web3 Infrastructure decentralization by providing an open and configurable decentralized RPC gateway. BetteRPC is able to achieve efficient, reliable and anonymous RPC calls by leveraging a peer-to-peer network powered by [fluence](https://fluence.dev/docs/learn/overview) ♥.

## How does it work? 

BetterRPC project is built with [fluence](https://fluence.dev/docs/learn/overview), a decentralized serverless platform and computing marketplace powered by blockchain economics.

BetteRPC works by using multiple RPC providers and tracking a score for each of them by looking at metrics like latency and reliability.

### Calculating provider scores

In order to measure these metrics a `quorum` algorithm is used. When receiving an RPC call, it is executed in parallel on all the providers and then a quorum is executed by checking if a given threshold of providers returned the same value. Providers' scores are then updated in the following way:

- The provider with the fastest response will get points
- If the quorum passed, the providers whose response was aligned with the quorum will get point
- If a call failed, the provider will lose points. This only applies if not all of the calls failed, since this would probably mean that the request was bad.

The points obtained/lost for each of these factors are configurable, in order to make it easy for every dApp to adapt the system to their needs.

The quorum algorithm is implemented in the `quorum` function in `rpc.aqua` and with two main services:

- `QuorumChecker`: executes the quorum
- `ScoreTracker`: updates the providers score


### Optimized calls

BetteRPC provides a way to execute a optimized RPC calls. This works by using the providers ordered by score and handling failover.
Basically, the call will be first tried with the provider with the highest score. If it fails, the second provider will be used, and so on.

Optimized calls make sense only if the scores have been updated a considerable number of times. The system will then use the `quorum` algorithm for the first calls, and after that optimized calls will become available.

This features is implemented in the `optimized` function in `rpc.aqua`.

## Configuration

BetteRPC can be configured by editing `/fluence/gateway/config.json`.
The main available options are:

- `providers`: array of provider urls to use
- `latencyPoints`: points obtained by the fastest provider
- `quorumPoints`: points obtained by providers aligned with quorum
- `failedCallPoints`: points lost when a call failss (should be negative)
- `quorumNumber`: threshold for quorum
- `minimumScoreUpdates`: number of times that provider scores need to be updated before using optimized calls



## Prerequites

- Install Docker on your machine: https://www.docker.com/get-started.
- Having fluence setup: 
```bash
npm -g i @fluencelabs/cli@latest
```

## Installation

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

