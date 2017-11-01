import React from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import * as colors from 'material-ui/styles/colors';
import { CirclePicker } from 'react-color';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import {Editor, EditorState, Modifier, RichUtils, DefaultDraftBlockRenderMap} from 'draft-js';
import {Map} from 'immutable';

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
    event.preventDefault(e);
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
        secondary={true}
        backgroundColor = {this.state.editorState.getCurrentInlineStyle().has(style) ? colors.orange800 : colors.orange200}
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
        backgroundColor = {colors.orange800}
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
        backgroundColor = {colors.orange800}
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

  render(){
    console.log(window.innerWidth);
    return (
    <div style={{ width: window.innerWidth}}>
      {/* <AppBar title = "RE_EDIT" /> */}
      <div className = "toolbar" style={{display: 'flex', justifyContent: 'spaceAround', width: '100%'}}>
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
      <Editor
              ref = 'editor'
              blockRenderMap={myBlockTypes}
              customStyleMap = {this.state.inlineStyles}
              onChange = {this.onChange.bind(this)}
              editorState = {this.state.editorState}
            />
    </div>
    );
  }
}

export default Main;