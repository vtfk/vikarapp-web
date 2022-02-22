import { Button, SearchField, SearchResult } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';
import {
  Link
} from "react-router-dom";
import useTeacher from '../../../hooks/useTeachers'
import useTeacherTeams from '../../../hooks/useTeacherTeams';
// import useTeacherTeams from '../../../hooks/useTeacherTeams';

export default function Substitute () {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [selectedTeams, setSelectedTeams] = useState([])
  
  const { search, isLoading } = useTeacher();
  // const { searchTeacherTeams, isLoading as loading } = useTeacherTeams();
  const { search:searchTeacherTeams, isLoading:isLoadingTeams, teacherTeams } = useTeacherTeams();

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

  async function searchForTeachers() {
    const result = await search(searchTerm)
    if(result) setSearchItems(result.map((i) => { return { title: i.displayName, secondary: i.jobTitle, description: i.officeLocation, item: i }}))
    else setSearchItems([])
  }

  async function loadTeams(teacher) {
    if(!teacher || !teacher.id) return;
    await searchTeacherTeams(teacher.id);
  }

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
    <div style={{paddingTop: '2rem', height: '100%', display: 'flex', flexDirection: 'column'}}>
      <SearchField
        style={{position: 'relative'}}
        placeholder="Søk etter læreren du skal være vikar for"
        rounded
        onDebounce={() => { searchForTeachers()}}
        debounceMs={250}
        onSearch={() => { searchForTeachers() }}
        onChange={(e) => {setSearchTerm(e.target.value);}}
      />
      <div style={{position: 'relative', width: '100%', zIndex: 100}}>
        <div style={{position: 'absolute', top: '0', width: '100%'}}>
          <SearchResult items={searchItems} onClick={(e) => {setSelectedTeacher(e.item); loadTeams(e.item)}} loading={isLoading}/>
        </div>
      </div>
      {
        isLoadingTeams && <Loading title='Laster inn teams' message="Dette kan ta noen sekunder"/>
      }
      {
        !isLoadingTeams && Array.isArray(teacherTeams) && teacherTeams.length > 0 &&
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