export default function SearchFilterResults({
  name, 
  id, 
  filteredSuggestions, 
  handleSuggestionClick,
  highlightedIndex
}) {

  console.log(filteredSuggestions)
  return (
    <div
      className='absolute z-10 w-3/12 bg-white border rounded mt-1 overflow-y-scroll max-h-96'
    >
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={index}
          id={id}
          onClick={(e) => handleSuggestionClick(e, name, suggestion)}
          className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${
            index === highlightedIndex ? 'bg-gray-200' : ''
          }`}
        >
          {typeof suggestion === 'object' ? (
            suggestion.country ? (
              <>
                {suggestion.country} ({suggestion.country_iata})
              </>
            ) : (
              <>
                {suggestion.category}
              </>
            )
          ) : (
            <>
              {suggestion}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
