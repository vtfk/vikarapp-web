import { Button, SelectMultiple } from "@vtfk/components"
import { useEffect, useMemo, useState } from "react"
import PersonSearchField from "../../../components/PersonSearchField"
import Table from "../../../components/Table"
import useSubstitutions from "../../../hooks/useSubstitutions"
import './style.css'


const tableHeaders = [
  {
    label: 'Vikar',
    value: 'substituteName'
  },
  {
    label: 'Lærer',
    value: 'teacherName'
  },
  {
    label: 'Status',
    value: 'status'
  },
  {
    label: 'Utløpsdato',
    value: 'expirationTimestamp'
  }
]

const allStatuses = [
  {
    label: 'Venter',
    value: 'pending'
  },
  {
    label: 'Aktiv',
    value: 'active'
  },
  {
    label: 'Utløpt',
    value: 'expired'
  }
]

export default function History() {
  const [ selectedStatuses, setSelectedStatuses ] = useState([])
  const { state:substitutions, get:getSubstitutions } = useSubstitutions()
  const [ selectedSubstitute, setSelectedSubstitute ] = useState()
  const [ selectedTeacher, setSelectedTeacher ] = useState()

  useEffect(() => {
    async function load() {
      await getSubstitutions()
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredSubstitutions = useMemo(() => {
    let copy = [...substitutions]

    if(selectedSubstitute && selectedSubstitute.id) copy = copy.filter((i) => i.substituteId === selectedSubstitute.id)
    if(selectedTeacher && selectedTeacher.id) copy = copy.filter((i) => i.teacherId === selectedTeacher.id)

    return copy
  },[substitutions, selectedSubstitute, selectedTeacher])

  const availableYears = useMemo(() => {
    if(!filteredSubstitutions) return []

    const years = []
    filteredSubstitutions.forEach((s) => {
      const d = Date.parse(s.expirationTimestamp)
      if(d) {
        const year = new Date(d).getFullYear()
        if(!years.includes(year)) years.push(year)
      }
    })

    years.sort()

    return years.map((y) => {return {label: y, value: y}})
  }, [filteredSubstitutions])


  function onStatusChanged(e) {
    if(!e?.value) return;

    if(!selectedStatuses.includes(e.value)) setSelectedStatuses([...selectedStatuses, e.value])
    else setSelectedStatuses(selectedStatuses.filter((i) => i !== e.value))
  }

  return (
    <div className="column-group">
      <h2 style={{margin: '0', color: '#FFBF00'}}>Filtrering</h2>
      <div className="history-input-group">
        <PersonSearchField
          placeholder="Vikar"
          returnSelf
          onSelected={(e) => setSelectedSubstitute(e)}
        />
        <PersonSearchField
          placeholder="Lærer"
          returnSelf
          onSelected={(e) => setSelectedTeacher(e)}
        />
      </div>
      <div className="history-input-group">
        <SelectMultiple
          placeholder="status"
          items={allStatuses}
          selectedItems={selectedStatuses.map((i) => { return { label: 'test', value: i.value }})}
          onChange={(e) => onStatusChanged(e)}
          style={{width: '100%'}}
        />
        <SelectMultiple
          placeholder="År"
          items={availableYears}
          style={{width: '100%'}}
        />
        <Button size="small" onClick={() => getSubstitutions()}>Refresh</Button>
      </div>
      <h2 style={{margin: '0', color: '#FFBF00'}}>Vikariat</h2>
      <Table
        headers={tableHeaders}
        items={filteredSubstitutions}
      />
    </div>
  )
}