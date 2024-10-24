// src/App.tsx
import React from "react";
import "./App.css";
import HtmlEditor from "./HtmlEditor";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>HtmlAlchemy 에디터</h1>
      <HtmlEditor />
    </div>
  );
};

export default App;
