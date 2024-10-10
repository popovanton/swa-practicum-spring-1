import React from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import Header from "./Header";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/api";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute"
import * as auth from "../utils/auth.js";

function App() {
  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});
  const [jwt, setJwt] = React.useState("");

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  const history = useHistory();


  function closeAllPopups() {
    setIsInfoToolTipOpen(false);
  }

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([userData]) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err));
  }, [history]);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setJwt(res.token);
          setEmail(res.data.email);
          setIsLoggedIn(true);
          dispatchEvent(
            new CustomEvent("user-login", {
              detail: res.token,
            })
          );
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        setJwt(res.token);
        setEmail(email);
        setIsLoggedIn(true);
        dispatchEvent(
          new CustomEvent("user-login", {
            detail: res.token,
          })
        );
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    dispatchEvent(new CustomEvent("user-logout"));
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }

  return (
    <>
      <Header email={email} onSignOut={onSignOut} />
      <ProtectedRoute exact path="/" component={<></>} isLoggedIn={isLoggedIn}/>
      <Switch>
        <Route path="/signup">
          <Register onRegister={onRegister} />
        </Route>
        <Route path="/signin">
          <Login onLogin={onLogin} />
        </Route>
      </Switch>
      <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}/>
    </>
  );
}

export default App;
