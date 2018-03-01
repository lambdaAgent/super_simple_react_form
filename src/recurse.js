import React from 'react';
import ReactDOM from 'react-dom';
import {updateInputWithInvalid, updateInputWithNewValue, updateInputWithRef,
  updateInputWithValid, childHasPropsValue, childIsHtmlInputElement, isLastChild,
  reconcileChildren, getInputElement, childIsString, updateInputWithErrorMessages,
  mergedArray
} from './helper.js';

import ErrorElement from '../../src/components/zetta/common/ErrorMessages/ErrorMessages.js';


export function initChildren(FormClass, ObjectRefs) {
  const children = Array.isArray(FormClass.props.children) ? FormClass.props.children : [FormClass.props.children];
  return children.map(child => {
    let newChild = recurseAndInit(child, ObjectRefs, FormClass);
    return newChild || child;
  })
}

// loop for each leaf
export function validateAndAddPropsErrorMessages(children, ReactComponent) {
  // const children = Array.isArray(ReactComponent.props.children) ? ReactComponent.props.children : [ReactComponent.props.children];
  const result = children.map(child => {
    let newChild = recurseAndValidate(child, ReactComponent);
    return newChild || child;
  });

  return {validities: {}, children: result};
}

export function renderChildrenWithErrorMessages(children, ReactComponent, errorElement){
  // const children = Array.isArray(ReactComponent.props.children) ? ReactComponent.props.children : [ReactComponent.props.children];
  return children.map(child => {
    let newChild = recurseAndRenderErrorMessages(child, errorElement, ReactComponent);
    return newChild || child;
  })
}

function recurseAndRenderErrorMessages(elem , errorElement, ReactComponent){
  function searchAndRenderWithErrorElement(child){
    const { hasPropsValue, valueIndexes } = childHasPropsValue(child);
    const { isHtmlInputElement, inputElementIndexes } = childIsHtmlInputElement(child);
    if (isLastChild(child)) {
      // last child, and cannot find value nor type === 'input'
      return child;
    }
    else if(childIsString(child)){
      return child.props.children;
    }
    else if (hasPropsValue || isHtmlInputElement) {
      // old children should has errorElement, just need to find where in index?
      let errorMessages = [];
      let oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
          oldChildren = oldChildren.map(ch => {
            if(ch.type === 'input' || (ch.hasOwnProperty('props') && ch.props.hasOwnProperty('value'))){
              errorMessages.push(ch.props['data-errorMessages']);
            } else if(ch.key && ch.key.indexOf('errorMessages') === 0){
              const flattenErrorMessages = mergedArray(errorMessages);
              return React.cloneElement(ch, Object.assign({}, ch.props, {errorMessages: flattenErrorMessages}))
            }
            return ch;
          });
      let newProps = {
        children: oldChildren
      };

      newProps.children = newProps.children.length === 1 ? newProps.children[0] : newProps.children;

      return React.cloneElement(child, Object.assign({}, child.props, newProps));

    }
    else {
      let oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
          oldChildren = oldChildren.map(c => searchAndRenderWithErrorElement(c));
          oldChildren = oldChildren.length === 1 ? oldChildren[0] : oldChildren;
      const newProps = {
        children: oldChildren
      };
      return React.cloneElement(child, Object.assign({}, child.props, newProps));
    }
  }

  const newProps = {
    children : searchAndRenderWithErrorElement(elem)
  };
  const result = React.cloneElement(elem, Object.assign({}, elem.props, newProps));
  return result;
}

