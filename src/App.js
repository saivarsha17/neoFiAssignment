import './App.css';
import { IMAGES } from './assets/images';
import { useEffect, useState } from 'react';
import { allAssets } from './constants';
function App() {
  const [currentAsset, setCurrentAsset] = useState({
    name: 'Cardano',
    token: 'ADAUSDT',
    image: IMAGES.CARDANO,
    value: '0',
    amount: '0',
  });
  const [modal, setModal] = useState(false);
  const [text, setText] = useState('');
  const [index, setIndex] = useState('ETHUSDT');
  const [assets, setAssets] = useState([]);
  const handleSearch = (searchText) => {
    setText(searchText);
    const newData = [];
    allAssets.forEach((data, _) => {
      if (data.name.toLowerCase().includes(searchText.toLowerCase())) {
        newData.push(data);
      }
    });
    setAssets(newData);
  };
  const handleSelect = (i) => {
    setCurrentAsset((prev) => ({
      ...prev,
      name: assets[i].name,
      image: assets[i].image,
      token: assets[i].token,
    }));

    setIndex(assets[i].token);
    setModal(false);
    setText('');
    setAssets(allAssets);
  };
  useEffect(() => {
    setAssets(allAssets);
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      fetch(
        `https://api.binance.com/api/v1/ticker/price?symbol=${currentAsset.token}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          const currentValue = (parseFloat(data.price) * 80).toFixed(2);

          setCurrentAsset((prev) => ({
            ...prev,
            value: currentValue,
          }));
        })
        .catch((error) => console.log('error', error));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentAsset]);

  return (
    <div className="mainContainer">
      <img src={IMAGES.LOGO} className="logoImage" alt="logo" />
      <div className="logoName">NeoFi</div>
      <div className="nameContainer">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="headingName1">Trade</div>
          <div className="borderContainer"></div>
        </div>

        <div className="headingName2">Earn</div>

        <div className="headingName2"> SUPPORT</div>
        <div className="headingName2">About</div>
        <div className="connectContainer">Connect wallet</div>
      </div>

      <div className="inputContainer">
        <div className="semiCircleContainer"></div>
        <img src={currentAsset.image} className="assetLogo" alt="asset" />

        {!modal && (
          <div className="assetContainer">
            <div className="assetHeadingContainer">
              <div className="assetHeadingName">Current value</div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img
                  src={IMAGES.CURRENCY}
                  alt="currency"
                  className="currencyLogo"
                />
                <div className="assetValue">{currentAsset.value}</div>
              </div>
            </div>
            <div className="assetInputContainer ">
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img
                  className="assetImage"
                  src={currentAsset.image}
                  alt="imageasset"
                />
                <div className="assetName">{currentAsset.name}</div>
              </div>
              <img
                src={IMAGES.DROP_DOWN}
                alt="dropdown"
                className="dropDown"
                onClick={() => setModal(true)}
              />
            </div>
            <div className="assetHeadingContainer">
              <div className="assetHeadingName  amountHeading marginContainer">
                Amount you want to invest
              </div>
            </div>

            <input
              className="inputAmount assetInputContainer"
              placeholder="0"
              type={'number'}
              value={currentAsset.amount}
              onChange={(e) => {
                setCurrentAsset((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }));
              }}
            />
            <div className="currency">INR</div>

            <div className="assetHeadingContainer">
              <div className="assetHeadingName  estimate marginContainer">
                Estimate Number of ETH You will Get
              </div>
            </div>
            <div className="assetInputContainer">
              {!isNaN(
                parseFloat(currentAsset.amount) / parseFloat(currentAsset.value)
              ) ? (
                <div className="tokenCount">
                  {parseFloat(currentAsset.amount) /
                    parseFloat(currentAsset.value)}
                </div>
              ) : (
                <div className="tokenCount">0</div>
              )}
            </div>
            <div className="buyButton">Buy</div>
          </div>
        )}
        {modal && (
          <div className="assetSelectContainer">
            <img
              src={IMAGES.CLOSE}
              alt="close"
              className="closeContainer"
              onClick={() => {
                setModal(false);
                setText('');
                setAssets(allAssets);
              }}
            />
            <div>
              <img src={IMAGES.SEARCH} alt="search" className="searchImage" />
              <input
                className="searchContainer"
                placeholder="Search chains"
                onChange={(e) => handleSearch(e.target.value)}
                value={text}
              />
            </div>
            <div className="listContainer">
              {assets.map((data, i) => {
                return (
                  <div
                    className="assetListContainer"
                    onClick={() => handleSelect(i)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <img
                        src={data.image}
                        alt="imageasset"
                        className="assetListImage"
                      />
                      <div className="assetListName">{data.name}</div>
                    </div>
                    {data.token === index && (
                      <img
                        src={IMAGES.TICK}
                        alt="tick"
                        className="tickContainer"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
