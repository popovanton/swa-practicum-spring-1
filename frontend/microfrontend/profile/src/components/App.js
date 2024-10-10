import React from "react";
import { useHistory } from "react-router-dom";
import Main from "./Main";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [jwt, setJwt] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const history = useHistory();

  const handleUserLogin = (event) => {
    console.log("logged in ", event);
    setJwt(event.detail);
    setIsLoggedIn(true);
  };

  const handleUserLogout = (event) => {
    console.log("logged out", event);
    setCurrentUser({});
    setJwt("");
    setIsLoggedIn(false);
  };

  React.useEffect(() => {
    addEventListener("user-login", handleUserLogin); 
    return () => removeEventListener("user-login", handleUserLogin); 
  }, []);

  React.useEffect(() => {
    addEventListener("user-logout", handleUserLogout); 
    return () => removeEventListener("user-logout", handleUserLogout);
  }, []);

  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([userInfo]) => {
        setCurrentUser(userInfo);
        console.log("profile user is " + userInfo);
      })
      .catch((err) => console.log(err));
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <ProtectedRoute
        exact
        path="/"
        component={Main}
        onEditProfile={handleEditProfileClick}
        onEditAvatar={handleEditAvatarClick}
        currentUser={currentUser}
        loggedIn={isLoggedIn}
      />
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onUpdateUser={handleUpdateUser}
        onClose={closeAllPopups}
        currentUser={currentUser}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onUpdateAvatar={handleUpdateAvatar}
        onClose={closeAllPopups}
      />
    </>
  );
}

export default App;
