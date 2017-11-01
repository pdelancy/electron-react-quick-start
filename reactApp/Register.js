import React from 'react';
<<<<<<< HEAD
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import {CirclePicker} from 'react-color';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Editor, EditorState, Modifier, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map} from 'immutable';
import axios from 'axios';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password:''
    };
  }

//Third element in axios call can include extra info, headers etc
  handleSubmit(){
    console.log('state', this.state);
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
      <AppBar title = "RE_EDIT Register"/>
    </div>
    <form >
      <input type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange = {(e)=>this.setState({username: e.target.value})}/><br></br>
      <input type="password"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange = {(e)=>this.setState({password: e.target.value})}/><br></br>
      <button onClick={()=>this.handleSubmit()}>Register</button>
    </form>
    </div>
    );
  }
=======
// import Redirect from 'react-router';
import axios from 'axios';
import {Redirect, Route, Link} from 'react-router-DOM';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      registered: false
    };
  }

  register() {
    axios.post("http://localhost:3000/register", {
      username: this.state.username,
      password: this.state.password
    }, {
      withCredentials: true
    })
    .then((response)=>{
      console.log(response);
      this.setState({
        registered: true
      });
    });
  }

  render(){
    console.log(this.props.location.pathname);
    if (this.state.registered) {
      return(<Redirect to="/"></Redirect>);
    }

    return(
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>

        <h1>Register</h1>
        <br/>
        <input type="text" name="username" placeholder="username" value={this.state.username} onChange={(e)=>(this.setState({username: e.target.value}))}/>
        <br/>
        <input type="password" name="password" placeholder="password" value={this.state.password} onChange={(e)=>(this.setState({password: e.target.value}))}/>
        <div className = 'memberLink'>
          <button onClick={this.register.bind(this)}>
            Register
          </button>
        </div>
        <Link to='/'>
          <div style={{padding: 10}}>Back to Login</div>
        </Link>
      </div>
    );
  }

>>>>>>> 56a744338c2a5269af5ffc270448d10983f36de4
}

export default Register;
