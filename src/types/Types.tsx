import { BigNumber } from "ethers";

export type CHAIN_TYPE = "MAINNET" | "TESTNET";

export type CHAINLIST_TYPE = {
    [index: string]: CHAIN_TYPE;
};

export type HomeProps = {
    address: `0x${string}` | undefined
};

export type StakedType = {
    tokenId: number;
    stakedTime: number;
    tierId: number;
}[];

export type TierType = {
    tokenId: number;
    tierId: number;
};

export type TierArrayType = {
    tokenIds: number[];
    tierId: number;
};

export type TokenProps = {
    address: string;
    claimableRewards: BigNumber | undefined;
    stakedNFTs: any[];
};

export type NFTProps = {
    address: string;
    stakedNFTs: any[];
    tierWithdraw: ({ tokenId, tierId }: TierType) => Promise<void>;
    tierClaim: ({ tokenId, tierId }: TierType) => Promise<void>;
    tierWithdrawAll: () => Promise<void>;
    tierStake: ({ tokenId, tierId }: TierType) => Promise<void>;
    tierStakeAll: ({ tokenIds, tierId }: TierArrayType) => Promise<void>;
};

export type MetaType = {
    id: string;
    name: string;
    image: string;
};

export type TokenMetaType = {
    id: string;
    name: string;
    image: string;
}[];

export type StakeActiveProps = {
    id: string;
    tierStake: ({ tokenId, tierId }: TierType) => Promise<void>;
};

export type StakeActiveAllProps = {
    unstakedTokenIds: number[];
    tierStakeAll: ({ tokenIds, tierId }: TierArrayType) => Promise<void>;
};
