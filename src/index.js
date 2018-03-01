import React from 'react';
import PropTypes from 'prop-types';
import { validateAndAddPropsErrorMessages, initChildren, renderChildrenWithErrorMessages} from './recurse.js';
import {reconcileTwoElements} from './reconcile.js';
import { validations } from '../../soya_next_shared/utilities/validations.js';
import ErrorMessages from '../../src/components/zetta/common/ErrorMessages/ErrorMessages.js';

class SuperSimpleReactForm extends React.Component {
  propTypes = {

  };

  constructor(props){
    super(props);
    this.initializeChildren;
    this.objectRefs = {};
    this.renderChildren = this.renderChildren.bind(this);
  }

  componentWillMount(){
    if(!this.props.children) {
      this.initializeChildren = this.props.children;
      return;
    }
    const initializeChildren = this.initializeChildren = initChildren(this, this.objectRefs, this.props.errorElement || ErrorMessages);
  }
  componentDidMount(){

  }

renderChildren(){
  // console.log(this.childrenWithValidation);
  // return this.childrenWithValidation;

  // let Children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
  // Children = Children.map((childWithValue, index) => {
  //   let newChild;
  //   if(this.childrenWithValidation){
  //     const childWithValidation = this.childrenWithValidation[index];
  //     // render validation;
  //     const ErrorElement = this.props.errorElement || ErrorMessages;
  //     newChild = reconcileTwoElements(childWithValidation, childWithValue, ErrorElement);
  //   }
  //   return newChild || child;
  //   // return child;
  // });
  // if(this.childrenWithValidation){
  //   setTimeout(() => {this.childrenWithValidation = null }, 10);
  //
  //   const renderedChildren = renderChildrenWithErrorMessages(this.childrenWithValidation, this, this.props.errorElement || ErrorMessages);
  //   return renderedChildren;
  // }
  //
  // const initializeChildren = this.initializeChildren = initChildren(this, this.objectRefs, this.props.errorElement || ErrorMessages);
  // const renderedChildren = renderChildrenWithErrorMessages(initializeChildren, this, this.props.errorElement || ErrorMessages);
  // return renderedChildren;
  // this.initializeChildren = initChildren(this, this.objectRefs, this.props.errorElement || ErrorMessages);
  // const validatingChildren = validateAndAddPropsErrorMessages(this.props.children, this);
  // return reconcileTwoElements(validatingChildren, this.props.children);
  // return renderChildrenWithErrorMessages(validatingChildren, this, this.props.errorElement || ErrorMessages);
  // return initChildren(this, this.objectRefs, this.props.errorElement || ErrorMessages);;
  // return this.childrenWithValidation;
  // return this.initializeChildren;
  return this.props.children;
}

  render(){
    return <form {...this.props} onSubmit={this.handleSubmit.bind(this)} >
      {this.renderChildren()}
    </form>
  }

  handleSubmit(e,event){
    e.preventDefault();
    e.stopPropagation();

    const {validities , children: validatedChildren } = validateAndAddPropsErrorMessages(this.initializeChildren, this);
    this.initializeChildren = validatedChildren;


    this.props.onSubmit && this.props.onSubmit(e,event, validities);
    this.forceUpdate();
  }
}

export { validations };
export const SimpleForm = SuperSimpleReactForm ;
export default SuperSimpleReactForm;
