import {
    UNLOCK_INFO
} from "../config/appconf";

export const getUnlockTime = (stakedTime: number, tierId: number) => {
    const currentTime = new Date().getTime() / 1000;
    const elapsedTime = currentTime - stakedTime;
    const remainingTime = UNLOCK_INFO[tierId] - elapsedTime;
    const relativeTime = `in ${(remainingTime / 86400).toFixed()} Days`;
    return relativeTime;
};
