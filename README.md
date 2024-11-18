# Fabriq SDK Example

A minimal example script that bridges an ERC20 from Sepolia to OP Sepolia by publishing an intent to our public intent pool. Our solver will then try to fill the intent.

## Setup

1. Currently our solver only operates on a small set of custom test tokens. Message us on [Discord](https://discord.com/invite/gacndQvTpP) and we will send you some.
2. Once you have an account with some test tokens, add its private key to the script. You will also need a small amount of gas.

## Running the exampe

```
npm install
npm run start -- YOUR_PRIVATE_KEY
```
