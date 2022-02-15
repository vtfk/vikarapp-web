import { Button, SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';
import {
  Link
} from "react-router-dom";

export default function Substitute () {
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [availableTeams, setAvailableTeams] = useState(undefined);
  const [selectedTeams, setSelectedTeams] = useState([])
  
  const headers = [
    {
      label: 'Team',
      value: 'name',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    }
  ]

  const teachers = [
    {
      _id: '0f4f58a9-fb12-4c9a-a7a1-0c23b129b88a',
      name: 'Test testesen',
    }, {
      _id: '96b5a35b-4ecc-42e9-849e-fe3b06feb44f',
      name: 'Noen Andre'
    }
  ]

  const allTeams = [
    {
      _id: '4c581958-a42e-4cb5-9ddf-ccc2fa22d9fd',
      name: 'Team #1'
    },
    {
      _id: '5445ceb5-26ec-407b-9546-9089bfdd92a9',
      name: 'Team #2'
    }
  ]

  async function loadTeams() {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(() => resolve(), ms))
      
    }

    setIsLoadingTeams(true);
    await sleep(1000);
    setSelectedTeacher(teachers[0]);
    setAvailableTeams(allTeams)
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
      <SearchField placeholder="Søk etter læreren du skal være vikar for" rounded onSearch={() => { loadTeams() }}/>
      {
        isLoadingTeams && <Loading title='Laster inn teams' message="Dette kan ta noen sekunder"/>
      }
      {
        !isLoadingTeams && Array.isArray(availableTeams) && <Table headers={headers} items={availableTeams} onSelectedItemsChanged={(e) => { setSelectedTeams(e)}} selectOnClick style={{marginTop: '2rem'}} />
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