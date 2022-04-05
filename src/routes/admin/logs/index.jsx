import { Table } from "@vtfk/components";
import { useEffect } from "react";
import useLogs from '../../../hooks/useLogs'

export default function Logs () {
  const { get, state, isLoading } = useLogs();
  
  const headers = [
    {
      label: 'Tidspunkt',
      value: 'startTimestamp'
    },
    {
      label: 'Type',
      value: 'type'
    },
    {
      label: 'Endepunkt',
      value: 'endpoint'
    },
    {
      label: 'Utført av',
      value: 'requestor.name'
    },
    {
      label: 'Varighet',
      value: 'duration'
    }
  ]

  useEffect(() => {
    get();
  }, [])

  return(
    <div className='column-group'>
      <Table
        headers={headers}
        items={state}
        isLoading={isLoading}
      />
    </div>
  )
}