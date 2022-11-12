import './styles/App.css';

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public';
import Home from './components/Home';
import {
  APP_CHAIN
} from './config/appconf';

const { chains, provider, webSocketProvider } = configureChains(
  [
    APP_CHAIN === 'MAINNET' ? chain.mainnet :
      chain.polygonMumbai
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: APP_CHAIN === 'MAINNET' ?
          `https://rpc.ankr.com/eth` :
          `https://rpc-mumbai.maticvigil.com`
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="App">
          <Home />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
