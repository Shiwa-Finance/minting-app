import { ethers } from "ethers";
import {
    REWARDS_INFO,
    TOKEN_DECIMALS
} from "../config/appconf";

export const calcPendingRewards = (stakedNFTs: any[]) => {
    let totalRewards: number = 0;
    stakedNFTs.forEach((elem) => {
        totalRewards += REWARDS_INFO[elem.tierId]
    });

    const formattedRewards = ethers.utils.formatUnits(totalRewards, TOKEN_DECIMALS);
    return formattedRewards;
};
