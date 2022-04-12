import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { BoardState, toDoState, TrashCanState } from "./atoms";
import Board from "./Components/Board";
import AddBoardInput from "./Components/AddBoardInput";
import TrashCan, { BoardDropId, DropId } from "./Components/TrashCan";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const BoardWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

function App() {
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;
    if (source.droppableId === "boards") {
      if (destination?.droppableId === BoardDropId) {
        const toDosCopy = { ...toDos };
        const taskObj = Object.keys(toDosCopy).splice(source.index, 1).join();
        delete toDosCopy[taskObj];
        const boardsCopy = [...boards];
        boardsCopy.splice(source.index, 1);

        setToDos(toDosCopy);
        setBoards(boardsCopy);
        localStorage.setItem("toDos", JSON.stringify({ ...toDosCopy }));
        localStorage.setItem("boards", JSON.stringify([...boardsCopy]));
      } else {
        const boardsCopy = [...boards];
        const item = boardsCopy.splice(source.index, 1)[0];
        boardsCopy.splice(destination.index, 0, item);

        setBoards(boardsCopy);
        localStorage.setItem("boards", JSON.stringify([...boardsCopy]));
      }
    } else {
      if (destination?.droppableId === source.droppableId) {
        //same board move
        const boardCopy = [...toDos[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        setToDos((allBoards) => {
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
        });
        localStorage.setItem(
          "toDos",
          JSON.stringify({
            ...toDos,
            [source.droppableId]: boardCopy,
          })
        );
      } else if (destination?.droppableId !== source.droppableId) {
        if (destination?.droppableId === DropId) {
          const sourceBoard = [...toDos[source.droppableId]];
          sourceBoard.splice(source.index, 1);
          setToDos((allBoards) => {
            return {
              ...allBoards,
              [source.droppableId]: sourceBoard,
            };
          });
          localStorage.setItem(
            "toDos",
            JSON.stringify({
              ...toDos,
              [source.droppableId]: sourceBoard,
            })
          );
        } else {
          const sourceBoard = [...toDos[source.droppableId]];
          const taskObj = sourceBoard[source.index];
          const destinationBoard = [...toDos[destination.droppableId]];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);
          setToDos((allBoards) => {
            return {
              ...allBoards,
              [source.droppableId]: sourceBoard,
              [destination.droppableId]: destinationBoard,
            };
          });
          localStorage.setItem(
            "toDos",
            JSON.stringify({
              ...toDos,
              [source.droppableId]: sourceBoard,
              [destination.droppableId]: destinationBoard,
            })
          );
        }
      }
    }
  };
  const onBeforeDragStart = (info: DragStart) => {
    if (info.type === "board") {
      setTrashCan(true);
    } else {
      setTrashCan(false);
    }
  };
  const setTrashCan = useSetRecoilState(TrashCanState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(BoardState);
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onBeforeDragStart={onBeforeDragStart}
    >
      <Wrapper>
        <AddBoardInput />
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(magic) => (
            <BoardWrapper>
              <Boards ref={magic.innerRef} {...magic.droppableProps}>
                {boards.map((boardId, index) => (
                  <Board
                    boardId={boardId}
                    key={boardId}
                    toDos={toDos[boardId]}
                    index={index}
                  />
                ))}
              </Boards>
              {magic.placeholder}
            </BoardWrapper>
          )}
        </Droppable>
        <TrashCan />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
