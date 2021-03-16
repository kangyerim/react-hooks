import { useEffect, useRef, useState } from 'react';
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

const useTitle = (initTitle) => {
  const [ title, setTitle ] = useState(initTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector('title');
    htmlTitle.innerText = title;
  }
  useEffect(updateTitle,  [title])
  return setTitle;
}

const useClick = onClick => {
  const element = useRef();
  useEffect(()=> {
    /* 
        useEffect안에 함수를 선언하게 되면 componentDidMount, componentDidUpdate 때 실행 
        [] <- 디펜던시가 없을 땐, componentDidMount 일 때만 호출
    */
    if(element.current) {
      element.current.addEventListener("click", onClick);
    }

    /* return을 사용하게 되면 compoenntWillUnMount때 실행됨 */
    return () => {
      if(element.current) {
        element.current.removeEventListener("click", onClick);
      }
    }
  }, [])

  return element;
}

const useConfirm = (message = "", onConfirm, onCancel) => {
  if(!onConfirm || typeof onConfirm !== 'function') {
    return ;
  }
  if(onCancel && typeof onCancel !== 'function') {
    return ;
  }

  const confirmAction = () => {
    if(window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  }

  return confirmAction;
}

const usePreventLeave = () => {
  const listner = event => {
    event.preventDefalut();
    event.returnValue = "";
  }
  const enablePrevent = () => window.addEventListener("beforeunload", listner);
  const disablePrevent = () => window.removeEventListener("beforeunload", listner);

  return { enablePrevent, disablePrevent }
}

const App = () => {
  const maxLeng = value => value.length <= 10;
  const name = useInput("이름", maxLeng);

  const { currentItem, changeItem } = useTabs(0, contents);

  const sayHello = () => console.log('component is mounted! : useEffect');
  useEffect(sayHello, []);
  
  // const titleUpdater = useTitle("is Loading...")
  const title = useClick(sayHello)

  const deleteSure = () => console.log("삭제중...");
  const abort = () => console.log('!!! 취소 !!!');
  const confirmDelete = useConfirm("삭제하시겠습니까?", deleteSure, abort)

  const { enablePrevent, disablePrevent } = usePreventLeave();

  return (
    <div className="App">
      <h1 ref={title}>Hello React</h1>
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
      <br />
      <button onClick={ confirmDelete }>삭제</button>
      <br />
      <br />
      <button onClick={ enablePrevent }>보호</button>
      <button onClick={ disablePrevent }>무시</button>
    
    </div >
  );
}

export default App;
