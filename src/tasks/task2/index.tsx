import { Link } from "react-router-dom";
import _debounce from "lodash/debounce";

import Fullinfo from "./fullInfo";
import Search from "./search";

const Task2 = () => {
  return (
    <>
      <Link to="/">⬅ Back</Link>
      <h1>Task #2</h1>
      <Fullinfo />
      <Search />
    </>
  );
};

export default Task2;
