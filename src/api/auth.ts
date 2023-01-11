import { app } from "./firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  User,
  signInWithPopup,
  AuthProvider,
} from "firebase/auth";

import { useState, useEffect } from "react";

type authStateType = {
  isSignedIn: boolean;
  pending: boolean;
  user: User | null;
};

export function useAuthState() {
  const [authState, setAuthState] = useState<authStateType>({
    isSignedIn: false,
    pending: true,
    user: null,
  });

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) =>
      setAuthState({ user, pending: false, isSignedIn: !!user })
    );
    return () => unregisterAuthObserver();
  }, []);

  return { auth, ...authState };
}

const auth = getAuth(app);

export function getCurrentUser() {
  if (auth.currentUser !== null) {
    return null;
  } else {
    return auth.currentUser!.email;
  }
}

const oAuthProviders = {
  google: new GoogleAuthProvider(),
  twitter: new TwitterAuthProvider(),
  github: new GithubAuthProvider(),
};

export function signInWithEmail(email: string, password: string) {
  setPersistence(auth, browserLocalPersistence);
  console.log(email);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.email);
      user.getIdToken().then((token) => {});
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

export function signInWithOAuthName(providerName: string) {
  switch (providerName) {
    case "google":
      signInWithGoogle();
      break;
    case "github":
      signInWithGithub();
      break;
    case "twitter":
      signInWithTwitter();
  }
}

export function signInWithGoogle() {
  signInWithOAuth(oAuthProviders.google);
}

export function signInWithTwitter() {
  signInWithOAuth(oAuthProviders.twitter);
}

export function signInWithGithub() {
  signInWithOAuth(oAuthProviders.github);
}

export function signInWithOAuth(oAuthProvider: AuthProvider) {
  signInWithPopup(auth, oAuthProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential!.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export function createUserWithEmail(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorMessage);
    });
}
