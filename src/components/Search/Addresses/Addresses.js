
import React, { Component } from 'react';
import '../App.css';
 
import { Grid } from 'theme-ui';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
 
import bitcoin from './Assets/AddressBitcoin.svg';
import ethereum from './Assets/AddressEthereum.svg';
import avax from './Assets/AddressAvalance.svg';
import bch from './Assets/AddressBCH.svg';
import bnb from './Assets/AddressBNB.svg';
import fantom from './Assets/AddressFantom.svg';
import litecoin from './Assets/AddressLitecoin.svg';
import luna from './Assets/AddressLuna.svg';
import polkadot from './Assets/AddressPolkadot.svg';
import xrp from './Assets/AddressXRP.svg';
 
import { truncateAddress } from '../../../helpers/truncateAddress.js';
 
 const keys = {
   btc: bitcoin,
   eth: ethereum,
   avax: avax,
   bch: bch,
   ftm: fantom,
   ltc: litecoin,
   luna: luna,
   dot: polkadot,
   xrp: xrp,
   bnb: bnb,
 }
 
 
class Addresses extends Component {
   constructor(props) {
     super(props);
     this.state = {}
   }
 
   render() {
    console.log(this.props.addresses)
    return (
       <Grid gap={2} style={{
         alignItems: "center",
         alignSelf: "center",
         textAlign: "center" }}>
         {Object.entries(this.props.addresses).map( function(item, key) {
          return <>{(item[1] !== "") && <Tooltip title={`Click to copy`}><button style={{
             border: 'none',
             background: '#272727',
             color: '#FFF',
             cursor: 'pointer',
             borderRadius: '15px',
             padding: '2vh 4vh',
             fontFamily: 'Nunito Sans',
             fontSize: '21px'}}
             onClick={() => {navigator.clipboard.writeText(item[1])}}>
             <Stack spacing={2} direction='row'>
               <img src={keys[item[0]]} alt={`${item[0]}`} style={{
                 height: '27px',
                 width: '27px'
               }}/>
               <p>{truncateAddress(item[1])}</p>
             </Stack>
           </button></Tooltip>}</>
         })}
       </Grid>
     )
   }
 }
 
export default Addresses;
 