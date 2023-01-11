import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Task1 = () => {
  const [count, setCount] = useState<(number | string)[]>([]);
  const [isDisplay, setDisplay] = useState(false);

  useEffect(() => {
    const newCount = Array.from(Array(100).keys()).map((i: number) => {
      const num = i + 1;
      return num % 5 == 0 && num % 3 == 0
        ? "FizzBuzz"
        : num % 5 == 0
        ? "Buzz"
        : num % 3 == 0
        ? "Fizz"
        : num;
    });
    setCount(newCount);
  }, []);

  const onPrint = () => setDisplay((isOpen) => !isOpen);

  return (
    <div>
      <Link to="/">⬅ Back</Link>

      <h1>Task #1</h1>
      <button onClick={onPrint}>Press</button>
      <div>
        {isDisplay && count.map((el, i) => <p key={`${el}${i}`}>{el}</p>)}
      </div>
    </div>
  );
};

export default Task1;
