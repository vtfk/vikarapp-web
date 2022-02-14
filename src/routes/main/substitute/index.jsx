import { SearchField } from '@vtfk/components'
import { useState } from 'react'
import Table from '../../../components/Table'
import Loading from '../../../components/Loading/Loading';

export default function Substitute () {

  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [availableTeams, setAvailableTeams] = useState(undefined)

  async function loadTeams() {
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(() => resolve(), ms))
      
    }

    setIsLoadingTeams(true);
    await sleep(1000);
    setIsLoadingTeams(false);
  }

  return (
    <div>
      <SearchField placeholder="Søk etter læreren du skal være vikar for" rounded onSearch={() => { loadTeams() }}/>
      {
        isLoadingTeams && <Loading title="test"/>
      }
      {
        !isLoadingTeams && Array.isArray(availableTeams) && <Table />
      }
      
    </div>
  )
}