import { SearchField } from "@vtfk/components";
import { useState } from "react";
import useTeachers from "../../../hooks/useTeachers";

export default function SubstituteRelationships() {
  const { search } = useTeachers()
  const [ availableSubstitutes, setAvailableSubstitutes] = useState([])
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ selectedSubstitute, setSelectedSubstitute] = useState()
  const [ availableTeachers, setAvailableTeachers] = useState([])

  const itemMapping = [
    { value: 'displayName' },
    { value: 'jobTitle' },
    { value: 'officeLocation'}
  ]

  async function searchForSubstitute(term) {
    let result = await search(term)
    console.log('Result', result)
    if(selectedTeacher && result && result.length > 0) {
      result = result.filter((i) => i.id !== selectedTeacher.id)
    }
    setAvailableSubstitutes(result)
  }

  async function searchForTeacher(term) {
    let result = await search(term)
    if(selectedSubstitute && result && result.length > 0) {
      result = result.filter((i) => i.id !== selectedSubstitute.id)
    }
    setAvailableTeachers(result)
  }

  return (
    <div>
      <div className="column-group">
        <p style={{margin: '0'}}>Vikar:</p>
        <SearchField
          items={availableSubstitutes}
          itemMapping={itemMapping}
          placeholder="Hvem skal være vikar?"
          onChange={(e) => e.target.value === '' ? setSelectedSubstitute(undefined) : ''}
          onSearch={(e) => { searchForSubstitute(e.target.value) }}
          onSelected={(e) => { setSelectedSubstitute(e) }}
          debounceMs={250}
          rounded
        />
        <p style={{margin: '0'}}>Lærer:</p>
        <SearchField
          items={availableTeachers}
          itemMapping={itemMapping}
          placeholder="For hvilken lærer?"
          onChange={(e) => e.target.value === '' ? setSelectedTeacher(undefined) : ''}
          onSearch={(e) => { searchForTeacher(e.target.value) }}
          onSelected={(e) => { setSelectedTeacher(e) }}
          debounceMs={250}
          rounded
        />
      </div>
    </div>
  )
}