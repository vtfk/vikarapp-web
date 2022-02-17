import { Button, SearchField, SearchResult } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';
import {
  Link
} from "react-router-dom";
import axios from 'axios'
import { getValidBearerToken } from '../../../auth'
import useTeacher from '../../../hooks/useTeachers'

export default function Substitute () {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchItems, setSearchItems] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [availableTeams, setAvailableTeams] = useState(undefined);
  const [selectedTeams, setSelectedTeams] = useState([])
  
  const { search, isLoading } = useTeacher()

  const headers = [
    {
      label: 'Team',
      value: 'displayName',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    },
    {
      label: 'Beskrivelse',
      value: 'description'
    }
  ]

  async function searchForTeachers() {
    const result = await search(searchTerm)
    if(result) setSearchItems(result.map((i) => { return { title: i.displayName, secondary: i.jobTitle, description: i.officeLocation, item: i }}))
    else setSearchItems([])
  }

  async function loadTeams() {
    console.log('Selected Teacher:', selectedTeacher)
    if(!selectedTeacher || !selectedTeacher.id) return;

    // Request for retreiving the teachers teams
    const request = {
      url: `https://graph.microsoft.com/v1.0/users/${selectedTeacher.id}/ownedObjects`,
      headers: {
        ConsistencyLevel: 'eventual',
        Authorization: getValidBearerToken()
      }
    }

    setIsLoadingTeams(true);
    const response = await axios.request(request);
    console.log('Response:', response)

    if(response?.status === 200 && response.data?.value) {
      console.log('Received data: ', response.data.value);
      setAvailableTeams(response.data.value)
    }

    setIsLoadingTeams(false);
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
      <SearchField placeholder="Søk etter læreren du skal være vikar for" rounded onDebounce={() => { searchForTeachers()}} debounceMs={250} onSearch={() => { searchForTeachers() }} onChange={(e) => {setSearchTerm(e.target.value); setSearchItems([])}} />
      <SearchResult items={searchItems} onClick={(e) => {setSelectedTeacher(e.item); loadTeams()}} loading={isLoading} />
      {
        isLoadingTeams && <Loading title='Laster inn teams' message="Dette kan ta noen sekunder"/>
      }
      {
        !isLoadingTeams && Array.isArray(availableTeams) && <Table headers={headers} items={availableTeams} itemId="id" onSelectedItemsChanged={(e) => { setSelectedTeams(e)}} selectOnClick style={{marginTop: '2rem'}} />
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