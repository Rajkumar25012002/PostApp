import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import store from "./app/store.jsx";
import { Provider } from "react-redux";
import { getLimitedPost } from "./features/postSlice.jsx";
import { getAllUsers } from "./features/userSlice.jsx";

store.dispatch(getAllUsers());
store.dispatch(getLimitedPost({ postsFetched: 0, postsPerPage: 3 }));
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
