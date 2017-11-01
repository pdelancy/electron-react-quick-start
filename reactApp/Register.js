import React from 'react';
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
}

export default Register;
