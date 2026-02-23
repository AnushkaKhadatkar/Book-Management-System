import { Link } from "react-router-dom";

const Home = ({ books, onLogout, isLoggedIn }) => {
  return (
    <div className="container">
      
      <div className="header">
        <h1>💖 Book Management System</h1>

        {isLoggedIn ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <>
            <p style={{ color: "red", marginBottom: "10px" }}>
              Login required
            </p>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </>
        )}
      </div>

      <div className="add-btn">
        {isLoggedIn ? (
          <Link to="/create">
            <button>Add Book</button>
          </Link>
        ) : (
          <button disabled>Add Book</button>
        )}
      </div>

      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="card">
              <p><strong>ID:</strong> {book.id}</p>
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>

              {isLoggedIn && (
                <>
                  <Link to={`/update/${book.id}`}>
                    <button>Update</button>
                  </Link>

                  <Link to={`/delete/${book.id}`}>
                    <button>Delete</button>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Home;