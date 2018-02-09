export const validate = (value, validateFunction) => validateFunction(value);
export const checkType = (_type, value) => {
  //accept emptystring, but reject undefined, null, NaN
  if (value !== '' && !Boolean(value)) {
    return false;
  }

  if (_type.name === 'Array') {
    return (Array.isArray(value));
  } else {
    return (typeof value === (_type.name).toLowerCase());
  }
};

//error messages for validations
const ErrorMessages = {
  required: 'This field is required.',
  notArray: 'This field is required',
  preventScriptTag: 'String is not valid',
  phoneFormat: 'Phone numbers must only contain numbers.',
  nameFormat: 'Name must only contain alphanumeric characters.',
  emailFormat: 'not a valid Email format',
  numberOnly: 'value must be numbers only',
  minLength(length) {
    return `mininum ${length} characters`;
  },
  maxLength(length) {
    return `maximum ${length} characters`;
  },
  minValue(number){
    return `value must be bigger than ${number}`;
  },
  maxValue(number){
    return `value must be smaller than ${number}`;
  },
  type(string) {
    return `this field require a type of ${string.name}`;
  },
  oneOfValue(array) {
    return `this field should be either of ${array.join(' ')}`;
  },
  oneOfType(value, typeList) {
    return `${value} is not one of ${typeList}`;
  },
  lessValueThanField(fieldName1, fieldName2){
    return `${fieldName2} cannot be bigger than ${fieldName1}`;
  },
  moreValueThanField(fieldName1, fieldName2){
    return `${fieldName1} must be bigger than ${fieldName2}`;
  }
};
//This is collections of validations
export const validations = {
  required(value) {
    if (!value || value === null || value === '') {
      return ErrorMessages['required'];
    }
    return true;
  },
  requiredArray(value){
    if (!Array.isArray(value)){
      return ErrorMessages['notArray']
    } else if (value.length === 0) {
      return ErrorMessages['required']
    }
    return true;
  },
  preventScriptTag(value) {
    if (checkType(String, value) && (value.indexOf('<script>') >= 0 || value.indexOf('</script>') >= 0)) {
      return ErrorMessages['preventScriptTag'];
    }
    return true;
  },
  minLength(number) {
    return function minLength(value) {
      value = (typeof value === 'number') ? String(value) : value;
      if (!(checkType(String, value) || checkType(Array, value)) || value.length < number) {
        return ErrorMessages['minLength'](number);
      }
      return true;
    };
  },
  maxLength(number) {
    return function maxLength(value) {
      value = (typeof value === 'number') ? String(value) : value;
      if (!(checkType(String, value) || checkType(Array, value)) || value.length > number) {
        return ErrorMessages['maxLength'](number);
      }
      return true;
    };
  },

  numberOnly(value){
    //allow 0 and empty string,
    if (value === '' || Number(value) === 0) {
      return true;
    } else if ( !Boolean(Number(value)) ){
      return ErrorMessages['numberOnly'];
    }
    return true;
  },
  // options : { helperFunction: [] }
  minValue(number, options){
    const helperFunctions = options && options.helperFunctions;

    return function minValue(value){
      value = executeHelpers(helperFunctions, value);
      const isNumberOrError = validations.numberOnly(value);
      if(isNumberOrError !== true){
        return isNumberOrError;
      } else if(Number(value) < number){
        return ErrorMessages['minValue'](number);
      }
      return true;
    }
  },
  maxValue(number, options){
    const helperFunctions = options && options.helperFunctions;

    return function maxValue(value){
      value = executeHelpers(helperFunctions, value);
      const isNumberOrError = validations.numberOnly(value);
      if(isNumberOrError !== true){
        console.log('number', value);
        return isNumberOrError;
      } else if(Number(value) > number){
        return ErrorMessages['maxValue'](number);
      }
      return true;
    }
  },
  /**
   * @params(value1) int
   * @params(options) obj = { fieldName1:: string , fieldName2:: String, allowBothZeros: Bool }
   * */
  lessValueThanField(value1, options){
    return function lessValueThanField(value2) {
      const isNumber1OrError = validations.numberOnly(value1);
      if (isNumber1OrError !== true) return isNumber1OrError;
      const isNumber2OrError = validations.numberOnly(value2);
      if(isNumber2OrError !== true){
        return isNumber2OrError;
      } else if (options.allowBothZeros && Number(value1) === 0 && Number(value2) === 0){
        return true;
      } else if (Number(value2) > Number(value1)){
        return ErrorMessages['lessValueThanField'](options.fieldName1, options.fieldName2);
      }
      return true;
    }
  },
  /**
   * @params(value1) int
   * @params(options) obj = { fieldName1:: string , fieldName2:: String, allowBothZeros: Bool }
   * */
  moreValueThanField(value1, options){
    return function lessValueThanField(value2) {
      const isNumber1OrError = validations.numberOnly(value1);
      if (isNumber1OrError !== true) return isNumber1OrError;
      const isNumber2OrError = validations.numberOnly(value2);
      if (isNumber2OrError !== true){
        return isNumber2OrError;
      } else if (options.allowBothZeros && Number(value1) === 0 && Number(value2) === 0){
        return true;
      } else if (Number(value2) <= Number(value1)){
        return ErrorMessages['moreValueThanField'](options.fieldName1, options.fieldName2);
      }
      return true;
    }
  },
  type(_type) {
    return function type(value) {
      if (String(_type).toLowerCase() === 'object' || String(_type).toLowerCase() === 'array') {
        if (!(value instanceof _type)) {
          return ErrorMessages['type'](_type);
        }
      } else {
        return (typeof value == String(_type.name).toLowerCase()) ? true : ErrorMessages['type'](_type);
      }
    };
  },
  emailFormat(email) {
    const emailRegex = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    return (checkType(String, email) && emailRegex.test(email)) ? true :  ErrorMessages['emailFormat'];
  },
  phoneFormat(phone) {
    const phoneRegex = /[0-9\- ]/;
    return (checkType(String, phone) && phoneRegex.test(phone)) ? true : ErrorMessages['phoneFormat'] ;
  },
  nameFormat(name) {
    const nameRegex = /[a-zA-Z0-9 ']/;
    return (checkType(String, name) && nameRegex.test(name)) ? true : ErrorMessages['nameFormat'] ;
  },
  oneOfValue(array) {
    return function oneOfValue(value) {
      if (array.indexOf(value) < 0) {
        return ErrorMessages['oneOfValue'](array);
      }
      return true;
    };
  },
  oneOfType(array) {
    return function oneOfType(value) {
      const typeList = array.map(t => t.name).join(', ');
      let errorMessage;
      for (let i = 0; i < array.length; i++) {
        if (!(value instanceof array[i])) {
          errorMessage += ErrorMessages['oneOfType'](value, typeList);
          break;
        }
      }
      return errorMessage.length > 0 ? errorMessage : true;
    };
  }

};


// helper
const executeHelpers = (helperFunctions, value) => {
  console.log('EXECUTE HELPERS >>> ', helperFunctions);
  let tempvalue = value;
  if(helperFunctions) {
    //check if array,
    if(helperFunctions instanceof Array){
      helperFunctions.forEach(func => {
        tempvalue = func(tempvalue);
      });
    }
    else {
      tempvalue = helperFunctions(tempvalue);
    }
  }
  return tempvalue;
};
