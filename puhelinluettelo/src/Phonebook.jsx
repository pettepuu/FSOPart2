
const PhoneBook = ({ filteredPersons, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input value={filteredPersons} onChange={handleFilterChange} />
    </div>
  );
};

export default PhoneBook;