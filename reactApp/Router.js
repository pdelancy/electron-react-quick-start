import React from 'react';
import { Route } from 'react-router-DOM';
import AppBar from 'material-ui/AppBar';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import DocumentPortal from './DocumentPortal';
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
        <Route path={"/editor/:id"} component = {Main} />
        <Route path={"/document"} exact component = {DocumentPortal} />
      </div>
    );
  }


}

export default Router;
