import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import "./LoginPage.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

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
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password,
      );
      console.log(res.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
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
                  Pick apart the Internet's opinions.
                </p>
              </div>

              <div className="d-grid gap-3 mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
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
      <Modal
        show={modalShow !== null}
        onHide={handleClose}
        animation={false}
        centered
      >
        <Modal.Body>
          <h2 className="mb-4" style={{ fontWeight: "bold" }}>
            {modalShow === "SignUp"
              ? "Create your account"
              : "Log in to your account"}
          </h2>
          <Form
            className="d-grid gap-2 px-5"
            onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
          >
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <p style={{ fontSize: "12px" }}>
              {modalShow === "SignUp"
                ? `By signing up, you agree to the Terms of Service and Privacy
                    Policy, including Cookie Use. Chong's Bookings may use your
                    contact information, including your email address and phone
                    number for purposes outlined in our Privacy Policy, like
                    keeping your account seceure and personalising our services,
                    including ads.`
                : `Forgot your login details?`}
            </p>
            <Button className="rounded-pill" type="submit">
              {modalShow === "SignUp" ? "Sign up" : "Log in"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LoginPage;
