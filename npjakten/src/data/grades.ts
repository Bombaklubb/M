import type { Grade } from "../types";
import { lasaBerattande, lasaSakprosa, skrivaBerattelse, skrivaArgumenterande } from "./ak6";

export const grades: Grade[] = [
  {
    id: "ak3",
    label: "Årskurs 3",
    available: false,
    reading: [],
    writing: [],
  },
  {
    id: "ak6",
    label: "Årskurs 6",
    available: true,
    reading: [lasaBerattande, lasaSakprosa],
    writing: [skrivaBerattelse, skrivaArgumenterande],
  },
  {
    id: "ak9",
    label: "Årskurs 9",
    available: false,
    reading: [],
    writing: [],
  },
];
