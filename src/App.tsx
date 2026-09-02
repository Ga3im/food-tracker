import { Provider } from "react-redux";
import store from "./store";
import { Main } from "./components/Main/Main";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
