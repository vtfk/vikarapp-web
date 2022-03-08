import { SearchField } from "@vtfk/components";
import { useState } from "react";
import useTeachers from "../../hooks/useTeachers";

// Item mapping for the search results
const itemMapping = [
  { value: 'displayName' },
  { value: 'jobTitle' },
  { value: 'officeLocation'}
]

export default function PersonSearchField({placeholder, onSelected, returnSelf, style}) {
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const {search} = useTeachers()

  async function onChange(value) {
    if(!value) {
      onSelectedTeacher(undefined)
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }

  async function onSearch(term) {
    const items = await search(term, returnSelf);
    setItems(items)
    setIsLoading(false)
  }

  async function onSelectedTeacher(item) {
    if(onSelected && typeof onSelected === 'function') onSelected(item)
  }

  return (
    <SearchField
      loading={isLoading}
      items={items}
      itemMapping={itemMapping}
      placeholder={placeholder}
      onChange={(e) => onChange(e?.target?.value)}
      onSearch={(e) => onSearch(e.target.value)}
      onSelected={(e) => onSelectedTeacher(e)}
      debounceMs={250}
      rounded
    />
  )
}