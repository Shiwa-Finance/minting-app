import {
    REWARDS_INFO
} from "../config/appconf";

export const calcPendingRewards = (stakedNFTs: any[]) => {
    let totalRewards: number = 0;
    stakedNFTs.forEach((elem) => {
        totalRewards += REWARDS_INFO[elem.tierId]
    });

    const formattedRewards = totalRewards;
    return formattedRewards;
};
