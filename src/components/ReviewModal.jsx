import { useEffect, useState } from "react";
import { Button, FormControl, Modal, Spinner } from "react-bootstrap";

export default function ReviewModal({ show, onHide }) {
  //input field state
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [game, setGame] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);

  const handleOnHide = () => {
    onHide();
    setName("");
  };

  //clears game if user deletes search query
  useEffect(() => {
    if (!name) {
      setGame(null);
    }
  }, [name]);

  //on user query
  const handleQuery = () => {
    if (game) return;
    console.log("searching...");
    setQueryLoading(true);
    setErrorMessage("");

    fetch(
      `https://corsproxy.io/?https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(name)}&cc=US&l=en`,
    )
      .then((data) => data.json())
      .then((response) => {
        if (response.items[0]) {
          console.log("game found");
          setGame(response.items[0]);
        } else {
          setErrorMessage("Game not found");
        }
      })
      .finally(setQueryLoading(false))
      .catch((error) => console.error(error));
  };
  return (
    <Modal show={show} onHide={handleOnHide} animation={false} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="d-grid gap-2">
        <FormControl
          required
          type="text"
          placeholder="Enter Game Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleQuery} className="rounded-pill btn-secondary">
          Search
        </Button>

        {queryLoading && (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="dark" />
          </div>
        )}
        {errorMessage && <h1>{errorMessage}</h1>}
        {game && (
          <>
            <div className="create-card">
              <div className="review-card text-white">
                <div className="card-header-white">
                  <h1>{game.name}</h1>
                </div>
                <div className="row w-100">
                  <div className="col-sm-7">
                    <img className="w-100" src={game.tiny_image} />
                  </div>
                  <div className="col-sm-1 d-flex align-items-center justify-content-center"></div>
                </div>
                <div className="card-footer-white">
                  <div className="row">
                    <div className="col-8"></div>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleQuery}
              className="w-100 rounded-pill btn-danger"
            >
              Create Review
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
