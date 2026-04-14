import "./LoginPage.css";

function LoginPage() {
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
                  className="btn btn-secondary btn-lg text-white"
                >
                  Sign up with Email
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none text-secondary"
                >
                  Login to your account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
