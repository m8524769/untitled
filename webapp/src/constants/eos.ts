export const CONTRACT_ACCOUNT: string = 'yk';
export const TOKEN_SYMBOL: string = 'ASS';
export const TOKEN_PRECISION: number = 4;

const NETWORK_SET = {
  LOCAL: {
    blockchain: 'eos',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
    host: '127.0.0.1',
    port: 8888,
    protocol: 'http',
  },
  CRYPTO_KYLIN: {
    blockchain: 'eos',
    chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    host: 'api-kylin.eosasia.one',
    port: 443,
    protocol: 'https',
  },
  MAINNET: {
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'proxy.eosnode.tools',
    port: 443,
    protocol: 'https',
  },
};

// Switch Network Here
export const NETWORK = NETWORK_SET.LOCAL;
