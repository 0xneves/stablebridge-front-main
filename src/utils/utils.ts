import store from '../store'
import { router } from '../main';
import { Contract, ethers, Signer } from 'ethers'
import { abi } from '../constants/constants'
declare global {
  interface Window{
    ethereum?: any;
  }
}
interface NetworkProps {
    prettyName: string;
    chainId: number;
    logo: string;
}

export const connectWallet = async () => {
    await window.ethereum.enable()
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];
    store.dispatch('updateAccountAddress', accounts[0]);
    provider.on('accountsChanged', function (accounts) {
      account = accounts[0];
      store.dispatch('updateAccountAddress', accounts[0]);
    });

    changeNetwork({
        prettyName: "Polygon",
        chainId: 137,
        logo: "/polygon.svg"
    })
    updateBalance();
}

export const updateBalance = async () => {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  
  const walletAddress = accounts[0]
  const address = store.getters.getContractAddress;
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = await provider.getSigner(walletAddress)
  const contract = new Contract(address, abi, signer);
  const balance = await contract.balanceOf(walletAddress);
  const balanceFormatted = ethers.utils.formatUnits(balance, 6);

  console.log(balanceFormatted.toString());
  store.dispatch('updateAccountBalance', balanceFormatted)
}

export const listenToPayment = async () => {
  setInterval(async () => {
    const myHeaders = new Headers();

    myHeaders.append('Content-Type', 'application/json')

    const res = await fetch(`${import.meta.env.VITE_PIX_API}/verify-pix`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
          id: store.getters.getPixData.id
        }),
    })
    const data = await res.json();

    if (data.approved) {
      clearInterval;
      router.push({ path: '/', query: {
        message: `Successfully added SBRL via PIX to your wallet.`
      } });
    }
  }, 5000)
}

export const listenBalance = () => {
  setInterval(() => {
    updateBalance()
  }, 10000)
}

export const changeNetwork = async (network: NetworkProps) => {
    store.dispatch('updateCurrentNetwork', network.prettyName)
    store.dispatch('updateAccountBalance', '---')

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${network.chainId}` }],
      });
    } catch (switchError: any) {
      if (switchError && switchError.code === 4902) {
        try {
          const chainIdInHex = ethers.utils.hexValue(network.chainId)

          switch (network.chainId) {
            case 250:
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: chainIdInHex,
                    chainName: 'Fantom',
                    rpcUrls: ['https://rpc.ftm.tools'],
                  },
                ],
              });
              store.dispatch('updateContractAddress', '0x091F87f4629C0E8C5b4B892b40f9a8f5D9af1322');
              break;
            case 137:
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: chainIdInHex,
                    chainName: 'Polygon Mainnet',
                    rpcUrls: ['https://polygon-rpc.com/'],
                  },
                ],
              });
              store.dispatch('updateContractAddress', '0x0DFcd028b5AD0E789AcB8d1C5bE1218FA59bC62A');
              break;
              case 56:
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: chainIdInHex,
                      chainName: 'BSC',
                      rpcUrls: ['https://binance.nodereal.io'],
                    },
                  ],
                });
              break;
          }
        } catch (addError) {
          console.error(addError)
        }
      }
    }
};

export const doBridge = async (toAddress: string, amount: string, chainId: number) => {
  const ethereum = (window as any).ethereum;
  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });
  
  const contractAddress = store.getters.getContractAddress;
  const provider = new ethers.providers.Web3Provider(ethereum)
  const walletAddress = accounts[0]    // first account in MetaMask
  const signer = provider.getSigner(walletAddress)
  const contract = new ethers.Contract(contractAddress, abi, signer)
  
  const numberOfDecimals = 6;
  const numberOfTokens = ethers.utils.parseUnits(amount, numberOfDecimals);

  const tx = await contract.burnToBridge(numberOfTokens, toAddress, chainId, {gasLimit: 3000000, gasPrice: ethers.utils.parseUnits('50', 'gwei')})
  console.log(tx)
}
