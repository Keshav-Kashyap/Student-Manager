import { useContext } from "react";
import { StudentsContext } from "@/context/StudentsContext";

const useStudents = () => {
  return useContext(StudentsContext);
};

export default useStudents;