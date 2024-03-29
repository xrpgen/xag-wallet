import constants from 'src/wallet/constants';
//zzw
export default {
  computed: {
    accounts () {
      return [
        // {type: constants.AccountType.ethereum, code: constants.CoinType.ETH, name: this.$t('common.ethereum')},
        {type: constants.AccountType.ripple, code: constants.CoinType.XRP, name: this.$t('common.ripple')},
        {type: constants.AccountType.ripplexag, code: constants.CoinType.XAG, name: this.$t('common.ripplexag')}
        //{type: constants.AccountType.stellar, code: constants.CoinType.XLM, name: this.$t('common.stellar')},
        //{type: constants.AccountType.bitcoin, code: constants.CoinType.BTC, name: this.$t('common.bitcoin')}
      ];
    }
  }
};
