import type { Grade } from "../types";
import { lasaBerattande, lasaSakprosa, skrivaBerattelse, skrivaArgumenterande } from "./ak6";
import { ak3Berattande, ak3Faktatext } from "./ak3";
import { ak9Skonlitterar, ak9Sakprosa, ak9Kronika } from "./ak9";

export const grades: Grade[] = [
  {
    id: "ak3",
    label: "Årskurs 3",
    available: true,
    reading: [ak3Berattande, ak3Faktatext],
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
    available: true,
    reading: [ak9Skonlitterar, ak9Sakprosa],
    writing: [ak9Kronika],
  },
];
