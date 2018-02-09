import React from 'react';


export const isLastChild = component => {
  return !component.hasOwnProperty('props') || !component.props.hasOwnProperty('children');
};

export const isHtmlInputElement = component => {
  return component.hasOwnProperty('type') && component.type === 'input';
};

export const hasPropsValue = component => {
  return component.hasOwnProperty('props') && component.props.hasOwnProperty('value');
};

export const getValue = component => {
  return component.hasOwnProperty('props') && component.props.hasOwnProperty('value') && component.props.value;
};

export const getValidator = component => {
  const otherValidators = component.hasOwnProperty('props') && component.props.hasOwnProperty('data-validators') && component.props['data-validators'] || [];
  return (otherValidators);
};

// handle original HTML
// export const getHTMLValue = component => {};
// export const getHTMLValidators = component => {};


export function renderElemWithErrorMessages(upperElementWithValidatation, upperElement, ErrorElement) {
  const errorMessages = upperElementWithValidatation.props['data-errorMessages'];
  const oldChildren = Array.isArray(upperElement.props.children) ? upperElement.props.children : [upperElement.props.children];
  const newProps = {
    children: oldChildren.concat([ <ErrorElement key={'error' + (new Date().getTime())} errorMessages={errorMessages}/> ])
  };
  return React.cloneElement(upperElementWithValidatation, Object.assign({}, upperElementWithValidatation.props, upperElement.props, newProps ));
}

export function beginValidate(upperComponent){
  // searchForInput :: Object a -> Object a | null
  // return the uppermost element
   const { value: inputValue, validators, pathToValue } = recursiveSearchForInput(upperComponent);
  if(inputValue === null || inputValue === undefined){
    return { upperComponent, valid: true };
  }
  const errorMessages = validators ? validators.map(validator => validator(inputValue)) : [];
  let newChildren = Array.isArray(upperComponent.props.children) ? upperComponent.props.children : [upperComponent.props.children];
  const newProps = getPropsOfNewChildren({upperComponent, children: newChildren, errorMessages, pathToValue, inputValue, validators});

  return {
    child: React.cloneElement(upperComponent, newProps ),
    valid: errorMessages ? errorMessages.length <= 0 : false
  };
}

export function getPropsOfNewChildren({upperComponent, children, errorMessages, pathToValue, inputValue, validators}){
  let upsertProps = {};
  let newProps = upperComponent.props;
  let newChildren = children;
  if(errorMessages.length > 0){
    // if react element or div
    if(upperComponent.props.hasOwnProperty('name')) { upsertProps.name = upperComponent.props.name; }
    // newChildren = newChildren.concat([<ErrorMessages key={'error' + (new Date().getTime())} errorMessages={errorMessages}/>]);
    upsertProps.children = newChildren;
    upsertProps.key = pathToValue + errorMessages;
    upsertProps['data-value'] = inputValue;
    upsertProps['data-toInputElement'] = pathToValue;
    upsertProps['data-errorMessages'] = errorMessages;
    upsertProps.onFocus = () => console.log('hello Focus');
    upsertProps.onBlur = () => console.log('hello Blur');
    newProps = Object.assign({}, upperComponent.props, upsertProps);
  }
  return newProps;
}

export function recursiveSearchForInput(arrayChildren, pathToValue, index){
  // 1. if it's the last child,
  // 2. if it has props value,
  // if child is more than one,
  let newPathToValue = pathToValue || 'root';

  function searchOneElement(child, searchPathToValue, searchIndex) {
    if(searchIndex) {
        searchPathToValue += `.${searchIndex}`;
    }

    if (hasPropsValue(child)) {
      const value = getValue(child);
      const validators = getValidator(child);
      searchPathToValue += '.props';
      return {value, validators, pathToValue: searchPathToValue};
    } else if (isHtmlInputElement(child)) {
      const value = getValue(child);
      const validators = getValidator(child);
      searchPathToValue += '.props';
      return {value, validators, pathToValue: searchPathToValue};
    } else if (isLastChild(child)) {
      // last child, and cannot find value nor type === 'input'
      return {value: null, validators: null};
    } else {
      searchPathToValue += '.props.children';
      return recursiveSearchForInput(child.props.children, searchPathToValue, searchIndex);
    }
  }


    let children = !Array.isArray(arrayChildren) ? [arrayChildren] : arrayChildren;
    return children.map((ch, loopIndex) => {
      if(children.length === 1){
        loopIndex = null;
      }
      return searchOneElement(ch, newPathToValue, loopIndex);
    }).reduce((prev, next) => {
       const { value: prevInput } = prev;
    //    const { value: nextInput } = next;
       return (prevInput !== null) ? prev : next;
    }, {value: null, validators: null});
}
