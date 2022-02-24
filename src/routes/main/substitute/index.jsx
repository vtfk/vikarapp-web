import { Button, SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';
import {
  Link
} from "react-router-dom";
import useTeacher from '../../../hooks/useTeachers'
import useTeacherTeams from '../../../hooks/useTeacherTeams';

export default function Substitute () {
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [selectedTeams] = useState([])
  
  const { state:teachers, search:searchForTeachers, isLoading:isLoadingTeachers } = useTeacher();
  const { state:teacherTeams, search:searchTeacherTeams, isLoading:isLoadingTeams } = useTeacherTeams();

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

  function onSelectedTeams(e) {
    console.log('Selected teams substitute: ', e)
  }

  async function activateSubstitution() {
    // Input validation
    if(!selectedTeams || !Array.isArray(selectedTeams) || selectedTeams.length === 0) {
      alert('Du må velge velge en eller flere klasse å vikariere for');
      return;
    }
    // Verify
    let message = `Ønsker du å vikarere for lærer ${selectedTeacher.name}?\n\n`
    message += `Antall klasser: ${selectedTeams.length}\n\n`
    message += 'Klasser:\n'
    message += `${selectedTeams.map((t) => t.name + '\n')}`

    if(window.confirm(message)) {
      console.log('Nå skal det aktiveres vikariat');
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
        isLoadingTeams && <Loading title='Laster inn teams' message="Dette kan ta noen sekunder"/>
      }
      {
        !isLoadingTeams &&
        <Table
          headers={headers}
          items={teacherTeams}
          itemId="id"
          selectOnClick
          onSelectedItemsChanged={(e) => { onSelectedTeams(e)}}
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