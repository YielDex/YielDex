import { useState } from "react";
import "./styles.css";
import { Assets } from "../../constants/Polygon.assets.js";

const FormHead = ({underlayingAssetState, buyAssetState}) => {
  
  const {selectedBuyAsset, setSelectedBuyAsset} = buyAssetState;
  const {selectedUnderlayingAsset, setSelectedUnderlayingAsset} = underlayingAssetState;

  const handleAssetChange = (event) => {
    setSelectedBuyAsset(event.target.value);
  };

  const handleUnderlayingAssetChange = (event) => {
    setSelectedUnderlayingAsset(event.target.value);
  };



  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected asset:", selectedBuyAsset);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="targetbuyAsset">Target Buy Asset:</label>
        <select
          className="form-control"
          name="asset"
          id="targetbuyAsset"
          value={selectedBuyAsset}
          onChange={handleAssetChange}
        >
          <option value="">Select an asset</option>
          {Assets.map((asset) => {
            return <option key={asset.assetAddress} value={asset.assetAddress}>{asset.assetName}</option>;
          }
          )}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="targetbyAsset">Asset used to buy:</label>
        <select
          className="form-control"
          name="asset"
          id="underlyingAsset"
          value={selectedUnderlayingAsset}
          onChange={handleUnderlayingAssetChange}
        >
          <option value="">Select an asset</option>
          {Assets.map((asset) => {
            return <option key={asset.assetAddress} value={asset.assetAddress}>{asset.assetName}</option>;
          }
          )}
        </select>
      </div>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default FormHead;
