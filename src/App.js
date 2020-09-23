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
          <img src={payload.file} width="300" alt="cats"></img>
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
      </Body>
    </Container>
  );
}

export default App;
