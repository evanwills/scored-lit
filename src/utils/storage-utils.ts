import { isNum } from './general-utils';

const getRightType = (input : string, type: string, defaultVal: any) : any => {
  const types = type.toLowerCase().split('|');

  if (input === 'null') {
    return null;
  }
  let _input : any = null;

  for (let a = 0; a < types.length; a += 1) {
    switch (types[a]) {
      case 'int':
        _input = parseInt(input, 10);

        return (isNum(_input))
          ? _input
          : defaultVal;

      case 'float':
      case 'num':
      case 'number':
        _input = parseFloat(input);

        return (isNum(_input))
          ? _input
          : defaultVal;

      case 'bool':
      case 'boolean':
        _input = input.trim().toLowerCase();
        return (_input === '1' || _input === 'true' || _input === 'yes');

      case 'object':
        try {
          return JSON.parse(input);
        } catch (_e) {
          return defaultVal;
        }

      case 'null':
        return null;

      case 'string':
        return input;
    }
  }

  return defaultVal;
};

export const _setLocalValue = (key : string, value : any) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const _getLocalValue = (key : string, defaultVal : any, type : string = '') : any => {
  const output = localStorage.getItem(key);

  if (output !== null) {
    return getRightType(output, type, defaultVal);
  }

  _setLocalValue(key, defaultVal);

  return defaultVal;
};

export const getLocalValue = (typeof localStorage !== 'undefined')
  ? _getLocalValue
  : (_key : string, defaultVal : any, _type : string = '') => defaultVal;

export const setLocalValue = (typeof localStorage !== 'undefined')
  ? _setLocalValue
  : (_key : string, _value : any) => {};
