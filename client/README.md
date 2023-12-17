

## SET UP

First, install the dependencies from the package.json by running:
```bash
npm install
#or
yarn
```
Then, you can run a development server with:

```bash
npm run dev
# or
yarn dev
```
if you do not want to run a development server, you can build the pages inorder to make the rendering faster by running:

```bash
npm run build

#if build was succesfully, you can then run 

npm run start
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. if you have something running on port 3000, it switches to port 3001.

Once you connect your wallet, be sure to check that you are on sepolia test net.


# React

React as a frame work makes development really easy but complicated sometimes. Building a minimalistic website with react was really easy to do. I used frameworks like tailwind,flowbite and headlessui. it was a pretty straight foward design. i had gradients initially but it was messing with my elements, so i have it removed. 

# Intergration
### Web3modal
The integration starts with web3modal as instructed, i used the web3button from the framework to authenticate users and load them on the blockchain. the dapp only works if you are connected to the sepolia network, to prevent waste of tokens.

### ethers.js

ethers is the go to framework for blockchain development. Although there are frameworks out there that makes it really easy to interact with the blockchain but using ethers shows you have a good knowledge of how ethereum works. I hope i achieved that. The integration started with getting the busd token contract instance and connecting it with a web3provider signer. The flow of the logic was 

1. a caller make an approve call to the token contract to approve our BUSDHandler to transfer tokens on there behalf.
2. the contract listens for the Approval event with the event signature and topics as filters.
3. Upon the return of a resolve, we can go ahead an call the transferFrom function that allows us to excute transfers on behalf of our caller.

it's a pretty straight forward logic, but i noticed that metamask overrides the third arguement which is the allowance value and prompts the user to input a token amount personally and sign the transaction. This is a good security pratice because given an mischievious contract that kind of power is terrible.

The integration tries to insist on some functionalites like you must have connected a wallet before you can click the transfer button, you must have inputed an address before you will be able to submit the input and notifications on the outcome of your transaction.

The code actually performs 2 transactions because we interact with the chain twice. first to approve our contact and second to transfer the tokens. so there will be 2 metamask prompts to sign transactions. All these happens only when you are connected to the sepolia testnet. chain id, rpc and privatekey can be found in .env in the chain folder.

Unfortunately, ethers do not do much for error handling but it was a good project and i hope i showed my knowlegde of these frameworks with this project. 