const FilterBar = () => {
  return (
    <div className="p-2 border-b border-gray-200">
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded border px-3 py-1 text-sm"
      />
    </div>
  );
};

export default FilterBar;
