import { useEffect, useState } from "react";
import Moralis from "moralis";
import {
  MORALIS_CHAIN,
  MORALIS_KEY,
  BASE_URI,
  REWARDS_INFO,
  REWARDS_DATA,
  REWARDS_VALUE,
  REWARDS_ID,
  TOKEN_DECIMALS,
  NFTCollectionContractAddress,
  tokenContractAddress,
} from "../config/appconf";
import { useBalance } from "wagmi";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import { getGateway, axiosConfig, imgTimeout } from "../interface/url/gateway";
import { getUnlockTime } from "../utils/daysutil";
import { calcPendingRewards } from "../utils/rewardsutil";
import {
  TokenProps, NFTProps, MetaType, TokenMetaType,
  StakeActiveProps, StakeActiveAllProps
} from '../types/Types';
import { tokenMetaDefault } from "../types/Defaults";

const axiosHTTP = rateLimit(axios.create(), axiosConfig);

export const TokenHelperComponent = ({
  address,
  claimableRewards,
  stakedNFTs,
}: TokenProps) => {
  const [activeDaysValue, setActiveDaysValue]: [number, any] = useState(
    REWARDS_VALUE.GOLD
  );

  const { data: tokenData } = useBalance({
    addressOrName: address,
    token: tokenContractAddress,
  });

  const updateActiveDays = (nextValue: number) => {
    setActiveDaysValue(() => nextValue);
  };

  return (
    <div className={styles.tokenGrid}>
      <div className={styles.tokenItem}>
        <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
        <p className={styles.tokenValue}>
          <b>
            {!claimableRewards
              ? "Loading..."
              : ethers.utils.formatUnits(claimableRewards, TOKEN_DECIMALS)}
          </b>{" "}
          {tokenData?.symbol}
        </p>
      </div>

      <div className={styles.tokenItem}>
        <h3 className={styles.tokenLabel}>Pending Rewards</h3>
        <p className={styles.tokenValue}>
          <b>{calcPendingRewards(stakedNFTs)}</b> {tokenData?.symbol}
        </p>
      </div>

      <div className={styles.tokenItem}>
        <h3 className={styles.tokenLabel}>Current Balance</h3>
        <p className={styles.tokenValue}>
          <b>
            {tokenData?.formatted} {tokenData?.symbol}
          </b>
        </p>
      </div>

      <div className={styles.rewardsTokenItem}>
        <h3 className={styles.tokenLabel}>Rewards Info</h3>
        <div className={styles.rewardsTokenValue}>
          <b>{activeDaysValue}</b>
          {/* <b>{ethers.utils.formatUnits(activeDaysValue, TOKEN_DECIMALS)}</b> */}
          <div className={styles.daysBtnWrap}>
            {REWARDS_DATA.map(({ name, value }, index) => {
              return value === activeDaysValue ? (
                <button
                  className={styles.daysBtn}
                  onClick={() => updateActiveDays(value)}
                  key={index}
                  value={index}
                >
                  {name}
                </button>
              ) : (
                <button
                  className={styles.daysBtnDisabled}
                  onClick={() => updateActiveDays(value)}
                  key={index}
                  value={index}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StakeActiveComponent = ({ id, tierStake }: StakeActiveProps) => {
  const [stakeDaysValue, setStakeDaysValue]: [number, any] = useState(
    REWARDS_VALUE.GOLD
  );

  const [stakeTierId, setStakeTierId]: [number, any] = useState(REWARDS_ID.GOLD);

  const updateStakeDays = (nextStakeDays: number, nextStakeTierId: number) => {
    setStakeDaysValue(() => nextStakeDays);
    setStakeTierId(() => nextStakeTierId);
  };

  return (
    <>
      <b className={styles.stakeDaysValue}>
        {stakeDaysValue}
        {/* {ethers.utils.formatUnits(stakeDaysValue, TOKEN_DECIMALS)} */}
      </b>
      <div className={styles.daysBtnWrap}>
        {REWARDS_DATA.map(({ name, value, tierId }, index) => {
          return value === stakeDaysValue ? (
            <button
              className={styles.daysBtn}
              onClick={() => updateStakeDays(value, tierId)}
              key={index}
              value={index}
            >
              {name}
            </button>
          ) : (
            <button
              className={styles.daysBtnDisabled}
              onClick={() => updateStakeDays(value, tierId)}
              key={index}
              value={index}
            >
              {name}
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.mainButton} ${styles.spacerBottom}`}
        onClick={() => tierStake({
          tokenId: parseInt(id),
          tierId: stakeTierId
        })
        }
      >
        Stake
      </button>
    </>
  );
};

export const StakeActiveAllComponent = ({
  unstakedTokenIds,
  tierStakeAll,
}: StakeActiveAllProps) => {
  const [stakeDaysValue, setStakeDaysValue]: [number, any] = useState(
    REWARDS_VALUE.GOLD
  );

  const [stakeTierId, setStakeTierId]: [number, any] = useState(REWARDS_ID.GOLD);

  const updateStakeDays = (nextStakeDays: number, nextStakeTierId: number) => {
    setStakeDaysValue(() => nextStakeDays);
    setStakeTierId(() => nextStakeTierId);
  };

  return (
    <>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
      <b className={styles.vstakeDaysValue}>
        {stakeDaysValue * unstakedTokenIds.length}
        {/* {ethers.utils.formatUnits(
          stakeDaysValue * unstakedTokenIds.length,
          TOKEN_DECIMALS
        )} */}
        SHIWA
      </b>
      <div className={styles.vdaysBtnWrap}>
        {REWARDS_DATA.map(({ name, value, tierId }, index) => {
          return value === stakeDaysValue ? (
            <button
              className={styles.daysBtn}
              onClick={() => updateStakeDays(value, tierId)}
              key={index}
              value={index}
            >
              {name}
            </button>
          ) : (
            <button
              className={styles.daysBtnDisabled}
              onClick={() => updateStakeDays(value, tierId)}
              key={index}
              value={index}
            >
              {name}
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.vmainButton} ${styles.spacerBottom}`}
        onClick={() => tierStakeAll({
          tokenIds: unstakedTokenIds,
          tierId: stakeTierId
        })}
      >
        Stake All
      </button>
    </>
  );
};

export const NFTHelperComponent = ({
  address,
  stakedNFTs,
  tierClaim,
  tierWithdraw,
  tierWithdrawAll,
  tierStake,
  tierStakeAll,
}: NFTProps) => {
  const [isMoralis, setMoralis]: [boolean, any] = useState(false);
  const [stakedMetadata, setStakedMetadata]: [TokenMetaType, any] =
    useState(tokenMetaDefault);
  const [unstakedMetadata, setUnstakedMetadata]: [TokenMetaType, any] =
    useState(tokenMetaDefault);

  const [isStakedData, setIsStakedData]: [boolean, any] = useState(false);
  const [isUnstakedData, setIsUnstakedData]: [boolean, any] = useState(false);
  const [unstakedTokenIds, setUnstakedTokenIds]: [number[], any] = useState([]);

  const connectMoralis = async () => {
    await Moralis.start({
      apiKey: MORALIS_KEY,
    });
    setMoralis(() => true);
  };

  const fetchUnstaked = async () => {
    if (!isMoralis) return;
    const stakedMap = new Map();
    await stakedNFTs.forEach((elem) => {
      stakedMap.set(elem.tokenId, true);
    });
    const fetchedNFTs = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: MORALIS_CHAIN,
      tokenAddresses: [NFTCollectionContractAddress],
    });

    const unstakedDatas = fetchedNFTs.result
      .map((elem) => {
        return {
          id: elem.result.tokenId,
          name: elem.result.metadata?.name,
          image: elem.result.metadata?.image,
        };
      })
      .filter((elem) => {
        return stakedMap.get(Number(elem.id)) === undefined;
      });

    const tokenIds = unstakedDatas.map(({ id }) => {
      return id;
    });

    setUnstakedMetadata(() => unstakedDatas);
    setUnstakedTokenIds(() => tokenIds);
    setIsUnstakedData(() => true);
  };

  const fetchStaked = async () => {
    if (!isMoralis) return;
    const tokenMetadata = await Promise.all(
      stakedNFTs.map(async (elem) => {
        return await axiosHTTP.get(
          `${getGateway()}${BASE_URI}/${elem.tokenId}.json`
        );
      })
    );

    const stakedDatas = tokenMetadata.map((elem) => {
      return {
        id: elem.data.edition,
        name: elem.data.name,
        image: elem.data.image,
      };
    });

    setStakedMetadata(() => stakedDatas);
    setIsStakedData(() => true);
  };

  const handleImgError = (source: any) => {
    const sourceImg = source.currentsrc;
    source.currentTarget.onerror = null;
    setTimeout(() => {
      source.currentTarget.src = sourceImg;
    }, imgTimeout);
  };

  useEffect(() => {
    connectMoralis();
    fetchUnstaked();
    fetchStaked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMoralis]);

  return (
    <div>
      <h2>Your Staked NFTs</h2>
      <div className={styles.NFTBoxGrid}>
        {isStakedData &&
          stakedMetadata.map(({ id, name, image }: MetaType, index: number) => {
            const tokenId = stakedNFTs[index].tokenId;
            const stakedTime = stakedNFTs[index].stakedTime;
            const tierId = stakedNFTs[index].tierId;
            return (
              <div className={styles.NFTBox} key={index}>
                <div className={styles.NFTMedia} />
                <h3>{name}</h3>
                <h5>Unlocking {getUnlockTime(stakedTime, tierId)}</h5>
                <h5>
                  Staked for {REWARDS_INFO[tierId]}
                </h5>
                <img
                  src={`${getGateway()}${image.replace("ipfs://", "")}`}
                  alt={name}
                  width={150}
                  height={150}
                  loading={"lazy"}
                  onError={(source) => handleImgError(source)}
                />
                <div className={"btn-wrap"}>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => tierClaim({
                      tokenId: tokenId,
                      tierId: tierId
                    })}
                  >
                    Claim
                  </button>
                </div>
                <div className={"btn-wrap"}>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => tierWithdraw({
                      tokenId: tokenId,
                      tierId: tierId
                    })}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })
        }
      </div>
      {stakedMetadata?.length > 0 && (
        <>
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <div className={"btn-wrap"}>
            <button
              className={`${styles.mainButton} ${styles.spacerBottom}`}
              onClick={() => tierWithdrawAll()}
            >
              Withdraw All
            </button>
          </div>
        </>
      )}
      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      <h2>Your Unstaked NFTs</h2>
      <div className={styles.NFTBoxGrid}>
        {isUnstakedData &&
          unstakedMetadata.map(
            ({ id, name, image }: MetaType, index: number) => {
              return (
                <div className={styles.NFTBox} key={index}>
                  <div className={styles.NFTMedia} />
                  <h3>{name}</h3>
                  <img
                    src={`${getGateway()}${image.replace("ipfs://", "")}`}
                    alt={name}
                    width={150}
                    height={150}
                    loading={"lazy"}
                    onError={(source) => handleImgError(source)}
                  />

                  <StakeActiveComponent id={id} tierStake={tierStake} />
                </div>
              );
            }
          )
        }
      </div>
      {unstakedMetadata?.length > 0 && (
        <StakeActiveAllComponent
          unstakedTokenIds={unstakedTokenIds}
          tierStakeAll={tierStakeAll}
        />
      )}
    </div>
  );
};
