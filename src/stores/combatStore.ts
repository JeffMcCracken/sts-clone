import { create } from "zustand";
import { jawWorm, EnemyDefinition, Move } from "../data/enemies";

type Card = {
  id: number;
  name: string;
  cost: number;
  type: "attack" | "skill" | "power";
  damage?: number;
  block?: number;
};

type Player = {
  hp: number;
  maxHp: number;
  block: number;
  energy: number;
};

type EnemyInstance = {
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  moveIndex: number;
  moveHistory: string[];
  definition: EnemyDefinition;
};

type CombatState = {
  player: Player;
  enemy: EnemyInstance;
  hand: Card[];
  playCard: (card: Card) => void;
  enemyTurn: () => void;
  resetHand: () => void;
  endTurn: () => void;
};

const initialPlayer: Player = {
  hp: 80,
  maxHp: 80,
  block: 0,
  energy: 3,
};

const initialEnemy: EnemyInstance = {
  name: jawWorm.name,
  hp: jawWorm.maxHp,
  maxHp: jawWorm.maxHp,
  block: 0,
  moveIndex: 0,
  moveHistory: [],
  definition: jawWorm,
};

const initialDeck: Card[] = [
  { id: 1, name: "Strike", cost: 1, type: "attack", damage: 6 },
  { id: 2, name: "Defend", cost: 1, type: "skill", block: 5 },
  { id: 3, name: "Strike", cost: 1, type: "attack", damage: 6 },
  { id: 4, name: "Defend", cost: 1, type: "skill", block: 5 },
  { id: 5, name: "Strike", cost: 1, type: "attack", damage: 6 },
];

export const useCombatStore = create<CombatState>((set, get) => ({
  player: { ...initialPlayer },
  enemy: { ...initialEnemy },
  hand: [...initialDeck],

  playCard: (card) => {
    const { player, enemy, hand } = get();
    if (player.energy < card.cost) return;

    const newPlayer = { ...player, energy: player.energy - card.cost };
    const newEnemy = { ...enemy };

    if (card.damage) {
      const damage = Math.max(0, card.damage - newEnemy.block);
      newEnemy.block = Math.max(0, newEnemy.block - card.damage);
      newEnemy.hp = Math.max(0, newEnemy.hp - damage);
    }

    if (card.block) {
      newPlayer.block += card.block;
    }

    set({
      player: newPlayer,
      enemy: newEnemy,
      hand: hand.filter((c) => c.id !== card.id),
    });
  },

  enemyTurn: () => {
    const { player, enemy } = get();
    const move = enemy.definition.moves[enemy.moveIndex];

    const newPlayer = { ...player };
    const newEnemy = { ...enemy };

    if (move.damage) {
      const damage = Math.max(0, move.damage - player.block);
      newPlayer.hp = Math.max(0, newPlayer.hp - damage);
    }

    if (move.block) {
      newEnemy.block = move.block;
    }

    const history = get().enemy.moveHistory; // store this array in enemy instance
    const lastMove = history.at(-1);
    const moveIndex = enemy.definition.pickMove(lastMove, history);

    newEnemy.moveHistory = [...history, move.name];

    set({
      player: newPlayer,
      enemy: newEnemy,
    });
  },

  resetHand: () => {
    set({ hand: [...initialDeck] });
  },

  endTurn: () => {
    const { enemyTurn, resetHand } = get();

    enemyTurn();

    set((state) => ({
      player: {
        ...state.player,
        energy: 3,
        block: 0,
      },
    }));

    resetHand();
  },
}));
