import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";

export default function Testpage() {
  const [newFiles, setNewFiles] = useState(null);
  const newFileRef = useRef(null);

  function handleSubmitFiles(files) {
    setNewFiles(files);
  }

  function clearFileRef() {
    newFileRef.current.value = "";
    setNewFiles(null);
  }

  useEffect(() => {
    console.log(newFiles);
  }, [newFiles]);

  return (
    <>
      <Form.Control
        type="file"
        ref={newFileRef}
        onChange={(e) => handleSubmitFiles(e.target.files)}
        accept="image/png, image/jpeg"
        multiple
      />
      <button onClick={clearFileRef}>Clear Files</button>
    </>
  );
}
