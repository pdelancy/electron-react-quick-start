import React from 'react';
import NewDoc from './NewDoc';
import SharedDoc from './SharedDoc';
import axios from 'axios';
import {Link} from 'react-router-DOM';


// var newDocs = ['doc1', 'doc2', 'doc3'];

class MyDocuments extends React.Component {

  constructor(props){
    super(props);
    this.state={
      docs: []
    };
  }

  componentDidMount(){
    axios.get('http://localhost:3000/documents')
    .then((docs)=>{
      this.setState({
        docs: docs.data,
      });
    });
  }

  render(){
    console.log(this.state.docs);
    return(
      <div className = 'container'>
        <h3> My Documents </h3>
        <ul>
        {this.state.docs.map((doc)=>{return(
          <li><Link to={'/editor/' + doc._id}>{doc.title}</Link></li>);
        })}
      </ul>
      </div>
    );
  }
}


class DocumentPortal extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
      <h3>Document Portal</h3>
      <NewDoc history = {this.props.history}/>
      <MyDocuments />
      <SharedDoc history={this.props.history} style = {{alignItems: 'center'}}/>
      </div>
    );
  }
}
export default DocumentPortal;
