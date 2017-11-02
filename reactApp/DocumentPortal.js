import React from 'react';
import NewDoc from './NewDoc';
import SharedDoc from './SharedDoc';
import axios from 'axios';
import { Link } from 'react-router-DOM';
import * as colors from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';

class MyDocuments extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    console.log('this.props.files', this.props.files);
    console.log(`/editor/${this.props.user}`);
    return(
      <div className = 'container'>
        <h3> My Documents </h3>
        <ul>
        {this.props.files.map((doc)=>{return(
          <li key = {doc._id}><Link to = {`/editor/${this.props.user}/${doc._id}`}>
          {doc.title}</Link></li>);
        })}
      </ul>
      </div>
    );
  }
}

class DocumentPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      user: ''
    };
  }

  componentDidMount(){
    axios.post('http://localhost:3000/getAllDocs', {
      id: this.props.match.params.userid
    })
      .then((response) =>{
        this.setState({
          files: response.data,
          user: this.props.match.params.userid
        });
      })
      .catch(err=>console.log(err));
  }


  logout(){
    axios.get('http://localhost:3000/logout')
    .then((resp) => {
      console.log(resp);
      this.props.history.replace('/');
    })
    .catch(err=>console.log(err));
  }

  render() {
    return (
      <div>
      <h3>Document Portal</h3>
      CurrentUser: {this.props.match.params.userid}
      <h6>Welcome {}!</h6>
      <NewDoc history={this.props.history} user = {this.state.user}/>
      <MyDocuments files = {this.state.files} user = {this.state.user} />
      <SharedDoc history={this.props.history} user = {this.state.user}/>
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '20'}}>
      <RaisedButton
        label="Logout"
        onClick={this.logout.bind(this)}
        backgroundColor = {String(colors.gray200)}
      />
    </div>
      </div>
    );
  }
}
export default DocumentPortal;
