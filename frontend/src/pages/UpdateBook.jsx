import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = ({ onBookUpdated }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/books/${id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setAuthor(data.author);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8000/books/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    });

    onBookUpdated();
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Update Book</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;