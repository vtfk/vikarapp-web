import { useEffect, useMemo, useState } from "react"
import PersonSearchField from "../../../components/PersonSearchField"
import Select from "../../../components/Select"
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
  const [ selectedYears, setSelectedYears ] = useState([])
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
    if(Array.isArray(selectedYears) && selectedYears.length > 0) copy = copy.filter((i) => i.expirationTimestamp && selectedYears.includes(new Date(i.expirationTimestamp).getFullYear()))
    if(Array.isArray(selectedStatuses) && selectedStatuses.length > 0) copy = copy.filter((i) => i.status && selectedStatuses.includes(i.status))

    return copy
  },[substitutions, selectedSubstitute, selectedTeacher, selectedStatuses, selectedYears])

  const availableYears = useMemo(() => {
    if(!substitutions) return []

    const years = []
    substitutions.forEach((s) => {
      const d = Date.parse(s.expirationTimestamp)
      if(d) {
        const year = new Date(d).getFullYear()
        if(!years.includes(year)) years.push(year)
      }
    })

    years.sort()

    return years.map((y) => {return {label: y, value: y}})
  }, [substitutions])

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
        <Select
          label="Status"
          placeholder="Velg statuser"
          items={allStatuses}
          selected={selectedStatuses}
          multiple
          onChange={(e) => setSelectedStatuses(e)}
        />
        <Select
          label="År"
          placeholder="Velg år"
          items={availableYears}
          multiple
          onChange={(e) => setSelectedYears(e)}
        />
      </div>
      <h2 style={{margin: '0', color: '#FFBF00'}}>Vikariat</h2>
      <Table
        headers={tableHeaders}
        items={filteredSubstitutions}
      />
    </div>
  )
}