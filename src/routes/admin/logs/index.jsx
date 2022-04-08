import { Button, Dialog, DialogActions, DialogBody, DialogTitle, Icon, IconButton, Table } from "@vtfk/components";
import { useEffect, useState } from "react";
import useLogs from '../../../hooks/useLogs'

import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

function formatDate(date) {
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('.');
}

export default function Logs () {
  const { get, state, isLoading } = useLogs();
  const [openedItem, setOpenedItem] = useState(undefined)
  
  const headers = [
    {
      label: 'Tidspunkt',
      value: 'startTimestamp',
      itemTooltip: 'startTimestamp',
      itemRender: (val) => {
        return (
          <>
            { formatDate(new Date(val)) }
          </>
        )
      }
    },
    {
      label: 'Type',
      value: 'type',
      itemTooltip: 'type',
      style: { textAlign: 'center' },
      itemRender: (value, item, header, index) => {
        return(
          <>
            {
              <Icon name={value} style={{fill: value === 'error' ? '#dc3545' : '#71a4f7'}} />
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
      itemRender: (val, item, index, header) => {
        return(
          <>
            { `${((parseInt(val) || 1000) / 1000).toFixed(2)} sek` }
          </>
        )
      }
    },
    {
      label: 'Detailjer',
      value: '',
      itemRender: (val, i) => {
        return (
          <div style={{width: '32px'}}>
            <IconButton icon="external" onClick={() => setOpenedItem(i)} />
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    get();
    // eslint-disable-next-line
  }, [])

  return(
    <div className='column-group'>
      <Table
        headers={headers}
        items={state}
        isLoading={isLoading}
      />
      <Dialog isOpen={!!openedItem} style={{maxHeight: '90%'}} onDismiss={() => setOpenedItem()}>
        <DialogTitle>Detaljer</DialogTitle>
        <DialogBody style={{overflow: 'auto'}}>
          <SyntaxHighlighter language='json' style={docco} customStyle={{ background: 'none', overflowX: 'none', marginTop: '0' }} >{openedItem && JSON.stringify(openedItem, null, 2)}</SyntaxHighlighter>
        </DialogBody>
        <DialogActions>
          <Button size="small" onClick={() => setOpenedItem(undefined)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}