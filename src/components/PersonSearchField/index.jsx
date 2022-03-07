import { SearchField } from "@vtfk/components";
import useTeachers from "../../hooks/useTeachers";

// Item mapping for the search results
const itemMapping = [
  { value: 'displayName' },
  { value: 'jobTitle' },
  { value: 'officeLocation'}
]

export default function PersonSearchField({placeholder, onSelected, returnSelf, style}) {
  const { state:teachers , search, isLoading} = useTeachers()

  async function onChange(value) {
    if(!value) onSelectedTeacher(undefined)
  }

  async function onSelectedTeacher(item) {
    if(onSelected && typeof onSelected === 'function') onSelected(item)
  }

  return (
    <SearchField
      loading={isLoading}
      items={teachers}
      itemMapping={itemMapping}
      placeholder={placeholder}
      onChange={(e) => onChange(e?.target?.value)}
      onSearch={(e) => search(e?.target?.value, returnSelf)}
      onSelected={(e) => onSelectedTeacher(e)}
      debounceMs={250}
      rounded
    />
  )
}