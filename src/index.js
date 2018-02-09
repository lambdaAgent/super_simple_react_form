import React from 'react';
import PropTypes from 'prop-types';
import { renderElemWithErrorMessages, beginValidate } from './helper.js';
import { validations } from './Validations';
import ErrorMessages from './ErrorMessages';

class SuperSimpleReactForm extends React.Component {
  constructor(props){
    super(props);
    this.childrenWithValidation;
    this.renderChildren = this.renderChildren.bind(this);
  }

  renderChildren(){
    let Children = this.props.children;
    // assign all data attributes to upperComponent
    Children = Children.map((child, index) => {
      // how to reconcile 2 props
      let newChild;
      if(this.childrenWithValidation){
        const childWithValidation = this.childrenWithValidation[index];
        if(childWithValidation.hasOwnProperty('props') && childWithValidation.props.hasOwnProperty('data-errorMessages')){
          // render validation;
          const ErrorElement = this.props.errorElement || ErrorMessages;
          newChild = renderElemWithErrorMessages(childWithValidation, child, ErrorElement);
        }
      }

      return newChild || child;
    });

    return Children;
  }

  render(){
    return <form {...this.props} onSubmit={this.handleSubmit.bind(this)} >
      {this.renderChildren()}
    </form>
  }

  handleSubmit(e){
    e.preventDefault();
    e.stopPropagation();

    let isValids = new Array(this.props.children.length);
    let children = this.props.children.map((child, index) => {
      const {valid, child: newChild} = beginValidate(child);
      isValids[index] = valid
      return newChild || child;
    });

    this.childrenWithValidation = children;
    this.forceUpdate();

    const isValid = isValids.every(valid => valid === true);
    this.props.onSubmit && this.props.onSubmit(e, {isValid});
  }
}

export { validations }; 
export const SimpleForm = SuperSimpleReactForm ;
export default SuperSimpleReactForm;