function recurseAndValidate(elem, ReactComponent){
  function searchAndUpdate(child){
    const { hasPropsValue, valueIndexes } = childHasPropsValue(child);
    const { isHtmlInputElement, inputElementIndexes } = childIsHtmlInputElement(child);
    if (isLastChild(child)) {
      // last child, and cannot find value nor type === 'input'
      return child;
    }
    else if(childIsString(child)){
      return child.props.children;
    }

    else if (hasPropsValue || isHtmlInputElement) {
      const indexes = valueIndexes || inputElementIndexes;
      const oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
      const inputElements = indexes.map(index => getInputElement(child.props.children, index));
      let newChildren = oldChildren.map((ch, chIdx) => {
        if(ch.type === 'input' || (ch.hasOwnProperty('props') && ch.props.hasOwnProperty('value'))){
          let value = ch.props.value;
          let validators = ch.props['data-validators'];
          let errorMessages = validators ? validators.map(validator => validator(value)) : [];
          errorMessages = Array.from(new Set(errorMessages));

          return updateInputWithErrorMessages(ch, errorMessages, ReactComponent, child);
        }
        return ch;
      });


      const newProps = {
        children: newChildren.length === 1 ? newChildren[0] : newChildren
      };
      return React.cloneElement(child, Object.assign({}, child.props, newProps));

    } else {
      let oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
      oldChildren = oldChildren.map(c => searchAndUpdate(c));
      oldChildren = oldChildren.length === 1 ? oldChildren[0] : oldChildren;
      const newProps = {
        children: oldChildren
      };
      return React.cloneElement(child, Object.assign({}, child.props, newProps));
    }
  }



  // initiate
  // let oldChildren = Array.isArray(elem.props.children) ? elem.props.children : [elem.props.children];
  // const newProps = {
  //   children : oldChildren.map((oldchild, index) => searchAndUpdate(oldchild))
  // };
  const newProps = {
    children : searchAndUpdate(elem)
  };

  const result = React.cloneElement(elem, Object.assign({}, elem.props, newProps));
  return result;
}

export function recurseAndInit(elem, ObjectRefs, ReactComponent, errorElement){
  // ObjectRefs is global
  function searchAndInit(child, index, searchFormPath){
    const { hasPropsValue, valueIndexes } = childHasPropsValue(child);
    const { isHtmlInputElement, inputElementIndexes } = childIsHtmlInputElement(child);
    if (isLastChild(child)) {
      // last child, and cannot find value nor type === 'input'
      return child;
    }
    else if(childIsString(child)){
      return child.props.children;
    }

    else if (hasPropsValue || isHtmlInputElement) {
      let newPath =  index ? searchFormPath += `.props.children.${index}` : searchFormPath;
      const indexes = valueIndexes || inputElementIndexes;
      const inputElements = indexes.map(index => getInputElement(child.props.children, index));
      const oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
      const ErrorMessageElement = errorElement || ErrorElement;
      // updateObjectRefs here
      let newChildren = oldChildren.map((ch, chIndex) => {
        if(ch.type === 'input') return updateInputWithRef(ch, newPath+`.props.children.${chIndex}`, ObjectRefs, ReactComponent, child);
        if(ch.hasOwnProperty('props') && ch.props.hasOwnProperty('value')) return updateInputWithRef(ch, newPath+`.props.children.${chIndex}`, ObjectRefs, ReactComponent, child);
        return ch;
      });
          newChildren.push(<ErrorMessageElement key={'errorMessages' + searchFormPath}/>);
      const newProps = {
        children: newChildren.length === 1 ? newChildren[0] : newChildren
      };
      return React.cloneElement(child, Object.assign({}, child.props, newProps));
    } else {
      let newPath =  index ? searchFormPath += `.${index}` : searchFormPath;
      let oldChildren = Array.isArray(child.props.children) ? child.props.children : [child.props.children];
          oldChildren = oldChildren.map((c,index) => searchAndInit(c, index, newPath));
          oldChildren = oldChildren.length === 1 ? oldChildren[0] : oldChildren;
      const newProps = {
        children: oldChildren
      };
      return React.cloneElement(child, Object.assign({}, child.props, newProps));
    }
  }

  //initiate
  let formPath = 'form.props.children';

  if(Array.isArray(elem)){
    return elem.map((el, elIndex) => {
      const newPath = formPath + `.${elIndex}`;
      const newProps = {
        key: `${newPath}`,
        children : searchAndInit(elem, null, newPath)
      };
      return React.cloneElement(el, Object.assign({}, el.props, newProps));
    })
  }

  const newProps = {
    children : searchAndInit(elem, null, formPath)
  };
  const result = React.cloneElement(elem, Object.assign({}, elem.props, newProps));
  return result;
}



