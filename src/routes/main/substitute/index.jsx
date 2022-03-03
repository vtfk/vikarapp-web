import { Button, SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import {
  Link, useNavigate
} from "react-router-dom";
import useTeacher from '../../../hooks/useTeachers'
import useTeacherTeams from '../../../hooks/useTeacherTeams';
import useSubstitutions from '../../../hooks/useSubstitutions';
import { getValidToken } from '../../../auth'

export default function Substitute () {
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [selectedTeams, setSelectedTeams] = useState([])
  
  const navigate = useNavigate()
  const { state:teachers, search:searchForTeachers, isLoading:isLoadingTeachers } = useTeacher();
  const { state:teacherTeams, search:searchTeacherTeams, isLoadingTeams} = useTeacherTeams();
  const { post:postSubstitutions } = useSubstitutions();

  // Table headers
  const headers = [
    {
      label: 'Team',
      value: 'displayName',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    },
    {
      label: 'Beskrivelse',
      value: 'description',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    }
  ]

  // Item mapping for the search results
  const itemMapping = [
    { value: 'displayName' },
    { value: 'jobTitle' },
    { value: 'officeLocation'}
  ]

  async function activateSubstitution() {
    // Input validation
    if(!selectedTeacher) {
      alert('Du må velge en lærer du skal være vikar for');
      return;
    }
    if(!selectedTeams || !Array.isArray(selectedTeams) || selectedTeams.length === 0) {
      alert('Du må velge velge en eller flere klasse å vikariere for');
      return;
    }
    // Verify that the request should be made
    let message = `Ønsker du å vikarere for lærer ${selectedTeacher.displayName}?\n\n`
    message += 'Klasser:\n'
    selectedTeams.map((t) => message += `${t.displayName}\n`)
    if(!window.confirm(message)) return;

    const substitutions = selectedTeams.map((i) => {
      return {
        teacherUpn: selectedTeacher.userPrincipalName,
        teamId: i.id
      }
    })

    // Make the request
    const data = await postSubstitutions(getValidToken().username, substitutions)

    // Route back to the front page
    if(data) {
      navigate('/')
    }
  }

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <SearchField
        loading={isLoadingTeachers}
        debounceMs={250}
        placeholder="Søk etter læreren du skal være vikar for"
        items={teachers}
        itemMapping={itemMapping}
        onSearch={(e) => { searchForTeachers(e?.target?.value) }}
        onSelected={(e) => { setSelectedTeacher(e); searchTeacherTeams(e?.userPrincipalName) }}
        rounded
      />
      {
        <Table
          headers={headers}
          items={teacherTeams}
          itemId="id"
          isLoading={isLoadingTeams}
          selectOnClick
          onSelectedItemsChanged={(e) => { setSelectedTeams(e)}}
          noDataText={'Ingen teams er funnet'}
          style={{marginTop: '2rem'}}
        />
      }
      {
      <div className='main-footer-button-group'>
        <Button size="small" disabled={selectedTeams.length === 0} onClick={() => activateSubstitution()}>Ok</Button>
        <Link to="/">
          <Button size="small">Avbryt</Button>
        </Link>
      </div>
      }
      
    </div>
  )
}