const Web3 = require("web3");

const Abi = require("./abi.json");
const tokenAbi = require("./abi2.json");
const stakerAbi=require("./stakerAbi.json");
let web3;

const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/287af69fca9142f3b1681a93ce4c3afa"
);
web3 = new Web3(provider);

async function getFarmBalance(userAddress,masterAddress,tokenAddress) {

  const masterInstance=new web3.eth.Contract(Abi,masterAddress);
  let balance=await masterInstance.methods.staked(tokenAddress,userAddress).call();
  let rewards=await masterInstance.methods.claimable(tokenAddress,userAddress).call();
  let rewardToken=await masterInstance.methods.rewardToken().call();


  const tokenInstance=new web3.eth.Contract(tokenAbi,tokenAddress);
  const rewardInstance=new web3.eth.Contract(tokenAbi,rewardToken);

  let symbol=await tokenInstance.methods.symbol().call();
  let decimals=await tokenInstance.methods.decimals().call();

  let rewardsymbol=await rewardInstance.methods.symbol().call();
  let rewardDecimals=await rewardInstance.methods.decimals().call();

  balance=(balance/10**decimals).toFixed(2);
  rewards=(rewards/10**rewardDecimals).toFixed(2);

  if(balance!=0)
  console.log("balance:", balance, symbol.slice(2),'rewards:',rewards,rewardsymbol);

}

async function getStakeBalance(userAddress,contractAddress) {

  let tokenAddress="0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784";

  const stakerInstance=new web3.eth.Contract(stakerAbi,contractAddress);
  let balance=await stakerInstance.methods.balanceOf(userAddress).call();
  let rewards=await stakerInstance.methods.claimable(userAddress,tokenAddress).call();


  const tokenInstance=new web3.eth.Contract(tokenAbi,tokenAddress);

  let symbol=await tokenInstance.methods.symbol().call();
  let decimals=await tokenInstance.methods.decimals().call();

  balance=(balance/10**decimals).toFixed(2);
  rewards=(rewards/10**decimals).toFixed(2);

  if(balance!=0)
  console.log("balance:", balance, symbol,'rewards:',rewards,symbol);

}

let address = "0x58f5f0684c381fcfc203d77b2bba468ebb29b098";
let masterContract = "0xec6c3FD795D6e6f202825Ddb56E01b3c128b0b10";
let stakeContract="0x23696914Ca9737466D8553a2d619948f548Ee424";
let tokenAddresses = [
  "0x6002b1dcB26E7B1AA797A17551C6F487923299d7",
  "0x97cE06c3e3D027715b2d6C22e67D5096000072E5",
  "0xA991356d261fbaF194463aF6DF8f0464F8f1c742",
  "0x1Ed460D149D48FA7d91703bf4890F97220C09437",
  "0xa1e72267084192Db7387c8CC1328fadE470e4149",
];
for(let i=0;i<tokenAddresses.length;i++)
getFarmBalance(address,masterContract,tokenAddresses[i]);

getStakeBalance(address,stakeContract);
