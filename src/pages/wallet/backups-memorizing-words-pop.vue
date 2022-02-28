<template>
  <div class="backups-mw">
    <van-popup
      v-model="showVpop"
      position="right"
      class="popup-wapper"
      style="width:100%;height: 100%;overflow:hidden;"
    >
      <van-nav-bar :title="$t('wallet.backMnemonicCode')" @click-left="close">
        <span slot="left">
          <i>
            <img src="./img/back.png" alt />
          </i>
        </span>
      </van-nav-bar>
      <pl-content-block :offsetTop="46">
        <!--头部信息-->
        <!-- <content-block padding-bottom="0px">
          <top-block :title="$t('wallet.backWalletMnemonicCode')">
            <img src="static/img/backups-wallet@3x.png" width="45" height="45" />
          </top-block>
        </content-block>-->

        <!-- <div class="text-center tag-pt" v-if="isShowTag">
          <span
            style="border-radius: 3px 0 0 3px;"
            class="top-btn"
            :class="{'select text-white':tagSelect=='1'}"
            @click.stop="onchangeTag('1')"
          >{{$t('wallet.cnMnemonic')}}</span>
          <span
            @click.stop="onchangeTag('2')"
            :class="{'select text-white':tagSelect=='2'}"
            class="top-btn"
            style="border-radius: 0 3px 3px 0;"
          >{{$t('wallet.enMnemonic')}}</span>
        </div> -->
        <div class="small-font item text-tip-color" v-text="$t('wallet.backMnemonicCodeSubTip')"></div>
        <div class="small-font item tip-color text-muted" v-text="$t('wallet.MnemonicCodeIntro')"></div>

        <div class="item-block item-block-bgcolor backups-textarea">
          <span class="text-primary" v-for="(item,index) in memorizingCodes" :key="index">{{item}}</span>
          <!--     <van-cell-group>
            <van-field
              v-model="form.memorizingWords"
              type="textarea"
              autosize
              readonly
            />
          </van-cell-group>-->
        </div>

        <!--按钮部分-->
        <button-bottom>
          <van-button size="large" round type="primary" @click="next()" :text="$t('common.next')"></van-button>
        </button-bottom>
      </pl-content-block>
    </van-popup>
    <!-- 弹出框效果 -->
    <van-dialog v-model="showDialog" overlay :show-confirm-button="false">
      <div style="padding: 30px;color:#353535" class="text-center fw500">
        <!-- <van-icon name="warn" class="text-tip-color large-font" style="vertical-align: middle" />&nbsp;&nbsp; -->
        <span
          class="sn-font"
          style="vertical-align: middle"
          v-text="$t('wallet.doNotHaveScreenshot')"
        ></span>
      </div>
      <div
        class="padding-left-right-25 sn-font text-light-color text-center"
        v-text="$t('wallet.backMnemonicCodeAlterTip')"
      ></div>
      <div class="van-hairline--bottom padding"></div>
      <div
        class="text-center text-primary normal-font"
        style="cursor: pointer;padding: 15px;"
        @click="closeDialog"
        v-text="$t('common.iSeeThat')"
      ></div>
    </van-dialog>
    <check-memorizing-words ref="checkMW" @done="close" :backups-source.sync="backupsSource"></check-memorizing-words>
  </div>
