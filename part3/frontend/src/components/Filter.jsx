const Filter = ({ keyword, onChange }) => {
  return (
    <div>
      filter shown with <input value={keyword} onChange={onChange} />
    </div>
  );
};

export default Filter;
