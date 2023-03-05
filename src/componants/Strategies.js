import Block from "./Block";
import "./styles.css";

import { Assets, Protocols } from '../constants/Mumbai.assets.js'

const generateData = () => {
  const blocks = [];
  for (let j = 0; j < Protocols.length; j++) {
    for (let i = 0; i < Assets.length; i++) {
      let {protocolName, protocolLogo} = Protocols[j];
      let {assetName, assetLogo, assetAddress} = Assets[i];
      let {underlayingAssetName, underlayingAssetLogo} = {underlayingAssetName: assetName, underlayingAssetLogo: assetLogo}
      blocks.push({
        strategyName: `${protocolName + " " + underlayingAssetName }`,
        // image: `https://source.unsplash.com/random/${300 + i}x${300 + i}`,
        image: protocolLogo,
        score: Math.floor(Math.random() * 5) + 1,
        cryptoLogo: underlayingAssetLogo,
        underlayingAsset: underlayingAssetName,
        underlayingAssetAddress: assetAddress
      });
    }
  }

  return blocks;
};


export default function Strategies({ buyAssetState, underlayingAssetState}) {

  const { selectedUnderlayingAsset } = underlayingAssetState;

  let blocks = generateData();

  if(selectedUnderlayingAsset != ""){
    blocks = blocks.filter((item) => item.underlayingAssetAddress === selectedUnderlayingAsset);
  }
  


  return (
    <div className="Strategies">
      <h1>Blocs avec titre, image et score</h1>
      <div className="blocks">
        {
          blocks.map(
            (item, index) => (
              <Block
                key={index}
                strategyName={item.strategyName}
                image={item.image}
                score={item.score}
                cryptoLogo={item.cryptoLogo}
                buyAssetState={buyAssetState}
                underlayingAssetState={underlayingAssetState}
              />
            )
          )
        }
      </div>
    </div>
  );
}
