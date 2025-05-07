const { PublicKey } = require("@solana/web3.js");
const { Metaplex } = require("@metaplex-foundation/js");
const fetch = require("node-fetch");

async function getTokenMetadata(connection, mintAddress) {
    try {
        const metaplex = Metaplex.make(connection);
        const mintPubKey = new PublicKey(mintAddress);
        const token = await metaplex.nfts().findByMint({ mintAddress: mintPubKey });

        return {
            mint: mintAddress.toString(),
            name: token?.name || "UNKNOWN",
            symbol: token?.symbol || "UNKNOWN",
            logo: token?.json?.image || "UNKNOWN"
        };
    } catch (error) {
        return { mint: mintAddress.toString(), name: "UNKNOWN", symbol: "UNKNOWN", logo: "UNKNOWN" };
    }
}

async function getTokenAccounts(connection, address) {
    const pubKey = new PublicKey(address);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") });
    
    return tokenAccounts.value.map(acc => ({
        mint: acc.account.data.parsed.info.mint,
        amount: acc.account.data.parsed.info.tokenAmount.uiAmount
    })).filter(token => token.amount > 0);
}

async function getTokenPrices(mintAddresses) {
    const priceResponse = await fetch(
        `https://api.jup.ag/price/v2?ids=${mintAddresses.join(',')},So11111111111111111111111111111111111111112`
    );
    
    const priceData = await priceResponse.json();

    return mintAddresses.reduce((acc, mint) => {
        const priceInfo = priceData["data"][mint];
        acc[mint] = priceInfo && priceInfo.price ? parseFloat(priceInfo.price) : 0;
        return acc;
    }, {});
}

async function getAddressTokens(connection, address) {
    const tokens = await getTokenAccounts(connection, address);
    const mintAddresses = tokens.map(t => t.mint);
    const metadata = [];

    for (const mint of mintAddresses) {
        const meta = await getTokenMetadata(connection, mint);
        metadata.push(meta);
    }

    const prices = await getTokenPrices(mintAddresses);

    return tokens.map(token => {
        const meta = metadata.find(m => m.mint === token.mint);
        return {
            mint: token.mint,
            amount: token.amount,
            name: meta?.name || "UNKNOWN",
            symbol: meta?.symbol || "UNKNOWN",
            logo: meta?.logo || "UNKNOWN",
            price: prices[token.mint] || 0,
            valueUSD: (token.amount * (prices[token.mint] || 0)).toFixed(2)
        };
    });
}

module.exports = { getTokenAccounts, getTokenMetadata, getTokenPrices, getAddressTokens };
