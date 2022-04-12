import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { BoardState, toDoState } from "../atoms";

const Form = styled.form`
  margin-top: 50px;
`;

const Wrapper = styled.div`
  width: 400px;
  background: #8ba7e0;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  .input-data {
    height: 40px;
    width: 100%;
    position: relative;
    label {
      position: absolute;
      bottom: 10px;
      left: 0;
      color: grey;
      pointer-events: none;
      transition: all 0.3s ease-in-out;
    }
    .underline {
      position: absolute;
      bottom: 0;
      height: 2px;
      width: 100%;
      &::before {
        position: absolute;
        content: "";
        height: 100%;
        width: 100%;
        background: #556ad4;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
    }
  }
`;

const Input = styled.input`
  height: 100%;
  width: 100%;
  border: none;
  border-bottom: 2px solid silver;
  font-size: 17px;
  background-color: #8ba7e0;
  &:focus:valid {
    outline: none;
    ~ label {
      transform: translateY(-23px);
      font-size: 15px;
      color: #556ad4;
    }
    ~ .underline::before {
      transform: scaleX(1);
    }
  }
`;

interface IForm {
  boardId: string;
}

function AddBoardInput() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [boards, setBoards] = useRecoilState(BoardState);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IForm>();
  const onSubmit = ({ boardId }: IForm) => {
    if (!boards.includes(boardId)) {
      setBoards((prev) => {
        return [...prev, boardId];
      });
      setToDos((prev) => {
        return {
          ...prev,
          [boardId]: [],
        };
      });
      localStorage.setItem(
        "toDos",
        JSON.stringify({ ...toDos, [boardId]: [] })
      );
      localStorage.setItem("boards", JSON.stringify([...boards, boardId]));
    } else {
      setError("boardId", { message: `😅Sorry, ${boardId} board exists.` });
    }
    setValue("boardId", "");
  };
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Wrapper>
          <div className="input-data">
            <Input
              autoComplete="off"
              {...register("boardId", { required: true })}
            ></Input>
            <div className="underline"></div>
            <label>Add Board</label>
          </div>
        </Wrapper>
      </Form>
      <span>{errors?.boardId?.message}</span>
    </>
  );
}

export default AddBoardInput;
