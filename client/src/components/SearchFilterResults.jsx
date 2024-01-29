import React from 'react'

export default function SearchFilterResults({
  name, 
  id, 
  filteredSuggestions, 
  handleSuggestionClick,
  highlightedIndex
}) {
  return (
    <div
      className='absolute z-10 w-3/12 bg-white border rounded mt-1 overflow-y-scroll'
    >
      {filteredSuggestions.map((suggestion, index) => (
        suggestion.country ? (
          <div
            key={index}
            id={id}
            onClick={(e) => handleSuggestionClick(e, name, suggestion)}
            className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${
            index === highlightedIndex ? 'bg-gray-200' : ''
          }`}
          >

              {suggestion.country} ({suggestion.country_iata})

          </div>
          )
        : (
          <div
            key={index}
            id={id}
            onClick={(e) => handleSuggestionClick(e, name, suggestion)}
            className={`py-2 px-4 cursor-pointer hover:bg-gray-100 ${
            index === highlightedIndex ? 'bg-gray-200' : ''
          }`}
          >

              {suggestion.category}

          </div>
          )
        ))}
    </div>
  )
}
