import { useState } from "react";

const initialPlayer = {
  hp: 50,
  maxHp: 50,
  block: 0,
  energy: 3,
};

const initialEnemy = {
  hp: 40,
  maxHp: 40,
  block: 0,
  intent: "Attack for 8",
  damage: 8,
};

const initialDeck = [
  { id: 1, name: "Strike", cost: 1, type: "attack", damage: 6 },
  { id: 2, name: "Defend", cost: 1, type: "block", block: 5 },
  { id: 3, name: "Strike", cost: 1, type: "attack", damage: 6 },
  { id: 4, name: "Defend", cost: 1, type: "block", block: 5 },
  { id: 5, name: "Strike+", cost: 1, type: "attack", damage: 9 },
];

export default function Combat() {
  const [player, setPlayer] = useState(initialPlayer);
  const [enemy, setEnemy] = useState(initialEnemy);
  const [hand, setHand] = useState(initialDeck);

  const playCard = (card: any) => {
    if (player.energy < card.cost) return;

    let newPlayer = { ...player, energy: player.energy - card.cost };
    let newEnemy = { ...enemy };

    if (card.type === "attack") {
      const damage = Math.max(0, card.damage - newEnemy.block);
      newEnemy.block = Math.max(0, newEnemy.block - card.damage);
      newEnemy.hp = Math.max(0, newEnemy.hp - damage);
    } else if (card.type === "block") {
      newPlayer.block += card.block;
    }

    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setHand(hand.filter((c) => c.id !== card.id));
  };

  const endTurn = () => {
    let newPlayer = { ...player, energy: 3, block: 0 };
    let damage = Math.max(0, enemy.damage - player.block);
    newPlayer.hp = Math.max(0, player.hp - damage);

    setPlayer(newPlayer);
    setEnemy({ ...enemy });
    setHand(initialDeck); // reshuffle for demo
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Combat</h1>

      <div className="mb-4">
        <h2>
          Enemy: {enemy.hp} / {enemy.maxHp}
        </h2>
        <p>Intent: {enemy.intent}</p>
      </div>

      <div className="mb-4">
        <h2>
          Player: {player.hp} / {player.maxHp}
        </h2>
        <p>
          Block: {player.block} | Energy: {player.energy}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Your Hand</h3>
        <div className="flex gap-2 flex-wrap">
          {hand.map((card) => (
            <button
              key={card.id}
              onClick={() => playCard(card)}
              className="p-2 border rounded bg-white hover:bg-gray-100 shadow min-w-[120px]"
            >
              <strong>{card.name}</strong>
              <br />
              Cost: {card.cost}
              <br />
              {card.type === "attack" && `DMG: ${card.damage}`}
              {card.type === "block" && `Block: ${card.block}`}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={endTurn}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        End Turn
      </button>
    </div>
  );
}
