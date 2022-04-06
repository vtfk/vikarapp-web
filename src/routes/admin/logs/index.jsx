import { Icon, Table } from "@vtfk/components";
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
      value: 'type',
      itemTooltip: 'type',
      itemRender: (value, item, header, index) => {
        return(
          <>
            {console.log(value)}
            {
              
              <Icon name={value} />
            }
          </>
        )
      }
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
      value: 'duration',
      itemRender: (item, index, header) => {
        return(
          <>
            { `${((item[header.value] || 1000) / 1000).toFixed(1)} sek` }
          </>
        )
      }
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