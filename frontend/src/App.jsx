import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CreateBook from "./pages/CreateBook";
import UpdateBook from "./pages/UpdateBook";
import DeleteBook from "./pages/DeleteBook";
import Login from "./pages/Login_1";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [books, setBooks] = useState([]);

  const API_URL = "http://localhost:8000/books";

  // Check session on page load
  useEffect(() => {
    fetch(API_URL + "/", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          return null;
        }
        setIsLoggedIn(true);
        return res.json();
      })
      .then(data => {
        if (data) setBooks(data);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const fetchBooks = () => {
    fetch(API_URL + "/", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setBooks(data));
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchBooks();
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include"
    });
    setIsLoggedIn(false);
  };

  return (
    <Routes>

      <Route
        path="/login"
        element={<Login onLogin={handleLoginSuccess} />}
      />

      {isLoggedIn ? (
        <>
          <Route
            path="/"
            element={
              <Home
                books={books}
                onLogout={handleLogout}
                isLoggedIn={true}
              />
            }
          />
          <Route
            path="/create"
            element={<CreateBook onBookAdded={fetchBooks} />}
          />
          <Route
            path="/update/:id"
            element={<UpdateBook onBookUpdated={fetchBooks} />}
          />
          <Route
            path="/delete/:id"
            element={<DeleteBook onBookDeleted={fetchBooks} />}
          />
        </>
      ) : (
        <>
          <Route
            path="/"
            element={
              <Home
                books={[]}
                isLoggedIn={false}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

    </Routes>
  );
}

export default App;