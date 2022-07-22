import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import CardForm from "./CardForm";
import { readCard, readDeck, updateCard } from "../../../utils/api/index";
import Breadcrumb from "./EditBreadCrumbs";

function EditCard() {
    const history = useHistory();
    const { deckId, cardId } = useParams();
    const [deck, setDeck] = useState({});
    const [card, setCard] = useState({});

    const name = deck.name ? deck.name : "Deck";

 
    useEffect(() => {
        const abortCon = new AbortController();
        async function loadDeck() {
            try {
                const deckInfo = await readDeck(deckId, abortCon.signal);
                setDeck(deckInfo);
            } catch (error) {
                if (error.name === "AbortError") {
                    console.info("aborted");
                } else {
                    throw error;
                };
            };
        };
        async function loadCard() {
            try {
                const cardInfo = await readCard(cardId, abortCon.signal);
                setCard(cardInfo);
            } catch (error) {
                if (error.name === "AbortError") {
                    console.info("aborted");
                } else {
                    throw error;
                };
            };
        };

        loadDeck();
        loadCard();

        return () => abortCon.abort();
    }, [deckId, cardId]);

    async function handleSubmit(card) {
        try {
            await updateCard(card);
            history.push(`/decks/${deckId}`);
        } catch (error) {
            throw error;
        };
    };

    function handleCancel() {
        history.push(`/decks/${deckId}`);
    };

    return (
        <div>
            <Breadcrumb deckId={deckId} name={name} cardId={cardId} />
            <h1>{name}: Add Card</h1>
            <CardForm
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                card={card}
            />
        </div>
    );
};
export default EditCard;