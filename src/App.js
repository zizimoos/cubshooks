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
  /* align-items: center; */
  justify-content: center;
  height: 2000px;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
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
    console.log("do you want to sign Out?");
  };
  const enablePrevent = () => window.addEventListener("beforeunload", listener);
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", listener);

  return { enablePrevent, disablePrevent };
};

const useBeforeLeave = (onBefore) => {
  const [state, setState] = useState("");
  const handle = (event) => {
    const { clientY } = event;
    if (clientY <= 0) {
      const word = onBefore();
      setState(word);
    }
  };
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  });

  if (!onBefore || typeof onBefore !== "function") {
    return;
  }
  return state;
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

const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 2,
  });
  const onScroll = (event) => {
    setState({ y: window.scrollY });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  return state;
};

const useFullscreen = () => {
  const element = useRef();
  const triggerFull = () => {
    if (element.current) {
      element.current.requestFullscreen();
    }
  };

  return { element, triggerFull };
};

const useNotification = (title, options) => {
  if (!("Notification" in window)) {
    return;
  }
  const fireNotif = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        } else {
          return;
        }
      });
    } else {
      new Notification(title, options);
    }
  };
  return fireNotif;
};

const useAxios = (opts, axiosInstance = Axios) => {
  const [state, setState] = useState({
    axloading: true,
    axerror: null,
    axdata: null,
    trigger: 0,
  });
  // const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    axiosInstance(opts)
      .then((data) => {
        setState({ ...state, axloading: false, axdata: data });
      })
      .catch((error) => {
        setState({ ...state, axloading: false, axerror: error });
      });
  }, [state.trigger]);

  const refetch = () => {
    setState({
      ...state,
      trigger: new Date().now,
    });
    // setTrigger(new Date().now);
  };

  return { ...state, refetch };
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

  const begForLife = () => {
    return "plz don't leave Stay more";
  };
  const word = useBeforeLeave(begForLife);

  const fadeInH1 = useFadeIn(4);
  const fadeInP1 = useFadeIn(8, 4);

  const handleNetworkChange = (online) => {
    console.log(online ? "we just went online" : "we are offline");
  };
  const onLine = useNetwork(handleNetworkChange);

  const { y } = useScroll();

  const { element, triggerFull } = useFullscreen();

  const triggerNotif = useNotification("wow! what a really precious !", {
    body: "I LOVE YOU",
  });

  const { axloading, axerror, axdata, trigger, refetch } = useAxios({
    url:
      "https://cors-anywhere.herokuapp.com/https://yts.am/api/v2/list_movies.json",
  });
  console.log(axloading, axerror, axdata, trigger);

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
          <img src={payload.file} width="300" height="300" alt="cats"></img>
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
          <h1> Mouse Leave {word}</h1>
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
            the effect
          </p>
        </div>
        <br />
        <div>
          <h1> {onLine ? "onLine" : "offLine"} </h1>
        </div>
        <br />
        <div>
          {/* <h1 style={{ position: "fixed", color: y > 1000 ? "red" : "blue" }}> */}
          <h1 style={{ color: y > 500 ? "red" : "blue" }}>
            Change color by scroll y:{y}
          </h1>
        </div>
        <br />
        <div>
          <img
            ref={element}
            src="https://i.insider.com/5bec30ce48eb126b17599446?width=1100&format=jpeg&auto=webp"
            width="300"
            alt="tessa pic"
          ></img>
        </div>
        <button onClick={triggerFull}>Make FullScreen</button>
        <br />
        <div>
          <button onClick={triggerNotif}>notification</button>
        </div>
        <br />
        <div>
          <h1>{axdata && axdata?.status}</h1>
          <button onClick={refetch}>REFETCH</button>
        </div>
      </Body>
    </Container>
  );
}

export default App;
