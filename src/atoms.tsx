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

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: localData === null ? {} : { ...localData },
});
