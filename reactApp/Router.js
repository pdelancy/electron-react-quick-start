import React from 'react';
import Redirect from 'react-router';
import { Switch, Route, Link } from 'react-router-DOM';
import AppBar from 'material-ui/AppBar';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import DocumentPortal from './DocumentPortal';
import NewDoc from './NewDoc';

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
        <Route path={"/editor/:id"} exact component = {Main} />
        <Route path={"/document"} exact component = {DocumentPortal} />
        <Route path={"/newdocument"} exact component = {NewDoc} />
      </div>
    );
  }


}

export default Router;
