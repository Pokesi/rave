
import React, { Component, useState } from 'react';
import '../App.css';
 
import { Grid } from 'theme-ui';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
 
import { Rave } from '@rave-names/rave';
 
import { shorten } from '../../../helpers/truncateAddress.js';
 
import Swal from 'sweetalert2';
import $ from 'jquery';
 
 const rave = new Rave();
 
 const getRecord = async (name, record) => {
  return await rave.getText(name, record)
 }
 
 const CustomRecordAdd = ({
   contract,
   name,
 }) => {
  return <><button style={{
     border: 'none',
     background: '#272727',
     color: '#FFF',
     cursor: 'pointer',
     borderRadius: '15px',
     padding: '2vh 4vh',
     fontFamily: 'Nunito Sans',
     fontSize: '21px'}}
     onClick={() => {Swal.fire({
       title: `Set a custom text record`,
       html:
         '<p>All characters are allowed.</p><br />' +
         '<input id="key" placeholder="Key" class="swal2-input">' +
         '<input id="value" placeholder="Value" class="swal2-input">',
       icon: 'info',
       showDenyButton: true,
       showConfirmButton: true,
       confirmButtonText: 'Set!',
       denyButtonText: 'No thanks...',
       preConfirm:  function () {
        return new Promise( function (resolve) {
           resolve({
             key: $('#key').val(),
             value: $('#value').val(),
           })
         })
       },
     }).then( async (result) => {
       if (result.isConfirmed) {
         contract.functions.setText(name.toUpperCase(), result.value.key, result.value.value).catch((e) => { /* null */ });
       }
     });}}
     >Set A Custom Record</button></>
 }
 
 const InputWithTag = ({
   txt,
   name,
   owner,
   value,
   onChange,
   contract,
 }) => {
   const [record, setRecord] = useState('');
   getRecord(name, txt).then(res => {
     setRecord(res);
   });
  return <Stack direction="row" spacing={4}  style={{
         height: '10vh',
       }}>
         <p style={{
           width: '10vw',
         }}>{txt}</p>
         {owner ? <input type="text" onChange={onChange} value={value} placeholder={record} style={{
           width: '30vw',
           borderRadius: '15px',
           border: 'none',
           color: '#FFF',
           background: '#272727',
           paddingLeft: '20px',
           fontSize: '21px',
         }}/> : (<p style={{
           width: '30vw',
           width: '30vw',
           borderRadius: '15px',
           border: 'none',
           color: '#FFF',
           background: '#272727',
           paddingTop: '20px',
           fontSize: '21px',
         }}>{shorten(record) || "Not set"}</p>)}
         {owner && <button style={{
           border: 'none',
           width: '20vh',
           background: '#272727',
           color: '#FFF',
           cursor: 'pointer',
           borderRadius: '15px',
           padding: '2vh 4vh',
           fontFamily: 'Nunito Sans',
           fontSize: '21px'}}
           onClick={() => {contract.functions.setText(name.toUpperCase(), txt, value)}}
           >Set</button>}
       </Stack>
 }
 
 const textRecords = [
   "com.twitter",
   "com.github",
   "com.discord",
   "com.reddit",
   "org.telegram",
   "email",
   "description",
 ]
 
 class Records extends Component {
   constructor(props) {
     super(props);
     this.state = {
       contract: props.contract,
     }
     this.onTwitter = this.onTwitter.bind(this);
     this.onGithub = this.onGithub.bind(this);
     this.onDiscord = this.onDiscord.bind(this);
     this.onReddit = this.onReddit.bind(this);
     this.onTelegram = this.onTelegram.bind(this);
     this.onEmail = this.onEmail.bind(this);
   }
 
   onTwitter(e) {
     this.setState({
       twitter: e.target.value
     });
   }
 
   onGithub(e) {
     this.setState({
       github: e.target.value,
     });
   }
 
   onDiscord(e) {
     this.setState({
       discord: e.target.value
     });
   }
 
   onReddit(e) {
     this.setState({
       reddit: e.target.value
     });
   }
 
   onTelegram(e) {
     this.setState({
       telegram: e.target.value
     });
   }
 
   onEmail(e) {
     this.setState({
       email: e.target.value
     });
   }
 
   render() {
    return (
       <Grid gap={2} style={{
         alignItems: "center",
         alignSelf: "center",
         textAlign: "center" }}>
         <InputWithTag name={this.props.name} txt={textRecords[0]} contract={this.state.contract} owner={this.props.owner} value={this.state.twitter} onChange={this.onTwitter}/>
         <InputWithTag name={this.props.name} txt={textRecords[1]} contract={this.state.contract} owner={this.props.owner} value={this.state.github} onChange={this.onGithub}/>
         <InputWithTag name={this.props.name} txt={textRecords[2]} contract={this.state.contract} owner={this.props.owner} value={this.state.discord} onChange={this.onDiscord}/>
         <InputWithTag name={this.props.name} txt={textRecords[3]} contract={this.state.contract} owner={this.props.owner} value={this.state.reddit} onChange={this.onReddit}/>
         <InputWithTag name={this.props.name} txt={textRecords[4]} contract={this.state.contract} owner={this.props.owner} value={this.state.telegram} onChange={this.onTelegram}/>
         <InputWithTag name={this.props.name} txt={textRecords[5]} contract={this.state.contract} owner={this.props.owner} value={this.state.email} onChange={this.onEmail}/>
         <CustomRecordAdd name={this.props.name} contract={this.state.contract} />
       </Grid>
     )
   }
 }
 
export default Records;
 