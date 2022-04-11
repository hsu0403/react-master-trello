import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Input = styled.input`
  margin-top: 150px;
`;

interface IForm {
  boardId: string;
}

function AddBoardInput() {
  const [boards, setBoards] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onSubmit = ({ boardId }: IForm) => {
    setBoards((prev) => {
      return {
        ...prev,
        [boardId]: [],
      };
    });
    localStorage.setItem("toDos", JSON.stringify({ ...boards, [boardId]: [] }));
    setValue("boardId", "");
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("boardId", { required: true })}
          placeholder="Add Board"
        ></Input>
      </form>
    </>
  );
}

export default AddBoardInput;
