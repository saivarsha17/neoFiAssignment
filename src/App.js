import './App.css';
import { IMAGES } from './assets/images';
import { useEffect, useState } from 'react';
import { allAssets } from './constants';
function App() {
  const [currentAsset, setCurrentAsset] = useState({
    name: 'Ethereum',
    token: 'ETHUSDT',
    image: IMAGES.ASSET,
    value: '',
    amount: '',
  });
  const [modal, setModal] = useState(false);
  const [text, setText] = useState('');
  const [index, setIndex] = useState(-1);
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
    console.log('selected', assets[i]);
    setIndex(i);
    setModal(false);
    setText('');
    setAssets(allAssets);
  };
  useEffect(() => {
    setAssets(allAssets);
  }, []);
  useEffect(() => {
    console.log('eter11', currentAsset.token);
    const intervalId = setInterval(() => {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      console.log('eter1', currentAsset.token);

      fetch(
        `https://api.binance.com/api/v1/ticker/price?symbol=${currentAsset.token}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          console.log(result, currentAsset.token);
          const data = JSON.parse(result);
          const currentValue = (parseFloat(data.price) * 80).toFixed(2);
          console.log(
            result,
            currentAsset.token,
            currentValue,
            typeof data.price
          );
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
        <div className="semicircle"></div>
        <img
          src={currentAsset.image}
          className="currentAssetContainer"
          alt="asset"
        />
      </div>

      {!modal && (
        <>
          <div className="currentHeading">Current value</div>
          <img src={IMAGES.CURRENCY} alt="currency" className="currencyLogo" />

          <div className="currentValue">{currentAsset.value}</div>
          <div className="assetContainer">
            <img
              className="assetImage"
              src={currentAsset.image}
              alt="imageasset"
            />
            <div className="assetName">{currentAsset.name} </div>
            <img
              className="dropDownArrow"
              src={IMAGES.DROP_DOWN}
              alt="dropdown"
              onClick={() => setModal(true)}
            />
          </div>
          <div className="amountHeading">Amount you want to invest</div>
          <div className="amountContainer">
            <input
              className="inputAmount"
              placeholder="0"
              type={'number'}
              value={currentAsset.amount}
              onChange={(e) => {
                console.log(e.target.value);

                setCurrentAsset((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }));
              }}
            />
            <div className="inputCurrency">INR</div>
          </div>
          <div className="tokenHeading">
            Estimate Number of ETH You will Get
          </div>
          {!isNaN(
            parseFloat(currentAsset.amount) / parseFloat(currentAsset.value)
          ) ? (
            <div className="tokenCount">
              {parseFloat(currentAsset.amount) / parseFloat(currentAsset.value)}
            </div>
          ) : (
            <div className="tokenCount">0</div>
          )}

          <div className="buyButton"> Buy </div>
        </>
      )}
      {modal && (
        <div className="assetSelectContainer">
          <img
            src={IMAGES.CLOSE}
            alt="close"
            className="closeContainer"
            onClick={() => {
              setModal(false);
              setIndex(-1);
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
                  <img
                    src={data.image}
                    alt="imageasset"
                    className="assetListImage"
                  />
                  <div className="assetListName">{data.name}</div>
                  {index === i && (
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
  );
}

export default App;
