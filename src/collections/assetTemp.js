let instance = null;

/**
 * AssetTemp(资产配置表)
 */
class AssetTemp {

  constructor(id, ripple, xrpgen) {
    this.id = id;
    this.ripple = ripple;
    this.xrpgen = xrpgen;
  }

  static insertAssetTemp(
    {
      id = '1',
      ripple = [],
      xrpgen = [],
    } = {}
  ) {
    let assetTemp = new AssetTemp(id, ripple, xrpgen);
    instance.insert(assetTemp);
    return this;
  }

  static findAssetTemp () {
    let result = instance.findOne({id: '1'});
    return result;
  }

  static updateAssetTemp (updateFunction) {
    let result = instance.findAndUpdate({id: '1'}, updateFunction);
    return result;
  }

  static newInstance (db) {
    instance = db.getCollection('assetTemp') || db.addCollection('assetTemp');
    return this;
  }

  static getInstance () {
    return instance;
  }
}

export default AssetTemp;
