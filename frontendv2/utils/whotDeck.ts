import { Card, Shape } from "@/lib/types";
import { v4 as uuid } from "uuid";

// WHOT deck structure
const WHOT_NUMBERS = [1, 2, 3, 4, 5, 7, 8, 10, 11, 12, 13, 14];
const SHAPES: Shape[] = ["circle", "triangle", "cross", "square", "star"];

export function generateWhotDeck(): Card[] {
  const deck: Card[] = [];

  // 1. Regular shapes
  for (const shape of SHAPES) {
    for (const num of WHOT_NUMBERS) {
      deck.push({
        id: uuid(),
        shape,
        number: num,
      });
    }
  }

  // 2. Whot (20) cards — 5 copies
  for (let i = 0; i < 5; i++) {
    deck.push({
      id: uuid(),
      shape: "whot",
      number: 20,
    });
  }

  return deck;
}

// Simple Fisher–Yates shuffle (best practice)
export function shuffleDeck(deck: Card[]): Card[] {
  const arr = [...deck];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
