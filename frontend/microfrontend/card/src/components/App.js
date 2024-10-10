import React, { useEffect } from "react";
import {useHistory} from "react-router-dom"
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "../../../profile/src/components/ProtectedRoute";

function App() {
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);
  const [jwt, setJwt] = React.useState("");
  const [isLoggedIn, setisLoggedIn] = React.useState(false);

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState({});

  const history = useHistory();

  const handleUserLogin = event => { 
    console.log("logged in ", event)
    setJwt(event.detail);
    setisLoggedIn(true);
  }

  const handleUserLogout = event => { // Эта функция получает нотификации о событиях изменения jwt
    console.log("logged out", event)
    setCurrentUser({})
    setJwt("")
    setisLoggedIn(false);
  }

  useEffect(() => {
    addEventListener("user-login", handleUserLogin); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
    return () => removeEventListener("user-login", handleUserLogin) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
  }, []);

  useEffect(() => {
    addEventListener("user-logout", handleUserLogout); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
    return () => removeEventListener("user-logout", handleUserLogout) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
  }, []);

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userInfo]) => {
        setCards(cardData);
        setCurrentUser(userInfo);
        console.log("cards are " + cardData);
        console.log("user is " + userInfo);
      })
      .catch((err) => console.log(err));
  }, [history]);

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsAddPlacePopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
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
        cards={cards}
        onAddPlace={handleAddPlaceClick}
        onCardClick={handleCardClick}
        onCardLike={handleCardLike}
        onCardDelete={handleCardDelete}
        currentUser={currentUser}
        loggedIn={isLoggedIn}
        />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onAddPlace={handleAddPlaceSubmit}
        onClose={closeAllPopups}
      />
      <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </>
  );
}

export default App;
