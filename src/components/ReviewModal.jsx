import { useEffect, useRef, useState } from "react";
import {
  Button,
  FormCheck,
  FormControl,
  Modal,
  Spinner,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  URL,
  createReview,
  updateReview,
} from "../features/reviews/reviewSlice";

export default function ReviewModal({ show, onHide, editId }) {
  //redux
  const dispatch = useDispatch();
  //input field state
  const [modalSize, setModalSize] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [game, setGame] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [createForm, setCreateForm] = useState(false);
  const [fetchingGenAi, setFetchingGenAi] = useState(false);

  //input field state after game is set
  const [newContent, setNewContent] = useState("");
  const [newPlaytime, setNewPlaytime] = useState("");
  const [newRating, setNewRating] = useState("");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [error, setError] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setNewFile(null);
    }
  };
  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleOnHide = () => {
    onHide();
    setName("");
    setGame(null);
    setQueryLoading(false);
    setErrorMessage("");
    setCreateForm(false);
    setModalSize("");
    setNewContent("");
    setNewPlaytime("");
    setNewRating("");
    setNewFile(null);
    setError("");
  };

  //clears game if user deletes search query
  useEffect(() => {
    if (!name) {
      setGame(null);
    }
  }, [name]);

  //on user query
  const handleQuery = () => {
    if (!name) {
      setErrorMessage("Please enter a game");
      return;
    }
    setQueryLoading(true);
    console.log("searching...");
    setErrorMessage("");

    const url = `https://corsproxy.io/?key=df1c523e&url=${encodeURIComponent(`https://store.steampowered.com/api/storesearch/?term=${name}&cc=US&l=en`)}`;
    fetch(url)
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

  //when user presses 'Create Review' in GameFinder Modal
  const handleCreateForm = async (gameName) => {
    if (!game) return;
    setModalSize("lg");
    setFetchingGenAi(true);

    try {
      const data = await fetch(`${URL}/generate/review/${gameName}`);
      const response = await data.json();
      if (response.review) {
        setNewContent(response.review);
      }
    } catch {
      console.error("Error: ", error.message);
    }
    setFetchingGenAi(false);
    setCreateForm(true);
  };

  const handleCreateReview = () => {
    if (newFile && !newFile.type.includes("image")) {
      setError("Please upload an image");
      return;
    }

    dispatch(
      createReview({
        name: game.name,
        content: newContent,
        playtime: newPlaytime,
        rating: newRating,
        created_at: new Date().toString(),
        thumbnail: game.tiny_image,
        upload: newFile ? newFile : null,
      }),
    );
    handleOnHide();
  };

  //edit modal logic
  const reviews = useSelector((state) => state.reviews.value);
  const [edit, setEdit] = useState({});
  useEffect(() => {
    if (show === "edit") {
      setModalSize("lg");
      const reviewToEdit = reviews.find((review) => review.id === editId);
      if (reviewToEdit) {
        setEdit(reviewToEdit);
        setNewContent(reviewToEdit.content);
        setNewThumbnail(reviewToEdit.thumbnail);
        setNewPlaytime(reviewToEdit.playtime);
        setNewRating(reviewToEdit.rating);
      }
    }
  }, [show, reviews, editId]);

  const handleEditReview = () => {
    dispatch(
      updateReview({
        thumbnail: newThumbnail,
        content: newContent,
        playtime: newPlaytime,
        rating: newRating,
        id: editId,
        upload: newFile ? newFile : null,
      }),
    );
    handleOnHide();
  };

  return (
    <Modal
      size={modalSize}
      show={show !== null}
      onHide={handleOnHide}
      animation={false}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="d-grid gap-2">
        {!fetchingGenAi && !createForm && show === "create" && (
          <>
            <FormControl
              required
              type="text"
              placeholder="Enter Game Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={handleQuery}
              className="rounded-pill btn-secondary"
            >
              Search
            </Button>

            {queryLoading && (
              <div className="w-100 d-flex align-items-center justify-content-center">
                <Spinner animation="border" variant="danger" />
              </div>
            )}
            {errorMessage && <small>{errorMessage}</small>}
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
                  onClick={() => handleCreateForm(game.name)}
                  className="w-100 rounded-pill btn-danger"
                >
                  Create Review
                </Button>
              </>
            )}
          </>
        )}
        {fetchingGenAi && (
          <div className="w-100 d-flex align-items-center justify-content-center">
            <Spinner animation="border" variant="danger" role="status" />
          </div>
        )}
        {!fetchingGenAi && createForm && (
          <>
            <div className="review-card text-white">
              <div className="card-header-white">
                <h1>
                  <strong>{game.name}</strong>
                </h1>
              </div>
              <div className="row w-100">
                <div className="col-sm-11">
                  <FormControl
                    required
                    type="text"
                    as="textarea"
                    rows="10"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter your review here"
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center justify-content-center">
                  <button
                    onClick={handleCreateReview}
                    className="btn btn-danger"
                  >
                    <i class="bi bi-check-square-fill"></i>
                  </button>
                </div>
              </div>
              <div className="card-footer-white pt-3">
                <div className="row">
                  <div className="col-6">
                    <FormControl
                      required
                      type="number"
                      placeholder="Enter your playtime"
                      value={newPlaytime}
                      onChange={(e) => setNewPlaytime(e.target.value)}
                    />
                  </div>
                  <div className="col-6 align-self-center justify-self-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FormCheck
                        required
                        inline
                        key={num}
                        type="radio"
                        label={num.toString()}
                        name="rating"
                        value={num}
                        checked={newRating === num}
                        onChange={(e) => setNewRating(parseInt(e.target.value))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <label className="my-1">{"Upload an image (optional)"}</label>
              <div className="row w-100">
                <div className="col-11">
                  <FormControl
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-1">
                  <button
                    className="btn btn-danger"
                    onClick={handleResetFileInput}
                  >
                    <i className="bi bi-x-square-fill"></i>
                  </button>
                </div>
              </div>

              <small>{error && error}</small>
            </div>
          </>
        )}
        {show === "edit" && (
          <>
            <div className="review-card text-white">
              <div className="card-header-white">
                <h1>{edit.name}</h1>
              </div>
              <div className="row w-100">
                <div className="col-sm-11">
                  <FormControl
                    required
                    type="text"
                    as="textarea"
                    rows="6"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Enter your review here"
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center justify-content-center">
                  <button onClick={handleEditReview} className="btn btn-danger">
                    <i class="bi bi-check-square-fill"></i>
                  </button>
                </div>
              </div>
              <div className="card-footer-white pt-3">
                <div className="row">
                  <div className="col-6">
                    <FormControl
                      required
                      type="number"
                      placeholder="Enter your playtime"
                      value={newPlaytime}
                      onChange={(e) => setNewPlaytime(e.target.value)}
                    />
                  </div>
                  <div className="col-6 align-self-center justify-self-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <FormCheck
                        required
                        inline
                        key={num}
                        type="radio"
                        label={num.toString()}
                        name="rating"
                        value={num}
                        checked={newRating === num}
                        onChange={(e) => setNewRating(parseInt(e.target.value))}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <label className="my-1">{"Upload an image (optional)"}</label>
              <div className="row w-100">
                <div className="col-11">
                  <FormControl
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <div className="col-1">
                  <button
                    className="btn btn-danger"
                    onClick={handleResetFileInput}
                  >
                    <i className="bi bi-x-square-fill"></i>
                  </button>
                </div>
              </div>

              <small>{error && error}</small>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
