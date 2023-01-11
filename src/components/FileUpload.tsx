import { useRef, useState } from "react";
import {
  Button,
  Loader,
  Divider,
  Modal,
  Header,
  Icon,
  Label,
  Embed,
} from "semantic-ui-react";

import { uploadFile } from "../api/storage";

import GltfCanvas from "./ModelPreview";

type Props = {
  userId: string;
};

export function UploadComponent({ userId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [uploadState, setUploadState] = useState(false);

  const [open, setOpen] = useState(false);

  function handleFileUpload() {
    setUploadState(true);
    uploadFile(file!, userId, uploadSuccessCallback);
  }

  function uploadSuccessCallback() {
    setUploadState(false);
    setOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let cur = fileRef.current;
    if (cur !== null) {
      const file = cur.files![0];
      console.log(cur);
      setFile(file);
      setFileUrl(e.target.value);
    }
  }

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".vrm"
        onChange={handleChange}
        style={{ display: "none" }}
      ></input>

      <Divider />

      <Button
        onClick={() => {
          fileRef.current!.click();
        }}
        content="Select File"
      />
      <Label
        size="large"
        content={
          file == null ? "No file is selected" : file.name + " is selected"
        }
      />
      <Button onClick={handleFileUpload} content="Upload" />
      <Loader active={uploadState} inline />
      <Divider />
      {file == null ? (
        <Label size="massive">Select a file to preview</Label>
      ) : (
        <Embed>
          <GltfCanvas file={file} />
        </Embed>
      )}
      <Modal
        basic
        size="small"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Header icon>
          <Icon name="check" />
          Success!
        </Header>
        <Modal.Actions>
          <Button color="green" inverted onClick={() => setOpen(false)}>
            <Icon name="checkmark" /> OK
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

const useLess = useState;
