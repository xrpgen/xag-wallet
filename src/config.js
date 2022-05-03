import wallet from 'src/pages';

export default {
  defaultRoute() {
    // 登录后的默认跳转路径
    return '/wallet';
  },
  modules: {
    wallet
  },
  // updateUrl: 'https://api.github.com/repos/xrpgen/config/releases/latest', // 检查更新地址
  newUpdateUrl: 'https://xrpgen.com/config_version.json',
  downloadUrl: 'https://xrpgen.com/download.html', // 安卓安装包下载地址
  officialWebsite: 'https://xrpgen.com/download.html', // 官网
  configUrl: 'https://xrpgen.github.io/config/config.json',
  configVersionUrl: 'https://xrpgen.github.io/config/config_version.json'
};
