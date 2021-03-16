import { useState } from 'react';

export const useInput = (initVal, validater) => {
  const [value, setValue] = useState(initVal)
  const onChange = event => {
    /* const value = event.target.value; */
    const { target: { value } } = event;

    let willUpate = true;
    if (typeof validater === "function") {
      willUpate = validater(value);
    }
    if (willUpate) {
      setValue(value)
    }
  }
  return { value, onChange }
}