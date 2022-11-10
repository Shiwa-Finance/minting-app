import { useEffect, useState } from "react";
import Moralis from "moralis";
import {
  MORALIS_CHAIN,
  MORALIS_KEY,
  BASE_URI,
  REWARDS_INFO,
  REWARDS_DATA,
  TOKEN_DECIMALS,
  NFTCollectionContractAddress,
  tokenContractAddress,
} from "../config/appconf";
import { useBalance } from "wagmi";
import styles from "../styles/Home.module.css";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import { getGateway, axiosConfig } from "../interface/url/gateway";
import { getUnlockTime, getRewardInfo } from "../utils/daysutil";
import { calcPendingRewards } from "../utils/rewardsutil";

type TokenProps = {
  address: string;
  claimableRewards: BigNumber | undefined;
  stakedNFTs: any[];
};

type NFTProps = {
  address: string;
  stakedNFTs: any[];
  tierWithdraw: (tokenId: number, tierId: number) => Promise<void>;
  tierClaim: (tokenId: number, tierId: number) => Promise<void>;
  tierWithdrawAll: () => Promise<void>;
  tierStake: (tokenId: number, tierId: number) => Promise<void>;
  tierStakeAll: (tokenIds: number[], tierId: number) => Promise<void>;
};

type MetaType = {
  id: string;
  name: string;
  image: string;
};

type TokenMetaType = {
  id: string;
  name: string;
  image: string;
}[];

type StakeActiveProps = {
  id: string;
  tierStake: (tokenId: number, tierId: number) => Promise<void>;
};

type StakeActiveAllProps = {
  unstakedTokenIds: number[];
  tierStakeAll: (tokenIds: number[], tierId: number) => Promise<void>;
};

const tokenMetaDefault = [
  {
    id: "",
    name: "",
    image: "",
  },
];

const axiosHTTP = rateLimit(axios.create(), axiosConfig);

export const TokenHelperComponent = ({
  address,
  claimableRewards,
  stakedNFTs,
}: TokenProps) => {
  const [activeDaysValue, setActiveDaysValue]: [number, any] = useState(
    REWARDS_DATA[0].value
  );
  const { data: tokenData } = useBalance({
    addressOrName: address,
    token: tokenContractAddress,
  });

  const updateActiveDays = (nextValue: number) => {
    setActiveDaysValue(nextValue);
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
          <b>{ethers.utils.formatUnits(activeDaysValue, TOKEN_DECIMALS)}</b>
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
    REWARDS_DATA[0].value
  );
  const [stakeTierId, setStakeTierId]: [number, any] = useState(0);

  const updateStakeDays = (nextStakeDays: number, nextStakeTierId: number) => {
    setStakeDaysValue(nextStakeDays);
    setStakeTierId(nextStakeTierId);
  };

  return (
    <>
      <b className={styles.stakeDaysValue}>
        {ethers.utils.formatUnits(stakeDaysValue, TOKEN_DECIMALS)}
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
        onClick={() => tierStake(parseInt(id), stakeTierId)}
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
    REWARDS_DATA[0].value
  );
  const [stakeTierId, setStakeTierId]: [number, any] = useState(0);

  const updateStakeDays = (nextStakeDays: number, nextStakeTierId: number) => {
    setStakeDaysValue(nextStakeDays);
    setStakeTierId(nextStakeTierId);
  };

  return (
    <>
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
      <hr className={`${styles.divider} ${styles.spacerTop}`} />
      <b className={styles.vstakeDaysValue}>
        {ethers.utils.formatUnits(
          stakeDaysValue * unstakedTokenIds.length,
          TOKEN_DECIMALS
        )}{" "}
        SWIWA
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
        onClick={() => tierStakeAll(unstakedTokenIds, stakeTierId)}
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
    setMoralis(true);
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

    setUnstakedMetadata(unstakedDatas);
    setUnstakedTokenIds(tokenIds);
    setIsUnstakedData(true);
  };

  const fetchStaked = async () => {
    if (!isMoralis) return;
    const tokenMetadata = await Promise.all(
      stakedNFTs.map(async (elem) => {
        return await axiosHTTP.get(
          `${getGateway()}${BASE_URI}/${parseInt(elem.tokenId, 16)}.json`
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

    setStakedMetadata(stakedDatas);
    setIsStakedData(true);
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
                  Staked for
                  {ethers.utils.formatUnits(
                    REWARDS_INFO[tierId],
                    TOKEN_DECIMALS
                  )}
                </h5>
                <img
                  src={`${getGateway()}${image.replace("ipfs://", "")}`}
                  alt={name}
                  width={150}
                  height={150}
                />
                <div className={"btn-wrap"}>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => tierClaim(tokenId, tierId)}
                  >
                    Claim
                  </button>
                </div>
                <div className={"btn-wrap"}>
                  <button
                    className={`${styles.mainButton} ${styles.spacerBottom}`}
                    onClick={() => tierWithdraw(tokenId, tierId)}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            );
          })}
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
                  />

                  <StakeActiveComponent id={id} tierStake={tierStake} />
                </div>
              );
            }
          )}
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