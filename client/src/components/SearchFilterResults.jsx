import React from 'react'

export default function SearchFilterResults({name, id, filteredSuggestions, handleSuggestionClick}) {
  return (
    <div
      className='absolute z-10 w-3/12 bg-white border rounded mt-1 overflow-y-scroll'
    >
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={index}
          id={id}
          onClick={(e) => handleSuggestionClick(e, name, suggestion)}
          className="py-2 px-4 cursor-pointer hover:bg-gray-100"
        >
          {suggestion.country} ({suggestion.country_iata})
        </div>
      ))}
    </div>
  )
}
