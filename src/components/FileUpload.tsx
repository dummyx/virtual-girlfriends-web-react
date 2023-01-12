import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Loader,
  Divider,
  Modal,
  Header,
  Icon,
  Label,
  Embed,
  List,
} from "semantic-ui-react";

import { storage, uploadFile } from "../api/storage";
import { ListItem } from "./ListItem";

import GltfCanvas from "./ModelPreview";

type Props = {
  userId: string;
};

type FileItem = {
  url: string;
  name: string;
};

function stripUrl(url: string) {
  return url.substring(url.lastIndexOf("%2F") + 3, url.lastIndexOf("?"));
}

export function UploadComponent({ userId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [uploadState, setUploadState] = useState(false);

  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState<Array<FileItem>>([]);

  useEffect(() => {
    const userRootPath = `models/${userId}/`;
    const userRootRef = ref(storage, userRootPath);
    listAll(userRootRef).then((result) => {
      let fileList: Array<FileItem> = [];
      const count = result.items.length;
      let i = 0;
      result.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (item.name != "userData.json")
            fileList.push({
              url: url,
              name: item.name,
            });
          i++;
          if (i == count) setFileList(fileList);
          console.log(fileList);
        });
      });
    });
  }, []);

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
      setFileUrl(URL.createObjectURL(file));
    }
  }

  function handleFileClick(url: string) {
    setFileUrl(url!);
  }

  return (
    <>
      <>
        <Divider />
        <List divided relaxed>
          {fileList.map((fileItem) => {
            return (
              <ListItem
                fileName={fileItem.name}
                fileUrl={fileItem.url}
                onClick={handleFileClick}
              ></ListItem>
            );
          })}
        </List>
      </>

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
      {fileUrl == null ? (
        <Label size="massive">Select a file to preview</Label>
      ) : (
        <Embed>
          <GltfCanvas fileUrl={fileUrl} fileName={stripUrl(fileUrl)} />
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
