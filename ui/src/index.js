import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./data/store";

import { ThemeProvider, CSSReset, DarkMode } from "@chakra-ui/core";

import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <DarkMode>
        <CSSReset />
        <App />
      </DarkMode>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
