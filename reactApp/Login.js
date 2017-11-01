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
}

export default Login;
