import { Button } from "@vtfk/components";
import { useMemo, useState } from "react";
import useTeacherTeams from "../../../hooks/useTeacherTeams"
import { Table } from "@vtfk/components";
import useSubstitutions from "../../../hooks/useSubstitutions";
import PersonSearchField from "../../../components/PersonSearchField";
import ConfirmationDialog from "../../../components/ConfirmationDialog"
import { locale, localizations } from "../../../localization";

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
    { label: locale(localizations.routes.admin.substitute.tableHeaderTeamClass), value: 'displayName' }
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
      alert('The substitution request is incomplete');
      return;
    }

    const substitutions = selectedTeamIds.map((i) => {
      return {
        substituteUpn: selectedSubstitute.userPrincipalName,
        teacherUpn: selectedTeacher.userPrincipalName,
        teamId: i,
      }
    })
    
    await postSubstitutions(substitutions)
    clearState()
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <p className="description">{ locale(localizations.routes.admin.substitute.headerSubtext) }</p>
      <div className="column-group" style={{height: '100%'}}>
        <h2 style={{margin: '0', color: '#FFBF00'}}>Vikar:</h2>
        <PersonSearchField
          value={substituteSearchText}
          placeholder={ locale(localizations.routes.admin.substitute.whoShouldSubstitute) }
          onChange={(e) => setSubstituteSearchText(e)}
          onSelected={(e) => setSelectedSubstitute(e)}
          clearTrigger={clearSubstituteNum}
          returnSelf
        />
        <PersonSearchField
          value={teacherSearchText}
          placeholder={ locale(localizations.routes.admin.substitute.forWhatTeacher) }
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
          <Button disabled={!isReadyToSave} onClick={() => setShowSaveConfirmation(true)}>{ locale(localizations.routes.admin.substitute.addSubstitution) }</Button>
        </div>
      </div>
      {
        showSaveConfirmation &&
        <ConfirmationDialog
          open={showSaveConfirmation}
          onClickOk={() => postSubstitution()}
          onClickCancel={() => clearState()}
          title={ locale(localizations.terms.doYouWantToSave) }
        >
          <div>
            <div>{ locale(localizations.routes.admin.substitute.areYouSure) }</div>
              <table style={{textAlign: 'left', marginTop: '1rem', marginBottom: '0.5rem'}}>
              <tbody>
                <tr>
                  <th style={{verticalAlign: 'top', width: '75px'}}>{ locale(localizations.words.teacher) }:</th>
                  <td>{selectedTeacher?.displayName}</td>
                </tr>
                <tr>
                  <th style={{verticalAlign: 'top'}}>{ locale(localizations.words.substitute) }:</th>
                  <td>{selectedSubstitute?.displayName}</td>
                </tr>
                <tr>
                  <th style={{verticalAlign: 'top'}}>{ locale(localizations.words.classes) }</th>
                  <td>
                      {
                        selectedTeams.map((i, idx) => {
                          return (
                            <div key={idx}>
                              {i.displayName}
                            </div>
                          )
                        })
                      }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ConfirmationDialog>
      }
    </div>
  )
}