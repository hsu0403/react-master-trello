import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: IToDo[];
}

let output = localStorage.getItem("toDos");
let localData = JSON.parse(output as any);

let boardOutput = localStorage.getItem("boards");
let boardData = JSON.parse(boardOutput as any);

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: localData === null ? {} : { ...localData },
});

export const BoardState = atom<string[]>({
  key: "boards",
  default: boardData === null ? [] : [...boardData],
});

export const TrashCanState = atom<boolean>({
  key: "trashCan",
  default: false,
});
