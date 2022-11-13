import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../styles/Home.module.css";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import icon from "../assets/siwamain.gif";
import bronze from "../assets/bronze.png";
import silver from "../assets/silver.png";
import gold from "../assets/gold.png";
import {
  NFTCollectionContractAddress,
  stakingContractAddress,
} from "../config/appconf";
import { stakingABI, NFTCollectionABI } from "../interface/abi/index";
import { TokenHelperComponent, NFTHelperComponent } from "./Helper";
import { HomeProps, StakedType, TierType, TierArrayType } from "../types/Types";
import { stakedDefault } from "../types/Defaults";

const Home = ({ address }: HomeProps) => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  const stakingContract = useContract({
    address: stakingContractAddress,
    abi: stakingABI,
    signerOrProvider: signer,
  });

  const NFTCollectionContract = useContract({
    address: NFTCollectionContractAddress,
    abi: NFTCollectionABI,
    signerOrProvider: signer,
  });

  const [stakedNFTs, setStakedNFTs]: [StakedType, any] =
    useState(stakedDefault);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const [isStakedFetched, setStakedFetched]: [boolean, any] = useState(false);
  const [isClaimableFetched, setClaimableFetched]: [boolean, any] =
    useState(false);

  useEffect(() => {
    if (!isConnected && !signer) return;
    const fetchStakedNFTs = async () => {
      const stakedTokens = await stakingContract?.getTokenTiers(address);
      const stakedNumberTokens = await stakedTokens.map((elem: any) => {
        return ({
          tokenId: elem.tokenId.toNumber(),
          stakedTime: elem.stakedTime.toNumber(),
          tierId: elem.tierId.toNumber()
        });
      });
      setStakedNFTs(() => stakedNumberTokens);
      setStakedFetched(() => true);
    };

    const fetchClaimableRewards = async () => {
      const claimableTokens = await stakingContract?.getTokenRewards(address);
      setClaimableRewards(() => claimableTokens);
      setClaimableFetched(() => true);
    };

    if (isConnected && signer) {
      fetchStakedNFTs();
      fetchClaimableRewards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, signer, isConnected]);

  const isNFTApproved = async (tokenId: number) => {
    const getApproved = await NFTCollectionContract?.getApproved(tokenId);
    return getApproved === stakingContractAddress;
  };

  const isNFTApprovedForAll = async () => {
    const isApprovedForAll = await NFTCollectionContract?.isApprovedForAll(
      address,
      stakingContractAddress
    );
    return isApprovedForAll;
  };

  const tierClaim = async ({ tokenId, tierId }: TierType) => {
    if (!isConnected && !signer) return;
    try {
      await stakingContract?.claimTier(tokenId, tierId);
    } catch (error: any) {
      window.alert(error.reason);
    }
  };

  const tierClaimAll = async () => {
    if (!isConnected && !signer) return;
    try {
      await stakingContract?.claimTierAll();
    } catch (error: any) {
      window.alert(error.reason);
    }
  };

  const tierWithdraw = async ({ tokenId, tierId }: TierType) => {
    if (!isConnected && !signer) return;
    try {
      await stakingContract?.withdrawTier(tokenId, tierId);
    } catch (error: any) {
      window.alert(error.reason);
    }
  };

  const tierWithdrawAll = async () => {
    if (!isConnected && !signer) return;
    try {
      await stakingContract?.withdrawTierAll();
    } catch (error: any) {
      window.alert(error.reason);
    }
  };

  const tierStake = async ({ tokenId, tierId }: TierType) => {
    if (!isConnected && !signer) return;
    const callValue = async () => {
      try {
        await stakingContract?.stakeTier(tokenId, tierId);
      } catch (error: any) {
        window.alert(error.reason);
      }
    };

    const isApprovedForAll = await isNFTApprovedForAll();

    if (isApprovedForAll) {
      callValue();
    } else {
      const isApproved = await isNFTApproved(tokenId);
      if (isApproved) {
        callValue();
      } else {
        await NFTCollectionContract?.setApprovalForAll(
          stakingContractAddress,
          true
        );
      }
    }
  };

  const tierStakeAll = async ({ tokenIds, tierId }: TierArrayType) => {
    if (!isConnected && !signer) return;

    const callValue = async () => {
      try {
        await stakingContract?.stakeTierAll(tokenIds, tierId);
      } catch (error: any) {
        window.alert(error.reason);
      }
    };

    const isApprovedForAll = await isNFTApprovedForAll();

    if (isApprovedForAll) {
      callValue();
    } else {
      await NFTCollectionContract?.setApprovalForAll(
        stakingContractAddress,
        true
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>SHIWA NFT Staking Dapp</h1>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
      <img src={icon} alt="" width={300} height={300} />
      <>
        <hr className={`${styles.divider} ${styles.spacerTop}`} />

        <h1>How it works</h1>
        <h2>
          There are three Tiers in the staking Dapp with different locktime and
          rewards
        </h2>
        <div className={styles.NFTBoxGrid}>
          <div className={styles.NFTBox}>
            <img src={bronze} alt="" width={100} height={100} />
            <h2>Bronze Tier</h2>
            <p className={styles.justify}>
              ■ NFTs will be locked for minimum of 30days
            </p>
            <p className={styles.justify}>
              ■ Rewards will be 200000000Shiwa tokens for each NFT you stake in
              this tier
            </p>

            <p className={styles.justify}>
              ■ If you decide to unstake before 30days, you will loose all your
              rewards.
            </p>
          </div>
          <div className={styles.NFTBox}>
            <img src={silver} alt="" width={100} height={100} />
            <h2>Silver Tier</h2>
            <p className={styles.justify}>
              ■ NFTs will be locked for minimum of 60days
            </p>
            <p className={styles.justify}>
              ■ Rewards will be 400000000Shiwa tokens for each NFT you stake in
              this tier
            </p>
            <p className={styles.justify}>
              ■ If you decide to unstake before 60days, you will loose all your
              rewards.
            </p>
          </div>
          <div className={styles.NFTBox}>
            <img src={gold} alt="" width={100} height={100} />
            <h2>Gold Tier</h2>
            <p className={styles.justify}>
              ■ NFTs will be locked for minimum of 90days
            </p>
            <p className={styles.justify}>
              ■ Rewards will be 600000000Shiwa tokens for each NFT you stake in
              this tier
            </p>
            <p className={styles.justify}>
              ■ If you decide to unstake before 90days, you will loose all your
              rewards.
            </p>
          </div>
        </div>

        <h2>Your SHIWA Tokens</h2>
        {isConnected && signer && isClaimableFetched && (
          <TokenHelperComponent
            address={address as string}
            claimableRewards={claimableRewards}
            stakedNFTs={stakedNFTs}
          />
        )}

        <div className={styles.btnWrap}>
          <ConnectButton />
        </div>

        {isConnected && signer && (
          <div className={styles.btnWrap}>
            <button
              className={`${styles.mainButton} ${styles.spacerTop}`}
              onClick={() => tierClaimAll()}
            >
              Claim Rewards
            </button>
          </div>
        )}

        <hr className={`${styles.divider} ${styles.spacerTop}`} />
        {!isStakedFetched &&
          <div>
            <h2>Your Staked NFTs</h2>
            <div className={styles.NFTBoxGrid}>
              <div className="loader" />
            </div>
            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <h2>Your Unstaked NFTs</h2>
            <div className={styles.NFTBoxGrid}>
              <div className="loader" />
            </div>
          </div>
        }
        {isConnected && signer && isStakedFetched && (
          <NFTHelperComponent
            address={address as string}
            stakedNFTs={stakedNFTs}
            tierClaim={tierClaim}
            tierWithdraw={tierWithdraw}
            tierWithdrawAll={tierWithdrawAll}
            tierStake={tierStake}
            tierStakeAll={tierStakeAll}
          />
        )}
      </>
    </div>
  );
};

export default Home;
