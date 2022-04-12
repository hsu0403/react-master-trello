import { Droppable } from "react-beautiful-dnd";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { TrashCanState } from "../atoms";

export const DropId = "Trash";
export const BoardDropId = "BoardTrash";

const TrashWrapper = styled.div`
  position: relative;
  margin-bottom: 150px;
  div {
    position: relative;
  }
`;

const Area = styled.div<{ isDraggingOver: boolean }>`
  font-size: ${(props) => (props.isDraggingOver ? "50px" : "20px")};
  transition: font-size 0.3s ease-in-out;
`;

const Trash = styled.div``;

function TrashCan() {
  const getTrashCan = useRecoilValue(TrashCanState);
  return (
    <TrashWrapper>
      <Droppable droppableId={DropId} type="task">
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {getTrashCan ? null : <Trash>🗑️</Trash>}
          </Area>
        )}
      </Droppable>
      <Droppable droppableId={BoardDropId} type="board">
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {getTrashCan ? <Trash>🗑️</Trash> : null}
          </Area>
        )}
      </Droppable>
    </TrashWrapper>
  );
}

export default TrashCan;
