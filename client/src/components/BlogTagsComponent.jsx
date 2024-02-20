import { ReactTags } from 'react-tag-autocomplete';
import React, { useCallback, useEffect, useState } from 'react';
import useGetContinent from '../hooks/useGetContinent';
import useGetCountry from '../hooks/useGetCountry';
import '../App.css';

export default function BlogTagsComponent({selected, setSelected}) {
    const {continentData} = useGetContinent();
    const {country} = useGetCountry();
    const [suggestions, setSuggestions] = useState([]);
    console.log(suggestions);

    useEffect(() => {
      if (Array.isArray(continentData) && Array.isArray(country)) {
        setSuggestions([...continentData, ...country].map((data, index) => ({
          value: index,
          label: data
        })));
      }
    }, [continentData, country]);

    const onAdd = useCallback(
        (newTag) => {
          setSelected([...selected, newTag])
        },
        [selected]
    );
    const onDelete = useCallback(
        (tagIndex) => {
          setSelected(selected.filter((_, i) => i !== tagIndex))
        },
        [selected]
    );
    return (
      <ReactTags
        labelText="Select tags"
        selected={selected}
        suggestions={suggestions}
        onAdd={onAdd}
        onDelete={onDelete}
        noOptionsText="No matching tags"
      />
    )
}
