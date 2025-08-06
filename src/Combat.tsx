import { useCombatStore } from "./stores/combatStore";

export default function Combat() {
  const player = useCombatStore((state) => state.player);
  const enemy = useCombatStore((state) => state.enemy);
  const hand = useCombatStore((state) => state.hand);
  const playCard = useCombatStore((state) => state.playCard);
  const endTurn = useCombatStore((state) => state.endTurn);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Combat</h1>

      <div className="mb-4">
        <h2>
          Enemy: {enemy.hp} / {enemy.maxHp}
        </h2>
        <p>Intent: {enemy.definition.moves[enemy.moveIndex].name}</p>
        <p>Damage: {enemy.definition.moves[enemy.moveIndex].damage}</p>
        <p>Block: {enemy.definition.moves[enemy.moveIndex].block}</p>
        <p>Index: {enemy.moveIndex}</p>
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
              {`DMG: ${card.damage}`}
              {`Block: ${card.block}`}
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
