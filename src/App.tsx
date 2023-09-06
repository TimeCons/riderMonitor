// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { HomeScreen } from "./Screen/Home/HomeScreen";
import { NewTravelScreen } from "./Screen/NewTravel/NewTravelScreen";

// Componente Pagina 1
const Page1 = () => <h2>Page 1</h2>;

// Componente Pagina 2
const Page2 = () => <h2>Page 2</h2>;

function App() {
  return (
    <Router>
      <div>
        {/* Inserimento del componente Nav */}
        {/* <Nav /> */}
        {/* Definizione delle rotte */}
        <Routes>
          <Route path="/" Component={HomeScreen} />
          <Route path="/newTravel" Component={NewTravelScreen} />
          <Route path="/page2" Component={Page2} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
