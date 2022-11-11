type CHAIN_TYPE = "MAINNET" | "TESTNET";

type CHAINLIST_TYPE = {
  [index: string]: CHAIN_TYPE;
};

export const CHAIN_LIST: CHAINLIST_TYPE = {
  MAINNET: "MAINNET",
  TESTNET: "TESTNET",
};

//[Edit]For Mainnet, use = CHAIN_LIST.MAINNET, CHAIN_LIST.TESTNET vice versa
export const APP_CHAIN: CHAIN_TYPE = CHAIN_LIST.MAINNET;

//[Edit]TESTNET addresses
export const testNFTCollectionContractAddress =
  "0x29aB34cFC0723696246E40604Ee09dD961D93b7c";
export const testTokenContractAddress =
  "0x40AE8c0fb1c1A6D36Fe90c07Da3129ad29C09AA6";
export const testStakingContractAddress =
  "0xd63Be2B5089cFa201FB2F6573eA724e6AC0a8aE5";

//[Edit]MAINNET addresses
export const mainNFTCollectionContractAddress =
  "0xF1f9d94bEDd9f0eF9b228892908661DC6A4f5680";
export const mainTokenContractAddress =
  "0x5022Cb6D39001CDD6F996e8a66500c86128f1cc4";
export const mainStakingContractAddress =
  "0x82385fEd6650C6a29f95189c2c827E0cbbc9AA31";

//[Edit]Moralis configs
export const MORALIS_KEY =
  "jyKPbpN3VPZRyktm4CHFvUVlUJtbm4wUgw4upMAyGI814QlibBmFS0oCjguSDwMP"; //Moralis WEB3 API_KEY
export const BASE_URI =
  "bafybeidprbjq7rf7snug32n3ejqimhjemdralzoirdj5nsgea3brswon2q"; //NFTCollection BASE_URI

//[Edit]Reward configs
export const REWARDS_INFO = [
  // 200000000000000000, 400000000000000000, 600000000000000000,
  2000000000000000, 40000000000000000, 6000000000000000,
]; //Rewards For 30D, 60D, 90D accordingly [without decimals]
export const UNLOCK_INFO = [2592000, 5184000, 7776000]; //durations in seconds for 30D, 60D, 90D
export const TOKEN_DECIMALS = 9; //ERC20 token decimals

export const REWARDS_DATA = [
  {
    name: "Gold",
    value: REWARDS_INFO[2],
    tierId: 2,
  },
  {
    name: "Silver",
    value: REWARDS_INFO[1],
    tierId: 1,
  },
  {
    name: "Bronze",
    value: REWARDS_INFO[0],
    tierId: 0,
  },
];

export const NFTCollectionContractAddress =
  APP_CHAIN === CHAIN_LIST.MAINNET
    ? mainNFTCollectionContractAddress
    : testNFTCollectionContractAddress;
export const tokenContractAddress =
  APP_CHAIN === CHAIN_LIST.MAINNET
    ? mainTokenContractAddress
    : testTokenContractAddress;
export const stakingContractAddress =
  APP_CHAIN === CHAIN_LIST.MAINNET
    ? mainStakingContractAddress
    : testStakingContractAddress;
export const MORALIS_CHAIN =
  APP_CHAIN === CHAIN_LIST.MAINNET ? "0x1" : "0x13881";
