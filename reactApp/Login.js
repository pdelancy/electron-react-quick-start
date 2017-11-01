<<<<<<< HEAD
import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleSubmit(event){
    event.preventDefault();
    axios.post('http://localhost:3000/reigster',{
      username: this.state.username,
      password: this.state.password,
    },{
      withCredentials: true
    })
    .then((resp)=>{
      if(resp.data.success){
        console.log('success');
        this.props.history.push('/login');
      }
    })
    .catch((err)=>console.log(err));
  }

  render(){
    return (
      <div>
    <div>
      <AppBar title = "RE_EDIT Login"/>
    </div>
    <form action="/login" method="post">
        <input type="text" name="username" placeholder="username" value="" ref = 'username'/><br/>
        <input type="password" name="password" placeholder="password" value="" ref = 'password'/><br/>
        <button type="submit" name="button">Login</button>
      </form>
    </div>
    );
  }
=======

import React from 'react';
import Redirect from 'react-router';
import {BrowserRouter, Switch, Route, Link} from 'react-router-DOM';
import Main from './Main';
import axios from 'axios';
class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  login() {
    axios.post('http://localhost:3000/login',{
      username: this.state.username,
      password: this.state.password
    })
    .then((response)=>{
      console.log(response);
      this.props.history.push('/editor');
    })
    .catch((err)=>{
      console.log('Error: ', err);
      return null;
    });
  }

  render(){
    console.log(this.props.location.pathname);
    return(
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>

        <h1>LOGIN</h1>
        <br/>
        <input
          type="text"
          name="username"
          placeholder="username"
          value={this.state.username}
          onChange={(e)=>(this.setState({username: e.target.value}))}/>
        <br/>
        <input
          type="password"
          name="password"
          placeholder="password"
          value={this.state.password}
          onChange={(e)=>(this.setState({password: e.target.value}))}/>
        <div className = 'memberLink' style={{margin: '20'}}>
          <button onClick={this.login.bind(this)}>
            Login
          </button>
        </div>
        <Link to='/register'>
          <div style={{padding: 10}}>Not a member? Click Here to Register</div>
        </Link>
        {/* <Route path="/editor" component = {Main}/> */}
      </div>
    );
  }


>>>>>>> 56a744338c2a5269af5ffc270448d10983f36de4
}

export default Login;
