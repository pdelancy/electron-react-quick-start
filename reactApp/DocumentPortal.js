import React from 'react';
import * as colors from 'material-ui/styles/colors';
import NewDoc from './NewDoc';
import SharedDoc from './SharedDoc';


var newDocs = ['doc1', 'doc2', 'doc3'];

class MyDocuments extends React.Component {

  render(){
    return(
      <div className = 'container'>
        <h3> My Documents </h3>
        <ul>
        {newDocs.map((doc)=>{return(
          <li>{doc}</li>);
        })}
      </ul>
      </div>
    );
  }
}

class DocumentPortal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <h3>Document Portal</h3>
      <NewDoc history={this.props.history}/>
      <MyDocuments />
      <SharedDoc history={this.props.history} style = {{alignItems: 'center'}}/>
      </div>
    );
  }
}
export default DocumentPortal;
