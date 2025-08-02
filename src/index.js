import React from "react";
import ReactDOM from "react-dom/client";
import StarRating from "./StarRating.js";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} color={'#fcc419'} size={48} />
    <StarRating maxRating={5} size={24} color={'red'}message={['Okay','Better','Good','Amazing','Owsome']}/>
    */}
  </React.StrictMode>
);
