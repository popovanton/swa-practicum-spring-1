import React from "react";
import Card from "./Card";

function Main({
  currentUser,
  cards,
  onAddPlace,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {

  return (
    <>
    <main className="content">
      <section className="profile page__section">
        <button
          className="profile__add-button"
          type="button"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
              <Card
                key={card._id}
                card={card}
                onCardClick={onCardClick}
                onCardLike={onCardLike}
                onCardDelete={onCardDelete}
                currentUser={currentUser}
              />
            ))}
        </ul>
      </section>
    </main>
    </>
  );
}

export default Main;
