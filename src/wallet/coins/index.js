import Ethereum from './Ethereum';
import Ripple from './Ripple';
import Ripplexag from './Ripplexag';
import Stellar from './Stellar';
import Bitcoin from './Bitcoin';
import {AccountType, CoinType} from '../constants';
import tokens from '../tokens';

export default {
  [AccountType.ethereum]: {
    name: AccountType.ethereum,
    displayName: AccountType.ethereum,
    symbol: CoinType.ETH,
    derive_path: "m/44'/60'/0'/0/index",
    wallet: new Ethereum(),
    isShow: false,
    tokens () {
      return tokens.get(AccountType.ethereum);
    }
  },
  [AccountType.ripple]: {
    name: AccountType.ripple,
    displayName: AccountType.ripple,
    symbol: CoinType.XRP,
    derive_path: "m/44'/144'/index'",
    wallet: new Ripple(),
    isShow: true,
    tokens () {
      return tokens.get(AccountType.ripple);
    }
  },
  [AccountType.ripplexag]: {
    name: AccountType.ripplexag,
    displayName: AccountType.ripplexag,
    symbol: CoinType.XAG,
    derive_path: "m/44'/144'/index'",
    wallet: new Ripplexag(),
    isShow: true,
    tokens () {
      return tokens.get(AccountType.ripplexag);
    }
  },
  [AccountType.stellar]: {
    name: AccountType.stellar,
    displayName: AccountType.stellar,
    symbol: CoinType.XLM,
    derive_path: "m/44'/148'/index'",
    wallet: new Stellar(),
    isShow: false,
    tokens () {
      return tokens.get(AccountType.stellar);
    }
  },
  [AccountType.bitcoin]: {
    name: AccountType.bitcoin,
    displayName: AccountType.bitcoin,
    symbol: CoinType.BTC,
    derive_path: "m/44'/0'/0'/0/index",
    wallet : new Bitcoin('https://blockchain.info'),
    isShow: false,
    tokens () {
      return tokens.get(AccountType.bitcoin);
    }
  }
};
