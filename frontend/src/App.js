import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import Contact from "./components/Contact";
import About from "./components/About";
import Posts from "./components/Posts"; // Make sure imported

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/posts" element={<Posts />} /> {/* <-- For Posts */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
