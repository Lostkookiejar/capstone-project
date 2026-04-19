import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import AuthModal from "../components/AuthModal";

function LoginPage() {
  const [modalShow, setModalShow] = useState(null);
  const handleClose = () => setModalShow(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) navigate("/dashboard");
  }, [currentUser, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;

      console.log(user.uid);
      localStorage.setItem("user_id", user.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;

      console.log(user.uid);
      localStorage.setItem("user_id", user.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log(user.uid);
      localStorage.setItem("user_id", user.uid);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-page d-flex align-items-center min-vh-100">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-12 col-lg-9 d-flex justify-content-center align-items-center">
            <div className="login-card p-4 p-md-5 shadow-lg">
              <div className="mb-4">
                <h1 className="display-6 fw-bold mb-2">CherryPick</h1>
                <p className="lead text-muted mb-0">
                  Pick the Internet's tastes apart.
                </p>
              </div>

              <div className="d-grid gap-3 mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={handleGoogleLogin}
                >
                  <i class="bi bi-google"></i> Sign up with Google
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-lg text-white"
                  onClick={() => setModalShow("SignUp")}
                >
                  Sign up with Email
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-secondary"
                  onClick={() => setModalShow("login")}
                >
                  Login to your account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        modalShow={modalShow}
        handleClose={handleClose}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSignUp={handleSignUp}
        handleLogin={handleLogin}
      />
    </div>
  );
}

export default LoginPage;
