import React from 'react';
import Redirect from 'react-router';
import { Switch, Route, Link} from 'react-router-DOM';
import AppBar from 'material-ui/AppBar';
import Main from './Main';
import Login from './Login';
import Register from './Register';
class Router extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        <AppBar title = "RE_EDIT" />
        <Route path={"/"} exact component = {Login} />
        <Route path={"/register"} exact component = {Register} />
        <Route path={"/editor"} exact component = {Main} />
        
      </div>
    );
  }


}

export default Router;
