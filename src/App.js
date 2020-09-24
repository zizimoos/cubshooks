import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Axios from "axios";

const context = [
  {
    tab: "section 0 ",
    content: "I'm in the content in section 0",
  },
  { tab: "section 1 ", content: "I'm in the content in section 1" },
];

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;
const Title = styled.div`
  padding-top: 50px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Number = styled.div`
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ButtonArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const useInput = (defaulValue, validator) => {
  const [value, setValue] = useState(defaulValue);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    let willUpdate = true;
    if (typeof validator === "function") {
      willUpdate = validator(value);
    }
    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};

const useFetch = (url) => {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const callUrl = async () => {
    try {
      const { data } = await Axios.get(url);
      // throw Error();
      setPayload(data);
    } catch {
      setError("ERROR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callUrl();
  });

  return { payload, error, loading };
};

const useTabs = (initialTab, allTabs) => {
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  if (!allTabs || !Array.isArray(allTabs)) {
    return;
  }
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex,
  };
};

const useTitle = (initialTitle) => {
  const [title, setTitle] = useState(initialTitle);
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerText = title;
  };
  useEffect(updateTitle, [title]);
  return setTitle;
};

const useClick = (onClick) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      element.current.addEventListener("click", onClick);
    }
    return () => {
      if (element.current) {
        element.current.removeEventListener("click", onClick);
      }
    };
  }, [onClick]);
  if (typeof onClick !== "function") {
    return;
  }
  return element;
};

const useConfirm = (message = "", onConfirm, onCancel) => {
  if (!onConfirm || typeof onConfirm !== "function") {
    return;
  }
  if (!onCancel || typeof onCancel !== "function") {
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
  const listener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () => window.addEventListener("beforeunload", listener);
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", listener);

  return { enablePrevent, disablePrevent };
};

const useBeforeLeave = (onBefore) => {
  const handle = (event) => {
    const { clientY } = event;
    if (clientY <= 0) {
      onBefore();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);

  if (!onBefore || typeof onBefore !== "function") {
    return;
  }
};

const useFadeIn = (duration = 1, delay = 0) => {
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  }, []);
  if (typeof duration !== "number") {
    return;
  }
  return { ref: element, style: { opacity: 0 } };
  // return element;
};

const useNetwork = (onChange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === "function") {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);
  return status;
};

function App() {
  const [count, setCount] = useState(0);
  const maxLength = (value) => value.length < 10;
  const name = useInput("", maxLength);
  const { payload, loading, error } = useFetch("https://aws.random.cat/meow");
  const { currentItem, changeItem } = useTabs(1, context);
  const titleUpdator = useTitle("loading....");
  setTimeout(() => titleUpdator("Home"), 5000);
  const potato = useRef();
  setTimeout(() => potato.current?.focus(), 5000);
  const sayHello = () => console.log("say Hello");
  const title = useClick(sayHello);
  const deleteWordConfirm = () => {
    console.log("deleteWordConfirm");
  };
  const abort = () => {
    console.log("aborted");
  };
  const confirmDelete = useConfirm("are you sure", deleteWordConfirm, abort);
  const { enablePrevent, disablePrevent } = usePreventLeave();
  const begForLife = () => console.log(" please don't leave");
  useBeforeLeave(begForLife);

  const fadeInH1 = useFadeIn(4);
  const fadeInP1 = useFadeIn(8, 4);

  const handleNetworkChange = (online) => {
    console.log(online ? "we just went online" : "we are offline");
  };
  const onLine = useNetwork(handleNetworkChange);

  return (
    <Container className="App">
      <Body className="App-header">
        <Title>Hooks calculator</Title>
        <Number>{count}</Number>
        <button onClick={() => setCount(count + 1)}>increase</button>
        <button onClick={() => setCount(count - 1)}>decrease</button>
        <br />
        <input
          // value={name.value}
          // onChange={name.onChange}
          {...name}
          placeholder="HOOKS useInput"
        ></input>
        <br />
        {/* https://aws.random.cat/meow */}
        {loading && <span>Loading your cats.....</span>}
        {!loading && error && <span>{error}</span>}
        {!loading && payload && (
          <img src={payload.file} height="100" alt="cats"></img>
        )}
        <br />
        <ButtonArea>
          {context.map((sec, index) => (
            <button onClick={() => changeItem(index)}>{sec.tab}</button>
          ))}
        </ButtonArea>
        <br />
        <div>{currentItem.content}</div>
        <br />
        <div>
          <input ref={potato} placeholder="potato"></input>
        </div>
        <br />
        <div>
          <h1 ref={title}>COME ON CLICK ME</h1>
        </div>
        <br />
        <div>
          <button onClick={confirmDelete}>delete somethig</button>
        </div>
        <br />
        <div>
          <button onClick={enablePrevent}>protect</button>
          <button onClick={disablePrevent}>unprotect</button>
        </div>
        <br />
        <div>
          <h1> Mouse Leave </h1>
        </div>
        <br />
        <div>
          <h1 {...fadeInH1}> FadeIn </h1>
        </div>
        <br />
        <div>
          <p {...fadeInP1}>
            lorem The ref value 'element.current' will likely have changed by
            the time this effect cleanup function runs. If this ref points to a
            node rendered by React, copy 'element.current' to a variable inside
            the effect, and use that variable in the cleanup function
            react-hooks/exhaustive-deps Line 161:6: React Hook useEffect has a
            missing dependency: 'handle'. Either include it or remove the
            dependency array react-hooks/exhaustive-deps Line 176:6: React Hook
            useEffect has a missing dependency: 'duration'. Either include it or
            remove the dependency array
          </p>
        </div>
        <br />
        <div>
          <h1> {onLine ? "onLine" : "offLine"} </h1>
        </div>
      </Body>
    </Container>
  );
}

export default App;
