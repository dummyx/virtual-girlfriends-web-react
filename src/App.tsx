import * as React from "react";

import {
  useAuthState,
  signInWithEmail,
  signInWithOAuthName,
  createUserWithEmail,
} from "./api/auth";
import {
  Button,
  Grid,
  Segment,
  Form,
  Divider,
  Container,
} from "semantic-ui-react";

import { UploadComponent } from "./components/FileUpload";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

export default function App() {
  return (
    <Container style={{ marginTop: "3em" }}>
      <h1>Virtual Girlfriends</h1>
      <Routes>
        <Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </Container>
  );
}

function LoginPage() {
  const { pending, isSignedIn, user, auth } = useAuthState();

  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);

    let email = formData.get("email") as string;
    let password = formData.get("password") as string;

    signInWithEmail(email, password);
  }

  function handleOAuth(providerName: string) {
    signInWithOAuthName(providerName);
  }
  if (isSignedIn && !pending) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Segment>
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                type="email"
                name="email"
                icon="user"
                label="e-mail"
                placeholder="e-mail"
                iconPosition="left"
              />
              <Form.Input
                type="password"
                placeholder="password"
                name="password"
                icon="lock"
                iconPosition="left"
                label="password"
              />
              <Button type="submit" content="login" primary />
            </Form>
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <Button
              onClick={() => {
                handleOAuth("google");
              }}
              content="Sign in with Google"
              size="big"
              icon="google"
            />
            <Button
              onClick={() => {
                navigate("/signup");
              }}
              content="Sign up"
              icon="signup"
              size="big"
            />
          </Grid.Column>
        </Grid>
        <Divider vertical>Or</Divider>
      </Segment>
    </>
  );
}

function SignUp() {
  const { pending, isSignedIn, user, auth } = useAuthState();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    let formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    createUserWithEmail(email, password);
  }

  if (isSignedIn) {
    return <Navigate to={"/"}></Navigate>;
  }

  return (
    <Grid columns={1} relaxed="very" stackable>
      <Grid.Column>
        <Form onSubmit={handleSubmit}>
          <Form.Input
            type="email"
            name="email"
            icon="user"
            label="e-mail"
            placeholder="e-mail"
            iconPosition="left"
          />
          <Form.Input
            type="password"
            placeholder="password"
            name="password"
            icon="lock"
            iconPosition="left"
            label="password"
          />
          <Button type="submit" content="sign up" primary />
        </Form>
      </Grid.Column>
    </Grid>
  );
}

function MainPage() {
  const { pending, isSignedIn, user, auth } = useAuthState();
  if (pending) {
    return <h1>Checking account...</h1>;
  }

  if (!isSignedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Container style={{ marginTop: "3em" }}>
      <div>
        <h1>Your GiRlFrIeNdS</h1>
        <p>Welcome {user!.displayName}! You are now signed-in!</p>
        <Button onClick={() => auth.signOut()}>Sign-out</Button>
        <div>
          <UploadComponent userId={user!.uid} />
        </div>
      </div>
    </Container>
  );
}
