import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReview,
  fetchReviewsByUser,
} from "../features/reviews/reviewSlice";
import { Button, Modal, Spinner } from "react-bootstrap";
import ReviewModal from "../components/ReviewModal";

function Dashboard() {
  //firebase authentication
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  //auth check. navigates to login page if invalid auth
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  //logout button function
  const handleLogout = () => {
    auth.signOut();
  };

  //convert rating integer to star icons
  const generateIcons = (count) => {
    const icons = [];
    for (let i = 0; i < count; i++) {
      icons.push(<i key={i} className="bi bi-star-fill"></i>);
    }
    for (let i = count; i < 5; i++) {
      icons.push(<i key={i} className="bi bi-star"></i>);
    }
    return icons;
  };

  //react-redux, global state
  //const reviews = [];
  const reviews = useSelector((state) => state.reviews.value);
  const loading = useSelector((state) => state.reviews.loading);
  const dispatch = useDispatch();

  //fetch reviews by user on page mount
  useEffect(() => {
    const uid = localStorage.getItem("user_id");
    dispatch(fetchReviewsByUser(uid));
  }, [dispatch]);

  //modal visibility
  const [showModal, setShowModal] = useState(null);
  const handleCreateModal = () => setShowModal("create");
  const handleCloseModal = () => setShowModal(null);

  //edit logic
  const [editId, setEditId] = useState(null);
  const handleEditModal = (id) => {
    setShowModal("edit");
    setEditId(id);
  };

  //delete logic
  const handleDeleteReview = (id) => {
    dispatch(deleteReview(id));
  };

  return (
    <div className="dashboard min-vh-100">
      <div className="container h-100 d-flex flex-column align-items-center justify-content-center ">
        <button
          className="logout-button align-self-end btn btn-warning mt-2"
          onClick={handleLogout}
        >
          Logout
        </button>
        <div className="create-card">
          <h1>
            <strong>CherryPick</strong>
          </h1>
          <p>Use our chatbot AI to give you a baseline review to work with.</p>
          <button
            onClick={handleCreateModal}
            className="btn btn-danger rounded-pill"
          >
            Create a New Review
          </button>
        </div>

        <div className="create-card">
          <h1 className="card-header pb-2">
            <strong>Your Reviews</strong>
          </h1>
          {loading && (
            <Spinner
              animation="border"
              className="ms-3 mt-3"
              variant="danger"
            />
          )}
          {!reviews[0] && !loading && (
            <button
              type="button"
              className="btn btn-link text-decoration-none text-secondary"
              onClick={handleCreateModal}
            >
              Create a New Review
            </button>
          )}
          {reviews[0] &&
            reviews.map((review, index) => (
              <div key={index} className="review-card text-white">
                <div className="card-header-white">
                  <h1>
                    <strong>{review.name}</strong>
                  </h1>
                </div>
                <div className="row w-100">
                  <div className="col-sm-3">
                    <img className="w-100" src={review.thumbnail} />
                  </div>
                  <div className="col-sm-8">{review.content}</div>
                  <div className="col-sm-1 d-flex align-items-center justify-content-center">
                    <button
                      onClick={() => handleEditModal(review.id)}
                      className="btn btn-danger m-1"
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="btn btn-danger"
                    >
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="card-footer-white">
                  <div className="row">
                    <div className="col-5">
                      <strong>Created: </strong>
                      <small>
                        {review.created_at?.slice(0, 15) || "Undisclosed date"}
                      </small>
                    </div>
                    <div className="col-5">
                      <strong>Playtime: </strong>
                      <small>{review.playtime} hrs</small>
                    </div>
                    <div className="col-2">{generateIcons(review.rating)}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <ReviewModal show={showModal} onHide={handleCloseModal} editId={editId} />
    </div>
  );
}

export default Dashboard;
