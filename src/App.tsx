import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import AddBoardInput from "./Components/AddBoardInput";
import TrashCan, { DropId } from "./Components/TrashCan";

const BoardArea = "BoardArea";

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
    const { draggableId, destination, source } = info;
    if (!destination) return;
    // if (source.droppableId === BoardArea) {
    //   if (destination?.droppableId === DropId) {
    //     const boardsCopy = { ...toDos };
    //     const taskObj = Object.keys(boardsCopy).splice(source.index, 1).join();
    //     delete boardsCopy[taskObj];
    //     setToDos((allBoards) => {
    //       return {
    //         ...boardsCopy,
    //       };
    //     });
    //   }
    // } else {
    // }
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
  };
  const [toDos, setToDos] = useRecoilState(toDoState);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <AddBoardInput />

        <BoardWrapper>
          <Boards>
            {Object.keys(toDos).map((boardId, index) => (
              <Board
                boardId={boardId}
                key={boardId}
                toDos={toDos[boardId]}
                index={index}
              />
            ))}
          </Boards>
        </BoardWrapper>

        <TrashCan />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
