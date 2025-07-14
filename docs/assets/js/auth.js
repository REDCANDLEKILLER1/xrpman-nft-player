const NFTValidator = {
  validateURI: (uri) => {
    const decoded = atob(uri);
    return decoded.match(/^https:\/\/(ipfs\.io|arweave\.net)\/.+\.(mp3|wav|ogg)$/);
  },

  validateCollection: (nfts) => {
    return nfts.filter(nft => {
      return nft.Issuer === 'r9nepSD5tvQUCA4qQAJDAoBB3j1gf4ibL' && 
             this.validateURI(nft.URI);
    }).map(nft => ({
      audio: atob(nft.URI),
      image: nft.image || './icons/icon-512x512.png',
      title: nft.name || `XRPMAN #${nft.Taxon}`,
      tokenId: nft.NFTokenID
    }));
  }
};

async function connectXUMM() {
  if (window.xumm) {
    const xumm = new Xumm(API_KEY);
    const { address } = await xumm.authorize();
    return address;
  }
  throw new Error("XUMM not detected");
}

async function fetchNFTs(wallet) {
  const client = new xrpl.Client("wss://xrplcluster.com");
  await client.connect();
  
  const response = await client.request({
    command: "account_nfts",
    account: wallet
  });
  
  client.disconnect();
  return response.result.account_nfts;
}
