let instance = null;

/**
 * AssetConfig(资产配置表)
 */
class AccountDefaultConfig {
  /**
   *
   * @param defaultRipple 
   * @param requireDestinationTag

   */
  constructor(defaultRipple, requireDestinationTag) {
    this.defaultRipple = defaultRipple;
    this.requireDestinationTag = requireDestinationTag;
  }

  /**
   * 保存资产配置到资产配置表
   * @param defaultRipple
   * @param requireDestinationTag

   * @returns {AccountDefaultConfig}
   */
  static insertAccountDefaultConfig({
    defaultRipple = false,
    requireDestinationTag = false
  } = {}) {
    let accountDefault = new AccountDefaultConfig(
      defaultRipple,
      requireDestinationTag
    );
    instance.insert(accountDefault);
    return this;
  }

  /**
   * 查询所有资产配置数据
   * @returns {*}
   */
  static findAll() {
    return instance.data;
  }
  //根据当前配置项查询数据

  /**
   * 创建AssetConfig表并返回
   * @param db
   * @returns {AccountDefaultConfig}
   */
  static newInstance(db) {
    instance =
      db.getCollection('accountDefault') || db.addCollection('accountDefault');
    return this;
  }
  /**
   * 返回AssetConfig表信息
   * @param db
   * @returns {*}
   */
  static getInstance() {
    return instance;
  }
  //清空数据
  static deleteDefault() {
    return instance.findAndRemove({});
  }
}

export default AccountDefaultConfig;
