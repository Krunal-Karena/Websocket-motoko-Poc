# IC WebSocket example - A simple pingpong - Motoko backend

This is an example of how to use IC WebSockets to send and receive messages between the frontend (browser) and the backend canister.

The example uses the IC WebSocket libraries:
- [ic-websocket-js](https://github.com/omnia-network/ic-websocket-sdk-js) for the frontend
- [ic-websocket-cdk-mo](https://github.com/omnia-network/ic-websocket-cdk-mo) for the backend

The frontend connects to an IC WebSocket Gateway hosted on AWS under the [gatewayv1.icws.io](wss://gatewayv1.icws.io) domain and maintained by the [Omnia Network](https://github.com/omnia-network) team. To know more about how the IC WebSocket Gateway works, please refer to the [IC WebSocket Gateway](https://github.com/omnia-network/ic-websocket-gateway) repository.

## Demo

A **live demo** is available at [https://kbnvh-dqaaa-aaaal-qcd7a-cai.icp0.io/](https://kbnvh-dqaaa-aaaal-qcd7a-cai.icp0.io/).

## Understanding the example

### Frontend

The frontend canister is simple a [React](https://react.dev/) app written in TypeScript.

### Backend

The backend canister is a [Motoko canister](https://internetcomputer.org/docs/current/developer-docs/backend/motoko/). The relevant code to understand how to use the ic-websocket-cdk-mo library is in the [main.mo](src/pingpong_backend/main.mo) file.

## Development

### Running the project locally

If you want to test your project locally, follow these preparation steps:
- make sure you are running an IC WebSocket Gateway locally. See the [IC WebSocket Gateway](https://github.com/omnia-network/ic-websocket-gateway) repository for more details.
- change the addresses of the local replica and the local IC WebSocket Gateway at the top of the [ws.ts](src/pingpong_frontend/src/utils/ws.ts) file.

After completing the preparation steps, run the following commands:

```bash
# Install the mops packages
mops install

# Install the npm packages
npm install

# Starts the replica, running in the background
dfx start --clean --background
```

## Clone [Repo](https://github.com/omnia-network/ic-websocket-gateway)

Then start local gateway on cloned repo
```
cargo run
```

### Now get back to current repo

Deploys your canisters to the replica and generates your candid interface
```
dfx deploy
```

If you are making frontend changes, you can start a development server with

```bash
npm start
```

## License

Licensed under the [MIT License](./LICENSE).
