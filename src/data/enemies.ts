export type Move = {
  name: string;
  damage?: number;
  block?: number;
  buff?: string;
  debuff?: string;
};

export type EnemyDefinition = {
  id: string;
  name: string;
  minHp: number;
  maxHp: number;
  moves: Move[];
  pickMove: (lastMoveName?: string, moveHistory?: string[]) => number;
};

export const jawWorm: EnemyDefinition = {
  id: "jaw-worm",
  name: "Jaw Worm",
  minHp: 40,
  maxHp: 44,
  moves: [
    { name: "Chomp", damage: 11 },
    { name: "Thrash", damage: 7, block: 5 },
    { name: "Bellow", buff: "strength+" },
  ],
  pickMove: (lastMoveName?: string, moveHistory: string[] = []) => {
    // Start with Chomp on the first turn
    if (!lastMoveName) return 0; // index 0 = Chomp

    // All moves
    const moves = ["Chomp", "Bellow", "Thrash"];

    // Constraints
    const lastTwo = moveHistory.slice(-2);
    const lastOne = moveHistory.slice(-1)[0];

    const banned = new Set<string>();
    if (lastOne === "Chomp") banned.add("Chomp");
    if (lastOne === "Bellow") banned.add("Bellow");
    if (lastTwo[0] === "Thrash" && lastTwo[1] === "Thrash")
      banned.add("Thrash");

    // Weighted pool
    const weightedPool: string[] = [
      ...Array(25).fill("Chomp"),
      ...Array(45).fill("Bellow"),
      ...Array(30).fill("Thrash"),
    ];

    // Filter out banned moves
    const validPool = weightedPool.filter((move) => !banned.has(move));

    // Fallback if somehow empty (shouldn't happen)
    const chosenName =
      validPool.length > 0
        ? validPool[Math.floor(Math.random() * validPool.length)]
        : "Chomp";

    return moves.indexOf(chosenName);
  },
};
