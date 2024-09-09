
const ShownPersons = ({ name, number, handleRemovePerson }) => {
  return (
    <li key={name}>
      {name} {number}
      <button onClick={handleRemovePerson}>remove</button>
    </li>
  );
};

export default ShownPersons;