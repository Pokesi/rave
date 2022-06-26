import React, { Component } from 'react';
import logo from '../../RaveBase.png';
import './App.css';
import { useNavigate } from 'react-router-dom';

class Js extends Component {
  constructor(props) {
    super(props);

    this.history = props.history;

    this.toHome = this.toHome.bind(this);
  }

  toHome() {
    this.history(`/`);
  }

  render() {
    return (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{
            fontFamily: 'Nunito Sans',
            fontSize: '24px'
          }}><b>Rave.JS, the easiest way to integrate Rave into your products</b></p>
          <object type="image/svg+xml" data="https://gh-card.dev/repos/rave-names/ravejs.svg?fullname=&link_target=_blank"></object>
          <p style={{
            fontFamily: 'Nunito Sans',
            fontSize: '21px'
          }}>Read the <a href="https://docs.rave.domains/devs/rave.js">docs</a> to learn how to use Rave.JS</p>
          <p>Install with <code className={'hi-bg'}> $ npm install --save @rave-names/rave </code></p>
          <button style={{
            border: 'none',
            background: '#272727',
            color: '#FFF',
            cursor: 'pointer',
            borderRadius: '15px',
            padding: '2vh 4vh',
            fontFamily: 'Nunito Sans',
            fontSize: '21px'
          }} onClick={this.toHome}><b>Back home...</b></button>
        </header>
    );
  }
}

const WrappedJS = props => {
  const history = useNavigate()

  console.log(history)

  return <Js history={history} {...props} />
}

export default  WrappedJS;
