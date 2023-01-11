import { app } from "./firebase";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  uploadString,
} from "firebase/storage";

export const storage = getStorage(app);

export function uploadFile(
  file: File,
  uid: string,
  callback: CallableFunction
) {
  const userRoot = `models/${uid}/`;
  const listFile = "userData.json";

  const rootRef = ref(storage, userRoot);
  const fileRef = ref(storage, userRoot + file.name);

  function updateList() {
    type fileListType = {
      items: Array<string>;
    };
    var fileListObj: fileListType = {
      items: [],
    };
    listAll(rootRef).then((result) => {
      result.items.forEach((itemRef) => {
        if (itemRef.name != listFile) {
          fileListObj.items.push(itemRef.name);
        }
      });

      const listFileRef = ref(storage, userRoot + listFile);
      uploadString(listFileRef, JSON.stringify(fileListObj));
    });
  }

  uploadBytes(fileRef, file).then((result) => {
    console.log(result.metadata);
    updateList();

    callback();
  });
}
