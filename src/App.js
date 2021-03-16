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
      setValue(value);
    }
  }
  return { value, onChange }
}

const contents = [
  { id:1, tab: "section1", content: "content 111"},
  { id:2, tab: "section2", content: "content 222"}
]

const useTabs  = (initTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initTab);
  if(!allTabs || !Array.isArray(allTabs)) {
    return;
  }
  return { currentItem : allTabs[currentIndex], changeItem: setCurrentIndex }
}

const App = () => {
  const maxLeng = value => value.length <= 10;
  const name = useInput("이름", maxLeng);

  const { currentItem, changeItem } = useTabs(0, contents);
  return (
    <div className="App">
      <h1>Hello React</h1>
      <input value={name.value} onChange={name.onChange} placeholder="Name" /> <br />
      <input {...name} placeholder="Name" />
      <br />
      <br />
      {contents.map((section, index) => (
        <button onClick={() => changeItem(index)} key={ section.id }>{section.tab}</button>
      ))}
      <div>
        {currentItem.content}
      </div>
    </div >
  );
}

export default App;
