
import React, { Component } from 'react';
import '../App.css';
 
import { Grid } from 'theme-ui';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
 
import { truncateAddress } from '../../../helpers/truncateAddress.js';
 
 const keys = {
   btc: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=022',
   eth: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022',
   avax: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=022',
   bch: 'https://cryptologos.cc/logos/bitcoin-cash-bch-logo.svg?v=022',
   ftm: 'https://cryptologos.cc/logos/fantom-ftm-logo.svg?v=022',
   ltc: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=022',
   luna: 'https://cryptologos.cc/logos/terra-luna-luna-logo.svg?v=022',
   dot: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=022',
   xrp: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=022',
   bnb: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=022',
   atom: 'https://cryptologos.cc/logos/cosmos-atom-logo.svg?v=022',
 }
 
 
 class Addresses extends Component {
   constructor(props) {
     super(props);
     this.state = {}
   }
 
   render() {
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
 