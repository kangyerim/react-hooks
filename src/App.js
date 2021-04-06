import { useEffect, useRef, useState } from 'react';
import './App.css';

const useInput = (initVal, validater) => {
  const [value, setValue] = useState(initVal);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    let willUpate = true;
    if (typeof validater === 'function') {
      willUpate = validater(value);
    }
    if (willUpate) {
      setValue(value);
    }
  };
  return { value, onChange };
};

const contents = [
  { id: 1, tab: 'section1', content: 'content 111' },
  { id: 2, tab: 'section2', content: 'content 222' },
];

const useTabs = (initTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initTab);
  if (!allTabs || !Array.isArray(allTabs)) {
    return;
  }
  return { currentItem: allTabs[currentIndex], changeItem: setCurrentIndex };
};

const useTitle = (initTitle) => {
  const [title, setTitle] = useState(initTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector('title');
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};

const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    /* 
        useEffect안에 함수를 선언하게 되면 componentDidMount, componentDidUpdate 때 실행 
        [] <- 디펜던시가 없을 땐, componentDidMount 일 때만 호출
    */
    if (element.current) {
      element.current.addEventListener('click', onClick);
    }

    /* return을 사용하게 되면 compoenntWillUnMount때 실행됨 */
    return () => {
      if (element.current) {
        element.current.removeEventListener('click', onClick);
      }
    };
  }, []);

  return element;
};

const useConfirm = (message = '', onConfirm, onCancel) => {
  if (!onConfirm || typeof onConfirm !== 'function') {
    return;
  }
  if (onCancel && typeof onCancel !== 'function') {
    return;
  }

  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };

  return confirmAction;
};

const usePreventLeave = () => {
  const listner = (event) => {
    event.preventDefalut();
    event.returnValue = '';
  };
  const enablePrevent = () => window.addEventListener('beforeunload', listner);
  const disablePrevent = () => window.removeEventListener('beforeunload', listner);

  return { enablePrevent, disablePrevent };
};

const useBeforeLeave = (onBefore) => {
  const handle = (event) => {
    const { clientY } = event;
    if (clientY <= 0) onBefore();
  };
  useEffect(() => {
    if (typeof onBefore !== 'function') {
      return;
    }
    document.addEventListener('mouseleave', handle);
    return () => document.removeEventListener('mouseleave', handle);
  }, []);
};

const useFadeIn = (duration = 1, delay = 0) => {
  const element = useRef();
  useEffect(() => {
    if (typeof duration !== 'number' || typeof delay !== 'number') {
      return;
    }
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  }, []);
  return { ref: element, style: { opacity: 0 } };
};

const useNetwork = (onChange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === 'function') {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener('online', handleChange);
    window.addEventListener('offline', handleChange);
    // window.removeEventListener('online', handleChange);
    // window.removeEventListener('offline', handleChange);
  }, []);
  return status;
};

const App = () => {
  const maxLeng = (value) => value.length <= 10;
  const name = useInput('이름', maxLeng);

  const { currentItem, changeItem } = useTabs(0, contents);

  const sayHello = () => console.log('component is mounted! : useEffect');
  useEffect(sayHello, []);

  // const titleUpdater = useTitle("is Loading...")
  const title = useClick(sayHello);

  const deleteSure = () => console.log('삭제중...');
  const abort = () => console.log('!!! 취소 !!!');
  const confirmDelete = useConfirm('삭제하시겠습니까?', deleteSure, abort);

  const { enablePrevent, disablePrevent } = usePreventLeave();

  const begForLife = () => console.log('please 나가지 마세요');
  useBeforeLeave(begForLife);

  const fadeInH1 = useFadeIn(1, 2);
  const fadeInP = useFadeIn(5, 4);

  const handleNetworkChange = (onLine) => {
    console.log(onLine ? '온라인' : '오프라인');
  };
  const onLine = useNetwork(handleNetworkChange);

  return (
    <div className="App">
      <h1 ref={title}>Hello React</h1>
      <h1 {...fadeInH1} style={{ opacity: 0 }}>
        hi useFadeIn
      </h1>
      <h1>{onLine ? 'Online' : 'OffLine'}</h1>
      <p {...fadeInP}>useFadeIn hook~ animation~~~</p>
      <input value={name.value} onChange={name.onChange} placeholder="Name" /> <br />
      <input {...name} placeholder="Name" />
      <br />
      <br />
      {contents.map((section, index) => (
        <button onClick={() => changeItem(index)} key={section.id}>
          {section.tab}
        </button>
      ))}
      <div>{currentItem.content}</div>
      <br />
      <button onClick={confirmDelete}>삭제</button>
      <br />
      <br />
      <button onClick={enablePrevent}>보호</button>
      <button onClick={disablePrevent}>무시</button>
      <br />
    </div>
  );
};

export default App;
