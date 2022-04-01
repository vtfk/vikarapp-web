import { Button } from "@vtfk/components";
import { useMemo, useState } from "react";
import useTeacherTeams from "../../../hooks/useTeacherTeams"
import { Table } from "@vtfk/components";
import useSubstitutions from "../../../hooks/useSubstitutions";
import PersonSearchField from "../../../components/PersonSearchField";

export default function SubstituteRelationships() {
  /*
    Hooks
  */
  const { search: searchTeams, isLoadingTeams } = useTeacherTeams();
  const { post:postSubstitutions } = useSubstitutions()

  /*
    State
  */
  // Substitute
  const [ selectedSubstitute, setSelectedSubstitute] = useState()

  // Teacher
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ availableTeams, setAvailableTeams] = useState([])
  const [ selectedTeamIds, setSelectedTeamIds] = useState([])

  // Headers for the table
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
    Functions
  */
  async function onSelectedTeacher(e) {
    setSelectedTeacher(e)
    if(!e) {
      setAvailableTeams([])
      return;
    }

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
        substituteUpn: selectedSubstitute.userPrincipalName,
        teacherUpn: selectedTeacher.userPrincipalName,
        teamId: i,
      }
    })
    
    try {
      postSubstitutions(substitutions)
    } catch {}
  }

  return (
    <div className="column-group" style={{height: '100%'}}>
      <h2 style={{margin: '0', color: '#FFBF00'}}>Vikar:</h2>
      <PersonSearchField
        placeholder="Hvem skal være vikar?"
        onSelected={(e) => setSelectedSubstitute(e)}
        returnSelf
      />
      <PersonSearchField
        placeholder="For hvilken lærer?"
        onSelected={(e) => onSelectedTeacher(e)}
        returnSelf
      />
      {/* <SearchField
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
      /> */}
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