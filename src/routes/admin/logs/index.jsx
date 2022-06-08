import { Button, Datepicker, Dialog, DialogActions, DialogBody, DialogTitle, Icon, IconButton, Table } from "@vtfk/components";
import { useEffect, useState } from "react";
import useLogs from '../../../hooks/useLogs'
import './styles.scss'
import { locale, localizations } from "../../../localization";

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
  const today = new Date();

  const { get, state, isLoading } = useLogs();
  const [openedItem, setOpenedItem] = useState(undefined)
  const [from, setFrom] = useState(new Date(today.setHours(0, 0, 0, 0)))
  const [to, setTo] = useState(new Date(today.setHours(24, 0, 0, 0)))

  const headers = [
    {
      label: locale(localizations.routes.logs.thTimestamp),
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
      label: locale(localizations.routes.logs.thEndpoint),
      value: 'endpoint'
    },
    {
      label: locale(localizations.routes.logs.thDoneBy),
      value: 'requestor.name',
      itemRender: (val) => {
        return (
          <>
            { val ? val : 'API'}
          </>
        )
      }
    },
    {
      label: locale(localizations.routes.logs.thDuration),
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
      label: locale(localizations.routes.logs.thDetails),
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
    if(from && to) {
      get(from, to);
    }

    // eslint-disable-next-line
  }, [from, to])

  return(
    <div className='column-group'>
      <p className="description">{ locale(localizations.routes.logs.headerSubtext) }</p>
      <div className="toolbar" style={{display: 'flex'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Datepicker placeholder={ locale(localizations.words.from) } selected={from} onChange={(e) => { setFrom(e) }} />
        </div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Datepicker placeholder={ locale(localizations.words.to) } selected={to} onChange={(e) => { setTo(e) }} />
        </div>
      </div>
      <div style={{overflow: 'auto', flexGrow: 1}}>
        <Table
          headers={headers}
          items={state}
          isLoading={isLoading}
          noDataText={locale(localizations.terms.noDataIsFound)}
          mobileHeaderText="Logger"
          selectOnClick={false}
        />
      </div>
      <Dialog isOpen={!!openedItem} height="90%" width="60%" draggable onDismiss={() => setOpenedItem()}>
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