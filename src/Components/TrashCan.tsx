import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

export const DropId = "Trash";

const Area = styled.div<{ isDraggingOver: boolean }>`
  margin-bottom: 150px;
  font-size: ${(props) => (props.isDraggingOver ? "50px" : "20px")};
  transition: font-size 0.3s ease-in-out;
`;

function TrashCan() {
  return (
    <>
      <Droppable droppableId={DropId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            🗑️
          </Area>
        )}
      </Droppable>
    </>
  );
}

export default TrashCan;
