import React from 'react';
import ReactDOM from 'react-dom';
import ErrorElement from '../../src/components/zetta/common/ErrorMessages/ErrorMessages.js';



/*
*
*  const nextChildrenWithValidation = Array.isArray(chValidation.props.children) ? chValidation.props.children : [chValidation.props.children];
   const nextChildrenWithValue = Array.isArray(chValue.props.children) ? chValue.props.children : [chValue.props.children];
 * */





export function updateInputWithInvalid(elemWithInput){
  const newProps = {
    ['data-invalid']: true,
  };

  return React.cloneElement(elemWithInput, Object.assign({}, elemWithInput.props, newProps))
}

export function updateInputWithValid(elemWithInput){
  const newProps = {
    ['data-invalid']: false,
  };

  return React.cloneElement(elemWithInput, Object.assign({}, elemWithInput.props, newProps))
}

export function updateInputWithNewValue(elem, newValue){
  const newProps = {
    value: newValue
  };
  return React.cloneElement(elem, Object.assign({}, elem.props, newProps));
}


export const isLastChild = component => {
  return !component.hasOwnProperty('props') || !component.props.hasOwnProperty('children');
};


export const childIsString = component => {
  if(!component) return false;
  return component.hasOwnProperty('props') && component.props.hasOwnProperty('children') && typeof component.props.children === 'string';
};

export const childIsHtmlInputElement = component => {
  if(!component || !component.hasOwnProperty('props') || !component.props.hasOwnProperty('children')) return false;
  const newChildren = Array.isArray(component.props.children) ? component.props.children : [component.props.children];
  let hasInput = []
  newChildren.forEach((child, index) => {
    if(!child.hasOwnProperty('type')) return;
    if(child.type === 'input') hasInput.push(index);
  });
  return {isHtmlInputElement:  hasInput.length > 0, inputElementIndexes: hasInput};
};

export const childHasPropsValue = component => {
  if(!component || !component.hasOwnProperty('props') || !component.props.hasOwnProperty('children')) return false;
  const newChildren = Array.isArray(component.props.children) ? component.props.children : [component.props.children];
  let hasInput = [];
  newChildren.forEach((child, index) => {
    // console.log(child);
    if(child.hasOwnProperty('props') && child.props.hasOwnProperty('value')) hasInput.push(index);
  });
  return {hasPropsValue:  hasInput.length > 0, valueIndexes: hasInput };
};



export function getInputElement(children, index){
  const newChildren = Array.isArray(children) ? children : [children];
  return newChildren[index];
}

export function updateInputWithRef(elemWithInput, pathToValue, objectRefs, ReactComponent, parentElem){
  const newElement = Object.assign({}, elemWithInput, {key: pathToValue, ref: ((c) => { objectRefs[pathToValue] = c } )});
  const newProps = {
    onBlur: (e) => {
      const value = objectRefs[pathToValue].value;
      const parentElem = ReactDOM.findDOMNode(objectRefs[pathToValue].parentNode);
      const newParent = React.cloneElement(parentElem, Object.assign({}, parentElem.props));
     // validateOnBlur();
      console.log('onLuer')
      elemWithInput.props.onBlur && elemWithInput.props.onBlur(e);
    },
    onChange: (e) => {
      const validators = elemWithInput.props['data-validators'];
      const errorMessages = validators ? validators.map(validator => validator(elemWithInput.props.value)) : [];
      console.log(errorMessages);
      elemWithInput.props.onChange && elemWithInput.props.onChange(e);
      // objectRefs[pathToValue] = objectRefs[pathToValue].setAttribute('data-errorMessages', errorMessages);
      // ReactComponent.forceUpdate();
      // elemWithInput = React.cloneElement(elemWithInput, Object.assign({}, elemWithInput.props, {['data-errorMessages']: errorMessages}));
    },
    ['data-pathToValue']: pathToValue,
  };

  return React.cloneElement(newElement, Object.assign({}, elemWithInput.props, newProps))
}
export function updateInputWithErrorMessages(elemWithInput, errorMessages, ReactComponent, parentElem){
  const newProps = {
    ['data-invalid']: true,
    ['data-errorMessages']: errorMessages,
  };

  return React.cloneElement(elemWithInput, Object.assign({}, elemWithInput.props, newProps))
}


export function reconcileChildren(child1, child2){
  const child1_array = Array.isArray(child1) ? child1 : [child1];
  const child2_array = Array.isArray(child2) ? child2 : [child2];
  const newPropsChildren = {
    children: child1_array.map((ch1, index) => {
      return React.cloneElement(ch1, Object.assign({}, ch1.props, child2_array[index]))
    })
  };
  return newPropsChildren;
}

export const mergedArray = (arrays) => [].concat.apply([], arrays);
