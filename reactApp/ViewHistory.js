import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw} from 'draft-js';
import {Map} from 'immutable';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  right: {
    wrapper: <div className = "right-align"/>
  },
  center: {
    wrapper: <div className = "center-align"/>
  }

}));

class ViewHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  showContent(version){
    return(
      <Editor
        ref = 'editor'
        blockRenderMap={myBlockTypes}
        customStyleMap = {this.state.inlineStyles}
        editorState = {Object.value(version)}
      />
    );
  }

  render(){
    return(
      <div>
      {this.state.history.map((version)=>{
        return(
          <RaisedButton
            key = {Object.keys(version)}
            backgroundColor = "#FFCA28"
            onMouseDown = {(version)=>this.showContent(version)}
            label = {Object.keys(version)}
            content = {Object.value(version)}
            />
        );
      })}
      </div>
    );
  }

}

export default ViewHistory;
