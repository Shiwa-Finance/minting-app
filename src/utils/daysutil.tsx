import {
    UNLOCK_INFO,
    REWARDS_INFO
} from '../config/appconf';

export const getUnlockTime = (stakedTime: number, tierId: number) => {
    const currentTime = new Date().getTime() / 1000;
    const elapsedTime = currentTime - stakedTime;
    const remainingTime = UNLOCK_INFO[tierId] - elapsedTime;
    const relativeTime = `in ${(remainingTime / 86400).toFixed()} Days`;
    return relativeTime;
};

export const getRewardInfo = (tierId: number) => {
    return `${REWARDS_INFO[tierId]} tokens`;
};
