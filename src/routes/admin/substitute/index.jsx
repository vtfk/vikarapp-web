import { Button } from "@vtfk/components";
import { useMemo, useState } from "react";
import useTeacherTeams from "../../../hooks/useTeacherTeams"
import { Table } from "@vtfk/components";
import useSubstitutions from "../../../hooks/useSubstitutions";
import PersonSearchField from "../../../components/PersonSearchField";
import ConfirmationDialog from "../../../components/ConfirmationDialog"

export default function SubstituteRelationships() {
  /*
    Hooks
  */
  const { search: searchTeams, isLoadingTeams } = useTeacherTeams();
  const { post:postSubstitutions } = useSubstitutions()

  /*
    State
  */
  // Show the confirmation
  const [ showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  // Substitute
  const [ substituteSearchText, setSubstituteSearchText] = useState('');
  const [ selectedSubstitute, setSelectedSubstitute] = useState()

  // Teacher
  const [ teacherSearchText, setSelectedTeacherText ] = useState('');
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ availableTeams, setAvailableTeams] = useState([])
  const [ selectedTeamIds, setSelectedTeamIds] = useState([])
  const [ selectedTeams, setSelectedTeams] = useState([])

  // Mutate this state to clear the PersonSearchFields
  const [ clearSubstituteNum, setClearSubstituteNum] = useState(0)
  const [ clearTeacherNum, setClearTeacherNum] = useState(0)

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

  // Clears all state
  function clearState() {
    setShowSaveConfirmation(false);
    setSelectedTeacher(undefined);
    setSelectedSubstitute(undefined);
    setSelectedTeacherText('');
    setSubstituteSearchText('');
    setAvailableTeams([]);
    setSelectedTeamIds([]);
    setClearSubstituteNum(clearSubstituteNum + 1)
    setClearTeacherNum(clearTeacherNum + 1)
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
      await postSubstitutions(substitutions)
      clearState()
    } catch {}
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <p className="description">Her kan du administrere alle vikariater</p>
      <div className="column-group" style={{height: '100%'}}>
        <h2 style={{margin: '0', color: '#FFBF00'}}>Vikar:</h2>
        <PersonSearchField
          value={substituteSearchText}
          placeholder="Hvem skal være vikar?"
          onChange={(e) => setSubstituteSearchText(e)}
          onSelected={(e) => setSelectedSubstitute(e)}
          clearTrigger={clearSubstituteNum}
          returnSelf
        />
        <PersonSearchField
          value={teacherSearchText}
          placeholder="For hvilken lærer?"
          onChange={(e) => setSelectedTeacherText(e)}
          onSelected={(e) => onSelectedTeacher(e)}
          clearTrigger={clearTeacherNum}
          returnSelf
        />
        <Table
          itemId="id"
          headers={tableHeaders}
          items={availableTeams}
          isLoading={isLoadingTeams}
          showSelect
          selectOnClick
          selectedIds={selectedTeamIds}
          mobileHeaderText="Teams"
          onSelectedIdsChanged={(e) => setSelectedTeamIds(e)}
          onSelectedItemsChanged={(e) => setSelectedTeams(e)}
        />
        <div style={{marginTop: 'auto'}}>
          <Button disabled={!isReadyToSave} onClick={() => setShowSaveConfirmation(true)}>Legg til vikariat</Button>
        </div>
      </div>
      <ConfirmationDialog
        open={showSaveConfirmation}
        onClickOk={() => postSubstitution()}
        onClickCancel={() => clearState()}
        title="Er du sikker på at du vil lagre?"
      >
        <div>
          <div>Er du helt sikker på at du ønsker å sette opp følgende vikariat?</div>
            <table style={{textAlign: 'left', marginTop: '1rem', marginBottom: '0.5rem'}}>
            <tbody>
              <tr>
                <th style={{verticalAlign: 'top', width: '75px'}}>Lærer:</th>
                <td>{selectedTeacher?.displayName}</td>
              </tr>
              <tr>
                <th style={{verticalAlign: 'top'}}>Vikar:</th>
                <td>{selectedSubstitute?.displayName}</td>
              </tr>
              <tr>
                <th style={{verticalAlign: 'top'}}>Klasser</th>
                <td>
                    {
                      selectedTeams.map((i, idx) => {
                        return (
                          <>
                            <div key={idx}>
                              {i.displayName}
                            </div>
                          </> 
                        )
                      })
                    }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ConfirmationDialog>
    </div>
  )
}