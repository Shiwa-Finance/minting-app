import _ from 'lodash';
export const gatewayUrls = [
    // 'https://ipfs.io/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/'
];

export const getGateway = () => {
    return _.sample(gatewayUrls);
};

export const axiosConfig = {
    maxRequests: 2,
    perMilliseconds: 100
};
