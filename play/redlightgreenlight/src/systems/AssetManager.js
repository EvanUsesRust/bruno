export default class AssetManager {
    constructor(totalAssets, onAllAssetsLoaded) {
        this.assetsLoaded = 0;
        this.totalAssets = totalAssets;
        this.onAllAssetsLoaded = onAllAssetsLoaded;
    }

    assetLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === this.totalAssets) {
            this.onAllAssetsLoaded();
        }
    }
}
