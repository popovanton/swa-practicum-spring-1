import React, { lazy } from "react";
import Footer from "./Footer";

const AuthApp = lazy(() =>
  import("auth/App").catch(() => {
    return {
      default: () => (
        <div className="error">Component AuthApp is not available!</div>
      ),
    };
  })
);

const CardApp = lazy(() =>
  import("card/Card").catch(() => {
    return {
      default: () => (
        <div className="error">Component CardApp is not available!</div>
      ),
    };
  })
);

const ProfileApp = lazy(() =>
  import("profile/Profile").catch(() => {
    return {
      default: () => (
        <div className="error">Component ProfileApp is not available!</div>
      ),
    };
  })
);

function App() {
  return (
    <div className="page__content">
      <AuthApp />
      <ProfileApp />
      <CardApp />
      <Footer/>
    </div>
  );
}

export default App;
