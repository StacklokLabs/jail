# ✨ Solana Token API 🚀

[![NPM Version](https://img.shields.io/npm/v/solana-token-api.svg)](https://www.npmjs.com/package/solana-token-api) 
[![NPM Downloads](https://img.shields.io/npm/dm/solana-token-api.svg)](https://www.npmjs.com/package/solana-token-api)
[![License](https://img.shields.io/npm/l/solana-token-api.svg)](LICENSE)

**The ultimate, easiest way to fetch comprehensive Solana token data for any wallet address!**

Tired of juggling multiple APIs and complex setups just to get basic token information like names, symbols, logos, prices, and USD values for a Solana wallet? **Look no further!** `solana-token-api` is designed from the ground up for simplicity and power.

With just **one single function call**, you get everything you need. Seriously, it's that easy.

---

## 🤔 Why Choose `solana-token-api`?

*   **✅ All-in-One Data:** Get token `name`, `symbol`, `logo`, current `price`, `amount` held, and total `valueUSD` in a single response.
*   **⚡️ Dead Simple API:** Forget complex configurations. Just import `getAddressTokens` and call it with a wallet address. That's it!
*   **💰 Accurate Pricing:** Leverages the powerful [Jupiter Price API](https://quote-api.jup.ag/v6/price) for reliable, up-to-date token prices.
*   **🖼️ Rich Metadata:** Uses the Metaplex standard ([@metaplex-foundation/js](https://github.com/metaplex-foundation/js)) to fetch accurate token names, symbols, and logos.
*   **🚀 Built for Solana Developers:** Perfect for wallets, portfolio trackers, dashboards, or any application needing quick access to Solana token data.
*   **⚙️ Lightweight & Focused:** Does one job and does it exceptionally well.

---

## 💾 Installation

```bash
# Using npm
npm install solana-token-api @solana/web3.js

# Using yarn
yarn add solana-token-api @solana/web3.js
```

(Note: `@solana/web3.js` is a peer dependency, as you'll need it to establish a `Connection` to the Solana network.)

## 🚀 Quick Start: Get Token Data in Seconds!
It truly couldn't be simpler. See for yourself:

```javascript
const { getAddressTokens } = require('solana-token-api');
const { Connection, PublicKey } = require('@solana/web3.js');

const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

const walletAddress = 'YOUR_SOLANA_WALLET_ADDRESS_HERE'; // Replace with actual address

async function fetchTokenData() {
  try {
    const tokens = await getAddressTokens(connection, walletAddress);
    console.log('Fetched Tokens:', tokens);
  } catch (error) {
    console.error('Error fetching token data:', error);
  }
}

fetchTokenData();
```

## 📚 API Reference
`getAddressTokens(connection, address)`

The one and only function you need to use! Fetches all SPL tokens held by a given Solana wallet address, enriching them with metadata and pricing information.

### Parameters:
- `connection`: An instance of `@solana/web3.js` `Connection`.
- `address`: `string` 

### Returns: 
- `mint`: `string` - The mint address of the token.
- `amount`: `number` - The quantity of the token held by the wallet (parsed UI amount).
- `name`: `string` - The full name of the token (e.g., "USD Coin"). Defaults to "UNKNOWN" if not found.
- `symbol`: `string` - The symbol of the token (e.g., "USDC"). Defaults to "UNKNOWN" if not found.
- `logo`: `string` - A URL to the token's logo image. Defaults to "UNKNOWN" if not found.
- `price`: `number` - The current price of one token in USD. Defaults to "0" if pricing data is unavailable.
- `valueUSD`: `string` - The total value of the tokens held in USD, formatted to two decimal places (e.g., "150.75").


## 🙌 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.