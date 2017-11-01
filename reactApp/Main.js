import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import {CirclePicker} from 'react-color';
import Popover from 'material-ui/Popover';
import {Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map} from 'immutable';
import axios from 'axios';

const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  right: {
    wrapper: <div className = "right-align"/>
  },
  center: {
    wrapper: <div className = "center-align"/>
  }

}));

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      inlineStyles: {}
    };
  }

  onChange(editorState){
    this.setState({
      editorState
    });
  }

  toggleFormat(e, style, block){
    // this.refs.editor.focus();
    e.preventDefault();
    if(block){
      this.setState({
        editorState: RichUtils.toggleBlockType(this.state.editorState, style, block)
      });
    }else{
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
      });
    }
  }

  formatButton({icon, style, block}) {
    return(
      <RaisedButton
        backgroundColor = {
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          String(colors.gray200) :
          String(colors.gray800)
        }
        onMouseDown = {(e) => this.toggleFormat(e, style, block)}
        icon={<FontIcon className="material-icons"> {icon} </FontIcon>}
  />
    );
  }

  formatColor(color){
    console.log('inlinestyles', this.state.inlineStyles);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles, {[color.hex]: {color: color.hex}});
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
  }

  applyIncreaseFontSize(shrink){
    console.log('increase font size', this.state.inlineStyles);
    var newFontSize = this.state.currentFontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign({}, this.state.inlineStyles, {[newFontSize]: {fontSize: `${newFontSize}px`}});
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(newFontSize)),
      currentFontSize: newFontSize
    });
  }

  increaseFontSize(shrink){
    return(
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        onMouseDown = {()=> this.applyIncreaseFontSize(shrink)}
        icon={<FontIcon className="material-icons"> {shrink ? 'zoom_out' : 'zoom_in'} </FontIcon>}
      />
    );
  }

  openColorPicker(e){
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker(){
    this.setState({
      colorPickerOpen: false
    });
  }

  colorPicker(){
    return(
      <div style = {{display: 'inline-block'}}>
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        icon={<FontIcon className="material-icons"> format_paint</FontIcon>}
        onClick = {this.openColorPicker.bind(this)}
      />
      <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeColorPicker.bind(this)}
        >
          <CirclePicker onChangeComplete = {this.formatColor.bind(this)} />
        </Popover>
      </div>
    );
  }

  updateDoc(id, editorState){
    axios.post('http://localhost:3000/updatedoc', {
      id,
      editorState
    })
    .then(resp=>{
      alert('Document Saved!');
    })
    .catch(err=>console.log(err));
  }

  saveChanges(){
    return(
      <RaisedButton
        backgroundColor = {String(colors.gray200)}
        onMouseDown ={()=>(this.updateDoc(this.props.match.params.id, this.state.editorState))}
        icon={<FontIcon className="material-icons"> save </FontIcon>}
      />
    );
  }

  returnhome(){
    var returnHomePage = confirm("Are you sure you want to return to main page?");
    if (returnHomePage){
      this.props.history.push('/document');
    }else{
      return;
    }
  }

  render(){
    console.log(window.innerWidth);
    return (
    <div>
      Document ID: {this.props.match.params.id}
      <div className = "toolbar">
        {this.formatButton({icon: 'format_bold', style: 'BOLD'})}
        {this.formatButton({icon: 'format_italic', style: 'ITALIC'})}
        {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE'})}
        {this.colorPicker()}
        {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true})}
        {this.formatButton({icon: 'format_list_numbered', style: 'unordered-list-item', block: true})}
        {this.formatButton({icon: 'format_align_left', style: 'unstyled', block: true})}
        {this.formatButton({icon: 'format_align_center', style: 'center', block: true})}
        {this.formatButton({icon: 'format_align_right', style: 'right', block: true})}
        {this.increaseFontSize(false)}
        {this.increaseFontSize(true)}
      </div>
      <div className = "toolbar">
        {this.saveChanges()}
        <RaisedButton
          backgroundColor = {String(colors.gray800)}
          onMouseDown = {()=>this.returnhome()}
          icon={<FontIcon className="material-icons"> home </FontIcon>}/>
      </div>
      <Editor
              ref = 'editor'
              blockRenderMap={myBlockTypes}
              customStyleMap = {this.state.inlineStyles}
              placeholder = "Write something colorful..."
              onChange = {this.onChange.bind(this)}
              editorState = {this.state.editorState}
            />
    </div>
    );
  }
}

export default Main;
