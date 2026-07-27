import type { Transaction } from "@/models";

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Mercadona",
    amount: 52.4,
    date: new Date("2026-07-27"),
    type: "expense",
  },

  {
    id: "2",
    title: "Nómina",
    amount: 2400,
    date: new Date("2026-07-26"),
    type: "income",
  },

  {
    id: "3",
    title: "Netflix",
    amount: 19.99,
    date: new Date("2026-06-10"),
    type: "expense",
  },
  {
    id: "4",
    title: "Disney",
    amount: 9.99,
    date: new Date("2025-07-24"),
    type: "expense",
  },
];
