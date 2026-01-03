function Dropdown({ dropdownValue, setDropdownValue }) {
  const handleChange = (e) => {
    setDropdownValue(e.target.value);
  };
  return (
    <div>
      <select
        id="dropdown"
        value={dropdownValue}
        onChange={handleChange}
        className="text-gray-800 text-base font-normal font-dmsans outline-none"
      >
        <option value="">Event Type</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
    </div>
  );
}

export default Dropdown;
