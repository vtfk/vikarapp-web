import { Button, SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';
import {
  Link
} from "react-router-dom";
import axios from 'axios'
import { getValidBearerToken } from '../../../auth'

export default function Substitute () {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [availableTeams, setAvailableTeams] = useState(undefined);
  const [selectedTeams, setSelectedTeams] = useState([])
  
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
    if(!searchTerm) return
    if(searchTerm.length < 3) return;

    const request = {
      url: `https://graph.microsoft.com/v1.0/users?$filter=startsWith(displayName, '${searchTerm}') OR startsWith(surname, '${searchTerm}')&$orderBy=displayName&$count=true`,
      headers: {
        ConsistencyLevel: 'eventual',
        Authorization: getValidBearerToken()
      }
    }

    const response = await axios.request(request);
    if(response?.status === 200 && response.data?.value) {
      const teachers = response.data.value;
      setAvailableTeachers(teachers);
      console.log(availableTeachers);
      setSelectedTeacher(teachers[0])
      await loadTeams();
    }
  }

  async function loadTeams() {
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
      <SearchField placeholder="Søk etter læreren du skal være vikar for" rounded onSearch={() => { searchForTeachers() }} onChange={(e) => setSearchTerm(e.target.value)} />
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