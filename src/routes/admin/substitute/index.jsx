import { Button, SearchField } from "@vtfk/components";
import { useMemo, useState } from "react";
import useTeachers from "../../../hooks/useTeachers";
import useTeacherTeams from "../../../hooks/useTeacherTeams"
import Table from '../../../components/Table'
import useSubstitutions from "../../../hooks/useSubstitutions";

export default function SubstituteRelationships() {
  /*
    Hooks
  */
  const { search } = useTeachers()
  const { search: searchTeams, isLoadingTeams } = useTeacherTeams();
  const { post:postSubstitutions } = useSubstitutions()

  /*
    State
  */
  // Substitute
  const [ isLoadingSubstitutes, setIsLoadingSubstitutes] = useState(false)
  const [ availableSubstitutes, setAvailableSubstitutes] = useState([])
  const [ selectedSubstitute, setSelectedSubstitute] = useState()

  // Teacher
  const [ isLoadingTeachers, setIsLoadingTeachers ] = useState(false)
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ availableTeachers, setAvailableTeachers] = useState([])
  const [ availableTeams, setAvailableTeams] = useState([])
  const [ selectedTeamIds, setSelectedTeamIds] = useState([])

  const itemMapping = [
    { value: 'displayName' },
    { value: 'jobTitle' },
    { value: 'officeLocation'}
  ]

  const tableHeaders = [
    { label: 'Team / Klasse', value: 'displayName' }
  ]
  
  /*
    Memos
  */
  const isReadyToSave = useMemo(() => {
    if(!selectedTeacher) return false;
    if(!selectedSubstitute) return false;
    if(!availableTeams || !Array.isArray(availableTeams) || availableTeams.length === 0) return false
    if(!selectedTeamIds || !Array.isArray(selectedTeamIds) || selectedTeamIds.length === 0) return false

    return true
  }, [selectedTeacher, selectedSubstitute, availableTeams, selectedTeamIds])

  /*
    Substitute functions
  */
  async function onSubstituteSearchChanges(e) {
    if(!e) {
      setSelectedSubstitute(undefined)
      return
    }
    setIsLoadingSubstitutes(true)
  }

  async function searchForSubstitute(term) {
    let result = await search(term)
    if(selectedTeacher && result && result.length > 0) {
      result = result.filter((i) => i.id !== selectedTeacher.id)
    }
    setAvailableSubstitutes(result)
    setIsLoadingSubstitutes(false)
  }

  /*
    Functions
  */
  async function onTeacherSearchChanged(e) {
    if(e === '') {
      setSelectedSubstitute(undefined)
      setAvailableTeams([])
      return
    }
    
    setIsLoadingTeachers(true)
  }

  async function searchForTeacher(term) {
    let result = await search(term)
    if(selectedSubstitute && result && result.length > 0) {
      result = result.filter((i) => i.id !== selectedSubstitute.id)
    }
    setAvailableTeachers(result)
    setIsLoadingTeachers(false)
  }

  async function onSelectedTeacher(e) {
    setSelectedTeacher(e)

    // Search for teams
    const teams = await searchTeams(e.userPrincipalName)
    setAvailableTeams(teams)
  }

  // Post substitution
  async function postSubstitution() {
    if(!isReadyToSave) {
      alert('Du er ikke klar til å sende denne henvendelsen');
      return;
    }

    const substitutions = selectedTeamIds.map((i) => {
      return {
        teacherUpn: selectedTeacher.userPrincipalName,
        teamId: i,
      }
    })

    postSubstitutions(selectedSubstitute.userPrincipalName, substitutions)

  }

  return (
    <div className="column-group" style={{height: '100%'}}>
      <h2 style={{margin: '0', color: '#FFBF00'}}>Vikar:</h2>
      <SearchField
        items={availableSubstitutes}
        itemMapping={itemMapping}
        placeholder="Hvem skal være vikar?"
        loading={isLoadingSubstitutes}
        onChange={(e) => onSubstituteSearchChanges(e.target.value)}
        onSearch={(e) => { searchForSubstitute(e.target.value) }}
        onSelected={(e) => { setSelectedSubstitute(e) }}
        debounceMs={250}
        rounded
      />
      <h2 style={{margin: '0', color: '#FFBF00'}}>Lærer:</h2>
      <SearchField
        items={availableTeachers}
        itemMapping={itemMapping}
        placeholder="For hvilken lærer?"
        loading={isLoadingTeachers}
        onChange={(e) => onTeacherSearchChanged(e.target.value)}
        onSearch={(e) => { searchForTeacher(e.target.value) }}
        onSelected={(e) => { onSelectedTeacher(e) }}
        debounceMs={250}
        rounded
      />
      <Table
        itemId="id"
        headers={tableHeaders}
        items={availableTeams}
        isLoading={isLoadingTeams}
        showSelect
        selectOnClick
        selectedTeamIds={selectedTeamIds}
        onSelectedIdsChanged={(e) => setSelectedTeamIds(e)}
      />
      <div style={{marginTop: 'auto'}}>
        <Button disabled={!isReadyToSave} onClick={() => postSubstitution()}>Legg til vikariat</Button>
      </div>
    </div>
  )
}