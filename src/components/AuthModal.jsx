import { Form, Modal, Button } from "react-bootstrap";

export default function AuthModal({
  modalShow,
  handleClose,
  setUsername,
  setPassword,
  handleSignUp,
  handleLogin,
}) {
  return (
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
          <Button className="rounded-pill btn-danger" type="submit">
            {modalShow === "SignUp" ? "Sign up" : "Log in"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
