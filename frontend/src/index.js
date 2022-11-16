import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import "./css/index.css"
import HomeAuth from './home_auth.js';
import Login from "./log_in.js";
import PlaylistGenerated from './playlist_generated.js';
import PlaylistGenerator from './playlist_generator.js';

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/home" element={<HomeAuth/>} />
      <Route path="/playlist/:id" element={<PlaylistGenerated/>} />
      <Route path="/generator" element={<PlaylistGenerator/>} />
    </Routes>
  </BrowserRouter>,
  rootElement
);