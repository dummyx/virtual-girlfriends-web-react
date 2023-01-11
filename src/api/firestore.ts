import { app } from "./firebase";
import {
  getFirestore,
  addDoc,
  doc,
  setDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

export const db = getFirestore(app);

export function createUserDocument(userId: string, nickname: string) {
  const userRef = doc(db, "User", userId);
  const data = {
    registerDate: Timestamp.now(),
    lastLoginDate: Timestamp.now(),

    nickname: nickname,

    models: {},
  };
  setDoc(userRef, data);
}

export function getModels() {}
