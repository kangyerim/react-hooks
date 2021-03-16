import { useState } from 'react';
import './App.css';


const useInput = (initVal, validater) => {
  const [value, setValue] = useState(initVal)
  const onChange = event => {
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

const App = () => {
  const maxLeng = value => value.length <= 10;
  const name = useInput("이름", maxLeng);

  return (
    <div className="App">
      <h1>Hello React</h1>
      <input value={name.value} onChange={name.onChange} placeholder="Name" /> <br />
      <input {...name} placeholder="Name" />
    </div >
  );
}

export default App;
