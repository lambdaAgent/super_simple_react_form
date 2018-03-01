import React from 'react';
import ReactDOM from 'react-dom';
import {updateInputWithInvalid, updateInputWithNewValue, updateInputWithRef,
  updateInputWithValid, childHasPropsValue, childIsHtmlInputElement, isLastChild,
  reconcileChildren, getInputElement, childIsString
} from './helper.js';

import ErrorElement from '../../src/components/zetta/common/ErrorMessages/ErrorMessages.js';

export function reconcileTwoElements3(childWithValidation, childWithValue, errorElement) {

  function searchAndReconcile(searchChildWithValidation, searchChildWithValue){
    if(!childWithValue){
      console.log('TRUE');
      return searchChildWithValidation;
    }

    else {
      const result =  React.cloneElement(searchChildWithValidation, {});
      console.log(result);
      return result
    }
  }
  if(Array.isArray(childWithValidation)){
    return childWithValidation.map((chWithValidation, chIndex) => {
      const chWithValue = chIndex === childWithValidation.length-1 ? childWithValidation[chIndex] : null;
      return searchAndReconcile(chWithValidation, chWithValue);
    })
  }

  return searchAndReconcile(childWithValidation, childWithValue);
  // const finalReconcile = searchAndReconcile(childWithValidation, childWithValue);
  // console.log('childWithValue', childWithValue);
  // console.log('finalReconcile',finalReconcile);
  // return childWithValue;
}



export function reconcileTwoElements(childWithValidation, childWithValue, errorElement){

  function searchAndReconcile(searchChildWithValidation, searchChildWithValue) {
    if(!searchChildWithValue){
      console.log('TRUE');
      return searchChildWithValidation;
    } else {
      return searchChildWithValue;
    }

    const { hasPropsValue, valueIndexes } = childHasPropsValue(searchChildWithValue);
    const { isHtmlInputElement, inputElementIndexes } = childIsHtmlInputElement(searchChildWithValue);
    if (isLastChild(searchChildWithValidation)) {
      // break case
      return searchChildWithValidation;
    }
    else if (childIsString(searchChildWithValidation)){
      return searchChildWithValidation.props.children;
    }


    else if (hasPropsValue || isHtmlInputElement) {
      // reconcile and break case
      const searchChildrenWithValue = Array.isArray(searchChildWithValue.props.children) ? searchChildWithValue.props.children : [searchChildWithValue.props.children];
      const searchChildrenWithValidation = Array.isArray(searchChildWithValidation.props.children) ? searchChildWithValidation.props.children : [searchChildWithValidation.props.children];
      console.log('searchChildrenWithValue', searchChildrenWithValue);
      let newChildren;
      if(!Array.isArray(searchChildWithValue.props.children)){
        newChildren = {
          children: searchChildrenWithValidation.map((chWithValidation, chIndex) => {
            return React.cloneElement(searchChildWithValue, Object.assign({},
              searchChildWithValue.props,
              chWithValidation.props,
              {value: 'asdf'}
            ))
          })
        };
        return React.cloneElement(searchChildWithValue, Object.assign({}, searchChildWithValidation.props, searchChildWithValue.props, newChildren))

      } else {
        newChildren = {
          children: searchChildrenWithValidation.map((chWithValidation, chIndex) => {
            const _searchChildWithValueProps =  chIndex <= (searchChildrenWithValue.length-1) ? searchChildrenWithValue[chIndex].props : null;
            return React.cloneElement(searchChildrenWithValue, Object.assign({},
              _searchChildWithValueProps,
              chWithValidation.props,
              {value: 'asdf'}
            ))
          })
        };
      }
      console.log('newChildren', newChildren);
      return React.cloneElement(searchChildrenWithValue, Object.assign({}, searchChildWithValidation.props, searchChildWithValue.props, newChildren))
    }

    else {
      // continuation
      if(Array.isArray(searchChildWithValue)){
        let oldChildrenWithValidation = Array.isArray(searchChildWithValidation.props.children) ? searchChildWithValidation.props.children : [searchChildWithValidation.props.children];
        const newProps = {
          children: oldChildrenWithValidation
            .map((cWithValidation, index) => {
            const oldChildWithValue = index <= (searchChildWithValue.length-1) ? searchChildWithValue : null;
            console.log('index', index);
            return searchAndReconcile(cWithValidation, oldChildWithValue)
          })
        };
        return React.cloneElement(searchChildWithValidation, Object.assign({}, searchChildWithValidation.props, searchChildWithValue.props, newProps));

      } else {
        let oldChildrenWithValidation = Array.isArray(searchChildWithValidation.props.children) ? searchChildWithValidation.props.children : [searchChildWithValidation.props.children];
        const newProps = {
          children: oldChildrenWithValidation
            .map((cWithValidation, index) => {
            const oldChildWithValue = index === 0 ? searchChildWithValue : null;
            return searchAndReconcile(cWithValidation, oldChildWithValue)
          })
        };
        return React.cloneElement(searchChildWithValidation, Object.assign({}, searchChildWithValidation.props, searchChildWithValue.props, newProps));
      }
    }
  }

  // initiate
  // let oldChildrenWithValidation = Array.isArray(childWithValidation.props.children) ? childWithValidation.props.children : [childWithValidation.props.children];
  // let oldChildrenWithValue = Array.isArray(childWithValue.props.children) ? childWithValue.props.children : [childWithValue.props.children]
  // const newProps = {
  //   children : oldChildrenWithValidation.map((oldChildWithValidation, index) => searchAndReconcile(oldChildWithValidation, oldChildrenWithValue[index]))
  // };
  if(Array.isArray(childWithValidation)){
    return childWithValidation.map((chWithValidation, chIndex) => {
      const chWithValue = chIndex <= childWithValue.length-1 ? childWithValue[chIndex] : null;
      const newProps = {
        children : searchAndReconcile(chWithValidation, chWithValue)
      };
      return searchAndReconcile(chWithValidation, chWithValue, newProps);
    })
  }

  const newProps = {
    children : searchAndReconcile(childWithValidation, childWithValue)
  };
  const result = React.cloneElement(childWithValue, Object.assign({}, childWithValidation.props, childWithValue.props, newProps));
  return result;
}

// from react
// renderChildren(){
//   // console.log(this.childrenWithValidation);
//   // return this.childrenWithValidation;
//
//   let Children = Array.isArray(this.props.children) ? this.props.children : [this.props.children];
//   // assign all data attributes to upperComponent
//   console.log('chilrend with validation', this.childrenWithValidation);
//   Children = Children.map((child, index) => {
//     let newChild;
//     if(this.childrenWithValidation){
//       const childWithValidation = this.childrenWithValidation[index];
//       // render validation;
//       const ErrorElement = this.props.errorElement || ErrorMessages;
//       newChild = reconcileTwoElements(childWithValidation, child, ErrorElement);
//       console.log('reconcile', newChild);
//     }
//     // console.log('child', child);
//     return newChild || child;
//     // return child;
//   });
//
//   return Children;
//   // return this.childrenWithValidation;
// }