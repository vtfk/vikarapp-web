import { SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';

export default function Substitute () {

  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [availableTeams, setAvailableTeams] = useState(undefined)
  
  const headers = [
    {
      label: 'Team',
      value: 'name'
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
    setAvailableTeams(allTeams)
    setIsLoadingTeams(false);
  }

  return (
    <div style={{marginTop: '2rem'}}>
      <SearchField placeholder="Søk etter læreren du skal være vikar for" rounded onSearch={() => { loadTeams() }}/>
      {
        isLoadingTeams && <Loading title='Laster inn teams' message="Dette kan ta noen sekunder"/>
      }
      {
        !isLoadingTeams && Array.isArray(availableTeams) && <Table headers={headers} items={availableTeams} selectOnClick style={{marginTop: '2rem'}} />
      }
      
    </div>
  )
}