import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useHistory, useRouteMatch } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../../utils/api";
import NotFound from "../NotFound";
import CardList from "./CardList";
import Breadcrumb from "./ViewBreadCrumbs";

function ViewDeck() {
  const [deckInfo, setDeckInfo] = useState({});
  const { deckId } = useParams();
  const { name, description } = deckInfo;
  const { url } = useRouteMatch();
  const history = useHistory();


  const getDeckDetails = useCallback(async () => {
    try {
      const deck = await readDeck(deckId);
      setDeckInfo(deck);
    } catch (error) {
      setDeckInfo({ name: "Not Found" });
    }
  }, [deckId]);

  useEffect(() => {
    getDeckDetails();
  }, [deckId, getDeckDetails]);

  async function deleteHandler(id) {
    if (
      window.confirm("Delete this card?\n\nYou will not be able to recover it.")
    ) {
      await deleteCard(id);
      getDeckDetails();
    }
  }

  if (name === "Not Found") return <NotFound />;

  async function handleDeleteDeck() {
    if (
      window.confirm("Delete this deck?\n\nYou will not be able to recover it.")
    ) {
      await deleteDeck(deckId);
      history.push("/");
    }
  }

  return (
    <div>
      <Breadcrumb name={name} />
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="d-flex">
        <Link className="btn btn-secondary mr-2 p-2" to={`${url}/edit`}>
          <i className="bi bi-pencil-fill"></i> Edit
        </Link>
        <Link className="btn btn-primary mr-2 p-2" to={`${url}/study`}>
          <i className="bi bi-book"></i> Study
        </Link>
        <Link className="btn btn-primary p-2" to={`${url}/cards/new`}>
          <i className="bi bi-plus-lg"></i> Add Cards
        </Link>
        <button
          className="btn btn-danger ml-auto p-2"
          onClick={handleDeleteDeck}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
      <CardList deck={deckInfo} deleteHandler={deleteHandler} />
    </div>
  );
}
export default ViewDeck;