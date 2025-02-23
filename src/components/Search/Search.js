import React, { Component } from 'react';
import './App.css';
import logo from './RaveBase-min.png';
import { useParams, useNavigate } from "react-router-dom";

import {
  Heading,
  Text,
  Card,
  Image
} from "theme-ui";
import Swal from 'sweetalert2';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import $ from 'jquery';

import Addresses from './Addresses/Addresses'; //.ajs file, no extension
import Records from './Records/Records'; // ' '

import { abi, contract_address, overrides, externalAbi } from "./fns.js";

import { truncateAddress } from "../../helpers/truncateAddress.js";
import { ethers } from 'ethers';
import constants from "../../constants.js";
import nabi from './neko.js';

import NFTCarousel from './Carousel/NFTCarousel.js';
import TokenDisplay from './Tokens/Tokens.js';

const fns = new ethers.Contract(contract_address, abi, new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools'));

const nfts = [
  "0x7acee5d0acc520fab33b3ea25d4feef1ffebde73", // cyber nekos
  "0x2ab5c606a5aa2352f8072b9e2e8a213033e2c4c9", // magicats [no]
  "0x5dbc2a8b01b7e37dfd7850237a3330c9939d6457", // umans
  "0x406349e0bcdf323526c11b4e987a699471142b84", // 8bit nostalgia [no]
  "0x47c414909f0c8c663da2bf8b96592c1c6b8c4215", // netizens [no]
  "0x31911223bb3ff5b773af3e677fc0ac5760215e4e", // beardies [no]
  "0xbea7c3f2d91a9c6fd7f5aa9c803d4c31c1db8db9", // bitdaemons [no]
  "0xCB0fF14CAC96aDd86223C8C7E8A6129CD92919Ab", // cyber fantoms
  "0x6e85f63449f090856ca5850d19611c50488bd7fd", // og fantoms
  "0x287986A4cdfC7957e9fc273e353995BC2A2E93aE", // ultimate fantoms
  "0x28908D5795B4D8f4Cc175C63523F974412F2A5B1", // shibafantom
  "0x8E7c434B248d49D873D0F8448E0FcEc895b1b92D", // degenerabbits
  "0xd81d78F9D6Eb3Efab060aa213f686f02d1705553", // chunk
  "0x9FaA278cB088294eA00bE2895F5FAB8D091bB946", // pdp
  "0x4f504ab2e7b196a4165ab3db71e75cb2b37070e0", // rGoools
  "0x673Ce61e0Ec7fAD6c6Fe689193a0AdEF38567965", // mGoools
  "0x98abb0aa746a1e35fe54b522a12164ea1e034e96"  // pGoools
]


class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      owner: '',
      avatar: '',
      ipfs: '',
      isOwned: false,
      isOwner: false,
      hasDone: false,
      networth: 0,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resolveName = this.resolveName.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.registerName = this.registerName.bind(this);
    this.setAvatar = this.setAvatar.bind(this);
    this.setAddresses = this.setAddresses.bind(this);
    this.transferName = this.transferName.bind(this);
    this.openC = this.openC.bind(this);
    Toastify({
      text: `Bridge to Fantom here!`,
      duration: `3000`,
      onClick: function(){
        console.log(this.props);
        props.history(`/bridge`);
      }
    }).showToast();
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    this.history(`/${this.state.name}`);
  }

  async resolveName() {
    let owner;
    let avatar;
    let ipfs;
    let isOwned;
    let worth;
    await fns.functions.getOwner(this.state.name).then(res => {
      owner = res[0];
    });
    await fns.functions.getAvatar(this.state.name).then(res => {
      avatar = res[0];
    });
    await fns.functions.getAddresses(this.state.name).then(res => {
      ipfs = res[0];
    });
    await fns.functions.owned(this.state.name).then(res => {
      isOwned = res[0];
    });
    await fetch(`https://openapi.debank.com/v1/user/chain_balance?id=${owner}&chain_id=ftm&is_all=true&has_balance=true`).then(async res => {
      let json = await res.json();
      worth = json["usd_value"];
    })
    this.setState({
      owner: owner,
      avatar: avatar,
      ipfs: ipfs,
      isOwned: isOwned,
      hasDone: true,
      networth: worth
    });
    if (!this.state.isOwned) return;
    let ownednfts = {
      nekos: [],
      magicats: [],
      umans: [],
      bit: [],
      netizens: [],
      beardies: [],
      bitdaemons: [],
      cyber: [],
      og: [],
      ultimates: [],
      shiba: [],
      rabbits: [],
      chunk: [],
      ppunks: [],
      rgoools: [],
      mgoools: [],
      pgoools: [],
    };
    let prov = new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools');
    let neko = new ethers.Contract(nfts[0],nabi,prov);
    await neko.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await neko.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.nekos.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let umans = new ethers.Contract(nfts[2],nabi,prov);
    await umans.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await umans.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.umans.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let cyber = new ethers.Contract(nfts[7],nabi,prov);
    await cyber.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await cyber.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.cyber.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let og = new ethers.Contract(nfts[8],nabi,prov);
    await og.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await og.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.og.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let ultimates = new ethers.Contract(nfts[9],nabi,prov);
    await ultimates.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await ultimates.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.ultimates.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let shiba = new ethers.Contract(nfts[10],nabi,prov);
    await shiba.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await shiba.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.shiba.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let rabbits = new ethers.Contract(nfts[11],nabi,prov);
    await rabbits.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await rabbits.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.rabbits.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let chunk = new ethers.Contract(nfts[12],nabi,prov);
    await chunk.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await chunk.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.chunk.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let ppunks = new ethers.Contract(nfts[13],nabi,prov);
    await ppunks.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await ppunks.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.ppunks.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let rgoools = new ethers.Contract(nfts[14],nabi,prov);
    await rgoools.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await rgoools.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.rgoools.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let mgoools = new ethers.Contract(nfts[14],nabi,prov);
    await mgoools.functions.balanceOf(this.state.owner).then(async res => {
      if (res[0] <= 0) return;
      for (let i = 0; i < res[0]; i++) {
        await mgoools.functions.tokenOfOwnerByIndex(this.state.owner,i).then(ress => {
          ownednfts.mgoools.push(ress[0]);
        }).catch((e) => {});
      }
    });
    //                                                                                                              \\
    let pgoools = new ethers.Contract(nfts[14],nabi,prov);
    await pgoools.functions.walletOfOwner(this.state.owner).then(async res => {
      ownednfts.pgoools = (res[0]);
    });
    this.setState({
      nfts: ownednfts,
      nftsloaded: true
    });
  }

  async connectWallet() {
      window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
          chainId: "0xFA",
          rpcUrls: ["https://rpc.ftm.tools"],
          chainName: "Fantom Opera",
          nativeCurrency: {
              name: "FTM",
              symbol: "FTM",
              decimals: 18
          },
          blockExplorerUrls: ["https://ftmscan.com/"]
        }]
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum, 250);
      const { chainId } = await provider.getNetwork()
      let signer = provider.getSigner();
      let accounts = await provider.send("eth_requestAccounts", []);
      let account = accounts[0];
      let contract = new ethers.Contract(contract_address, abi, signer);
      let externalContract = new ethers.Contract('0xaFa8da49b9c30AFDaf80A2DF5d01b36814c6d1ac', externalAbi, signer);
      this.setState({
        provider: provider,
        account: account,
        signer: signer,
        externalContract: externalContract,
        contract: contract,
        isOwner: (this.state.owner === ethers.utils.getAddress(account)),
        chainId: chainId
      });
  }

  async registerName() {
    // imean itll fail if the name is owned so no check needed
    let contract = this.state.contract;
    contract.functions.registerName(this.state.name.split(".")[0], overrides).catch(e => {
      console.error(e);
      Toastify({
        text: `Unidentified Error: ${e.data}, click here to join our chats`,
        duration: `3000`,
        destination: `https://rave.cyou/`
      }).showToast();
    });
  }

  async setAvatar() {
    // imean itll fail if the name is owned so no check needed
    let contract = this.state.contract;
    Swal.fire({
      title: `Set an avatar for ${this.state.name}`,
      html: `You must enter a link, containing your avatar. <br><br>This link should be in .png or .jpg form.<br><br>Learn more at our <a href='https://docs.rave.domains/'>docs</a>.`,
      icon: 'info',
      input: 'text',
      inputAttributes: {
        autoCapitalize: 'off'
      },
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Set!',
      denyButtonText: 'No thanks...'
    }).then(async (result) => {
      if (result.isConfirmed) {
        contract.functions.setAvatar(this.state.name.toUpperCase(), result.value).catch((e) => {

          Toastify({
            text: `ERROR, try reloading`,
            duration: 2000
          }).showToast();
        });
      }
    });
  }

  async setAddresses() {
    // imean itll fail if the name is owned so no check needed
    let contract = this.state.contract;
    Swal.fire({
      title: 'Set wallet addresses for different chains.',
      confirmButtonText: 'Set!',
      denyButtonText: 'No Thanks...',
      showDenyButton: true,
      showConfirmButton: true,
      html:
        '<p>Input your wallet addresses for different blockchains here, and have them stored on-chain! You can leave some fields blank. <br />' +
        '<input id="btc" placeholder="Bitcoin" class="swal2-input">' +
        '<input id="eth" placeholder="Ethereum" class="swal2-input">' +
        '<input id="bch" placeholder="Bitcoin Cash" class="swal2-input">' +
        '<input id="ltc" placeholder="Litecoin" class="swal2-input">' +
        '<input id="xrp" placeholder="Ripple" class="swal2-input">' +
        '<input id="avax" placeholder="Avalanche C-Chain" class="swal2-input">' +
        '<input id="bnb" placeholder="BNB on BSC" class="swal2-input">' +
        '<input id="luna" placeholder="Terra LUNA" class="swal2-input">' +
        '<input id="near" placeholder="Near" class="swal2-input">' +
        '<input id="atom" placeholder="Cosmos" class="swal2-input">',
      preConfirm: function () {
        return new Promise(function (resolve) {
          resolve({
            btc: $('#btc').val(),
            eth: $('#eth').val(),
            bch: $('#bch').val(),
            ltc: $('#ltc').val(),
            xrp: $('#xrp').val(),
            avax: $('#avax').val(),
            bnb: $('#bnb').val(),
            luna: $('#luna').val(),
            near: $('#near').val(),
            atom: $('#atom').val(),
          })
        })
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        contract.functions.setAddresses(this.state.name.toUpperCase(), JSON.stringify(result.value)).catch((e) => {

          Toastify({
            text: `ERROR, try reloading`,
            duration: 2000
          }).showToast();
        });
      }
    })
  }

  openC () {
    window.open("https://cbridge.celer.network/#/transfer?sourceChainId=1&destinationChainId=250&tokenSymbol=USDC","_self");
  }

  async transferName() {
    // imean itll fail if the name is owned so no check needed
    let contract = this.state.contract;
    Swal.fire({
      title: `Transfer ${this.state.name}`,
      html: `This will transfer ALL ownership of the name ${this.state.name}. Be careful with this.<br><br>Learn more at our <a href='https://docs.rave.domains'>docs</a>.`,
      icon: 'info',
      input: 'text',
      inputAttributes: {
        autoCapitalize: 'off'
      },
      showDenyButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Set!',
      denyButtonText: 'No thanks...'
    }).then(async (result) => {
      if (result.isConfirmed) {
        contract.functions.safeTransferFrom(this.state.owner, result.value, this.state.name).catch((e) => {
          console.error(e);
          Toastify({
            text: `ERROR, try reloading`,
            duration: 2000
          }).showToast();
        });
      }
    });
  }

  render() {
    if (!this.state.hasDone) {
      this.resolveName();
      this.connectWallet();
    }
    //console.log(this.state.addresses)
    return (
      <>
        <title>{`Rave Name: ${this.state.name}`}</title>
        <header className="App-header">
        <br />
        { (this.state.avatar.split("").length > 0) ? ( <div className="Logo-crop">
          <Image src={this.state.avatar} style={{
          borderRadius: '50%',
          height: '30vmin',
          pointerEvents: 'none'
        }} className="App-logo" alt="avatar" />
        </div> ) : (
          <div className="Logo-crop">
            <Image src={logo} style={{
            borderRadius: '50%',
            height: '30vmin',
            pointerEvents: 'none'
          }} className="App-logo" alt="avatar" />
          </div>
        )}
        {this.state.isOwned ? (
          <p style={{
            fontFamily: 'Nunito Sans',
            fontSize: '31px'
          }}>
            <Text className={'hi-gradient'}>{this.state.name}</Text> <a href={`https://ftmscan.com/address/${this.state.owner}`} target="_blank" rel="noreferrer" className="Address-text">{truncateAddress(this.state.owner)}</a>
          </p>
        ) : (
          <p style={{
            fontFamily: 'Nunito Sans',
            fontSize: '31px'
          }}>
            <Text className={'hi-gradient'}>{this.state.name}</Text> <a href={`https://ftmscan.com/address/${constants["NoAddress"]}`} target="_blank" rel="noreferrer" className="Address-text">Not owned</a>
          </p>
        )}
        {this.state.isOwned &&
          <p style={{
            fontFamily: 'Nunito Sans'
          }}>{"Net Worth: $" + this.state.networth || "loading..."}</p>
        }
        {this.state.isOwned &&
          (<div style={{paddingLeft: 'calc(50% - 37.5vh)', paddingTop: "0vh",}}>
            <Card sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              textAlign: "center",
              paddingTop: "0px",
              width: "75vh",
              height: "10vh",
            }}>
              <TokenDisplay address={this.state.owner} style={{width: '75vh', paddingLeft:'20vh'}}/>
            </Card>
          </div>)
        }
        <br />
        <button onClick={this.connectWallet} className="connectWallet" style={{
            fontFamily: 'Nunito Sans'
        }}>{this.state.account || "Connect Wallet"}</button>
        <br /><br />
        {this.state.isOwned ? (
          <button id={(!this.state.isOwner) ? "disabled" : "isOwner"} className="connectWallet" style={{
            fontFamily: 'Nunito Sans'
          }}>{this.state.isOwner ? (`You own ${this.state.name}`) : (`${this.state.name} is taken`)}</button>
        ) : (
          <button onClick={this.registerName} className="connectWallet" style={{
              fontFamily: 'Nunito Sans'
          }}>{`Register ${this.state.name}!`}</button>
        )}
        <br /><br />
        {this.state.isOwner &&
        <div style={{paddingLeft: 'calc(50% - 75vh)'}}>
          <Card sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            textAlign: "center",
            padding: "28px 24px",
            borderRadius: "20px",
            backgroundColor: "var(--special-w)",
            width: "150vh",
          }} mt="42px">
            <Heading as="h2" style={{
              fontFamily: 'Nunito Sans'
            }}>
              Manage {this.state.name}.
            </Heading>
            <br />
            <Text style={{
              fontFamily: 'Nunito Sans',
              fontSize: '26px'
            }}>
              Set Avatar:
            </Text>
            <button onClick={this.setAvatar} className="connectWallet" style={{
              fontFamily: 'Nunito Sans'
            }}>{`Set avatar!`}</button>
            <br />
            <Text style={{
              fontFamily: 'Nunito Sans',
              fontSize: '26px'
            }}>
              Set Addresses:
            </Text>
            <button onClick={this.setAddresses} className="connectWallet" style={{
              fontFamily: 'Nunito Sans'
            }}>{`Set addresses!`}</button>
            <br />
            <Text style={{
              fontFamily: 'Nunito Sans',
              fontSize: '26px'
            }}>
              Transfer {this.state.name} ⚠:
            </Text>
            <button onClick={this.transferName} className="connectWallet" style={{
              fontFamily: 'Nunito Sans'
            }}>{`Transfer ${this.state.name}!`}</button>
          </Card>
        </div>}
        <br />
        {(this.state.isOwned && this.state.nftsloaded) &&
        <div style={{paddingLeft: 'calc(50% - 75vh)'}}>
          <Card sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            textAlign: "center",
            padding: "28px 24px",
            borderRadius: "20px",
            backgroundColor: "var(--special-w)",
              width: "150vh",
            }} mt="42px">
              <Heading as="h2" style={{
                fontFamily: 'Nunito Sans'
              }}>
                <Text className={'hi-gradient'}>NFTs owned by {this.state.name}.</Text>
                <br />
              </Heading>
              <br />
              <NFTCarousel nfts={this.state.nfts} showThumbs={false} style={{width: '75vh', paddingLeft:'20vh'}}/>
          </Card>
        </div>
        }
        {(false && this.state.isOwned) &&
          <div style={{paddingLeft: 'calc(50% - 75vh)'}}>
            <Card sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              textAlign: "center",
              padding: "28px 24px",
              borderRadius: "20px",
              backgroundColor: "var(--special-w)",
                width: "150vh",
              }} mt="42px">
                <Heading as="h2" style={{
                  fontFamily: 'Nunito Sans'
                }}>
                  <Text className={'hi-gradient'}>{this.state.name}'s text records</Text>
                  <br />
                </Heading>
                <br />
                <Records owner={this.state.isOwner} name={this.state.name} contract={this.state.externalContract}/>
            </Card>
          </div>
        }
        {(Object.keys(this.state.ipfs).length > 0) && this.state.isOwned && <div style={{paddingLeft: 'calc(50% - 75vh)'}}>
          <Card sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            textAlign: "center",
            padding: "28px 24px",
            borderRadius: "20px",
            backgroundColor: "var(--special-w)",
              width: "150vh",
            }} mt="42px">
              <Heading as="h2" style={{
                fontFamily: 'Nunito Sans'
              }}>
                <Text className={'hi-gradient'}>{this.state.name}'s addresses</Text>
                <br />
              </Heading>
              <br />
              <Addresses addresses={JSON.parse(this.state.ipfs)} style={{width: '75vh', paddingLeft:'20vh'}}/>
          </Card>
        </div>}
        <br />
        </header>
      </>
    );
  }
}

const WrappedSearch = props => {
  let { name } = useParams();
  /*if (name.startsWith('0x')) {
    // do nothing
  } else*/ if (!(name.endsWith('.ftm'))) {
    name = `${name}.ftm`
  }
  const history = useNavigate();
  return <Search name={name} history={history} />;
}

export default WrappedSearch;
