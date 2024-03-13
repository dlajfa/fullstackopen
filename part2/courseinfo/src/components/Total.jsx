const Total = ({ parts }) => {
  return (
    <p>
      <strong>
        total of {parts.reduce((total, part) => total + part.exercises, 0)}{" "}
        exercises
      </strong>
    </p>
  );
};

export default Total;
