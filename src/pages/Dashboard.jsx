import { getAuth } from "firebase/auth";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { Container } from "react-bootstrap";
import "./Dashboard.css";
import { reviews } from "../components/testReviews";

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  //const reviews = [];
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

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
  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <>
      <div className="dashboard min-vh-100">
        <div className="container h-100 d-flex flex-column align-items-center justify-content-center ">
          <button
            className="logout-button align-self-end btn btn-warning"
            onClick={handleLogout}
          >
            Logout
          </button>
          <div className="create-card">
            <h1>
              <strong>CherryPick</strong>
            </h1>
            <p>
              Use our chatbot AI to give you a baseline review to work with.
            </p>
            <button
              onClick={() => alert("button")}
              className="btn btn-danger rounded-pill"
            >
              Create a New Review
            </button>
          </div>
          <div className="create-card">
            <h1 className="card-header pb-2">
              <strong>Your Reviews</strong>
            </h1>
            {reviews[0] &&
              reviews.map((review, index) => (
                <div key={index} className="review-card text-white">
                  <div className="card-header-white">
                    <h1>{reviews[0].name}</h1>
                  </div>
                  <div className="row w-100">
                    <div className="col-sm-3">
                      <img className="w-100" src={review.thumbnail} />
                    </div>
                    <div className="col-sm-8">{review.content}</div>
                    <div className="col-sm-1 d-flex align-items-center justify-content-center">
                      <button className="btn btn-danger m-1">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-danger">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-footer-white">
                    <div className="row">
                      <div className="col-8">
                        <small>{review.created_at}</small>
                      </div>
                      <div className="col-4">
                        {generateIcons(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
