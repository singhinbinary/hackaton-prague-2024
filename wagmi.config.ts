const { http, createConfig } = require('wagmi');
const { mainnet, sepolia } = require('wagmi/chains');

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
