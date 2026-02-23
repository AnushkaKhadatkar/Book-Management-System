import { useNavigate, useParams } from "react-router-dom";

const DeleteBook = ({ API_URL }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await fetch(API_URL + "/" + id, {
      method: "DELETE"
    });

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Delete Book</h2>
        <p>Are you sure?</p>
        <button onClick={handleDelete}>Confirm Delete</button>
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;