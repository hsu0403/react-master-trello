import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div`
  width: 300px;
  padding: 10px 0px;
  padding-top: 10px;
  background: linear-gradient(
    45deg,
    ${(props) => props.theme.boardColor},
    transparent
  );
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<{
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#bb4bb3"
      : props.draggingFromThisWith
      ? "#a7cff7"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    border-color: #99c9f0;
    width: 100%;
    background-color: #a4b5d7;
    &:focus {
      outline-color: #6fb6f0;
    }
  }
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
  const [tasks, setTasks] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setTasks((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    localStorage.setItem(
      "toDos",
      JSON.stringify({
        ...tasks,
        [boardId]: [newToDo, ...tasks[boardId]],
      })
    );
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={index} key={boardId}>
      {(magic) => (
        <Wrapper {...magic.draggableProps} ref={magic.innerRef}>
          <Title {...magic.dragHandleProps}>{boardId}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
              autoComplete="off"
            />
          </Form>
          <Droppable droppableId={boardId} type="task">
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos?.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                    index={index}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