</template>
<script>
import checkMemorizingWords from "./check-memorizing-words-pop";
import topBlock from "./components/top-block";
import contentBlock from "./components/content-block";
import buttonBottom from "./components/button-bottom";
import hdWallet from "src/wallet/hd-wallet";
export default {
  components: { checkMemorizingWords, topBlock, contentBlock, buttonBottom },
  data() {
    return {
      backupsSource: "",
      showVpop: false,
      showDialog: false,
      tagSelect: "1",
      memorizingCodes: [],
      form: {
        password: "",
        memorizingWords: ""
      },
      source: "",
      accountTypes: [],
      memorizingCodeLanguage: "english",
      isShowTag: false // 是否显示中英文助记词切换，true-显示（创建的时候），false-不显示（导出助记词）
    };
  },
  methods: {
    close() {
      this.showVpop = false;
    },
    show(mnemonicCode, password, backupsSource, source, accountTypes, memorizingCodeLanguage) {
      if (mnemonicCode) {
        // 导出助记词跳转
        this.form.memorizingWords = mnemonicCode;
        this.memorizingCodes = mnemonicCode.split(" ");
      } else {
        this.memorizingCodeLanguage = memorizingCodeLanguage;
        this.setDefaultMnemonic();
      }
      this.form.password = password;
      if (source && accountTypes) {
        // 创建账户的情况
        this.source = source;
        this.accountTypes = accountTypes;
      }
      this.showDialog = true;
      this.backupsSource = backupsSource;
      this.showVpop = true;
      this.$nextTick(() => {
        let vanModals = document.getElementsByClassName("van-modal");
        if (vanModals && vanModals.length > 0) {
          let vanModal = vanModals[0];
          let zIndex = vanModal.style.zIndex;
          vanModal.style.zIndex = Number(zIndex) + 1;
        }
      });
    },
    setDefaultMnemonic() {
      this.form.memorizingWords = hdWallet.generateMnemonicV3({
        entropyBits: 128,
        language: this.memorizingCodeLanguage
      });
      this.memorizingCodes = this.form.memorizingWords.split(" ");
    },
    // onchangeTag(type) {
    //   this.tagSelect = type;
    //   this.memorizingCodeLanguage = "english";
    //   if (type === "1") {
    //     this.memorizingCodeLanguage = "chinese_simplified";
    //   }
    //   this.form.memorizingWords = hdWallet.generateMnemonicV3({
    //     entropyBits: 128,
    //     language: this.memorizingCodeLanguage
    //   });
    //   this.memorizingCodes = this.form.memorizingWords.split(" ");
    // },
    closeDialog() {
      this.showDialog = false;
    },
    next() {
      this.$refs.checkMW.show(this.form, this.source, this.accountTypes);
    }
  }
};
</script>
<style  lang="scss" rel="stylesheet/scss" scoped>
.backups-mw {
  position: relative;
  .vertical-align-middle {
    vertical-align: middle;
  }
  .set-mw__text-msg {
    padding: 10px;
  }
  .item {
    margin-right: 20px;
    margin-left: 20px;
  }
  .padding-left-right-25 {
    padding-left: 25px;
    padding-right: 25px;
  }
  .backups-textarea {
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    span {
      margin-right: 20px;
    }
  }
  .top-btn {
    width: 68px;
    display: inline-block;
    text-align: center;
    padding: 2px 4px;
    border: 1px solid #6e7f8d;
    cursor: pointer;
    &.select {
      background-color: #6e7f8d;
    }
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.backups-mw {
  .van-hairline--top-bottom::after {
    border-width: 0px;
  }
  .van-cell {
    padding: 0px !important;
  }
  .tag-pt {
    padding-top: 1.67rem;
    padding-bottom: 1.67rem;
  }
  .text-tip-color {
    color: #3b3b3b;
    margin-bottom: 1.11rem;
    font-weight: 500;
  }

  .item-block {
    border-radius: 0.28rem;
    margin-top: 1.67rem;
    margin-bottom: 1.67rem;
    line-height: 40px;
    background-color: #f7f7f7;
  }
  .van-button {
    margin-top: 3.28rem;
  }
  .item-block {
    word-wrap: break-word;
  }
  .top-btn.select.text-white {
    background-color: #4abbe7;
  }
  .top-btn[data-v-6aa0e957] {
    border: 1px solid #4abbe7;
  }
  .van-hairline--bottom::after {
    border: none;
  }
  .content-block {
    background-color: #fff;
  }
  .item-block {
    box-shadow: none;
  }
}
</style>
