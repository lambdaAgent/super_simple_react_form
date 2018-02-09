import React from 'react';
import PropTypes from 'prop-types';
import { renderElemWithErrorMessages, beginValidate, initChildren } from './helper.js';
import { validations } from '../../soya_next_shared/utilities/validations.js';
import ErrorMessages from '../../src/components/zetta/common/ErrorMessages/ErrorMessages.js';

class SuperSimpleReactForm extends React.Component {
  constructor(props){
    super(props);
    this.childrenWithValidation;
    this.renderChildren = this.renderChildren.bind(this);
  }

  componentWillMount(){
    this.childrenWithValidation = initChildren(this.props.children);
  }

  renderChildren(){
    let Children = this.props.children;
    // assign all data attributes to upperComponent
    Children = Children.map((child, index) => {
        // how to reconcile 2 props
        let newChild;
    if(this.childrenWithValidation){
      const childWithValidation = this.childrenWithValidation[index];
      if(childWithValidation.hasOwnProperty('props') && childWithValidation.props.hasOwnProperty('data-errorMessages')) {
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

    let valids = new Array(this.props.children.length);
    let children = this.props.children.map((child, index) => {
        const {valid, child: newChild} = beginValidate(child);
    valids[index] = valid
    return newChild || child;
  });

    this.childrenWithValidation = children;

    this.props.onSubmit && this.props.onSubmit(e, {valids});
    this.forceUpdate();
  }
}

export { validations };
export const SimpleForm = SuperSimpleReactForm ;
export default SuperSimpleReactForm;
