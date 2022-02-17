import './style.css'
import Table from '../../../components/Table'
import { Button, Dialog, DialogTitle, DialogBody, DialogActions} from '@vtfk/components'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function MainOverview() {
  // State
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isShowRenewalDialog, setIsShowRenewalDialog] = useState(false);
  
  const headers = [
    {
      label: 'Status',
      value: 'status',
      itemStyle: { textTransform: 'capitalize' },
      element: Button
    },
    {
      label: 'Team',
      value: 'team'
    },
    {
      label: 'Lærer',
      value: 'teacher'
    },
    {
      label: 'Utløper',
      value: 'expiration'
    }
  ]

  const items = [
    {
      _id: 'd95fac91-38d3-4a9a-b473-cc3af4143e61',
      status: 'active',
      team: 'Section_2021-Test av vikarapp',
      teacher: 'per.test@vtfk.no',
      expiration: '13.02.2022'
    },
    {
      _id: '30e43a62-4d43-4e1f-8e5a-8c8055819ffe',
      status: 'active',
      team: 'Section_2021-Test av vikarapp',
      teacher: 'per.test@vtfk.no',
      expiration: '14.02.2022'
    }
  ]

  function renewSubsitution() {
    if(!selectedItems || selectedItems.length === 0) return;
    window.alert('TODO: Implementere fornying');
    setIsShowRenewalDialog(false)
    setSelectedIds([]);
    setSelectedItems([]);
  }

  return (
    <div className="overview main-content-bg">
      <Table itemId="_id" headers={headers} items={items} selected={selectedIds} selectOnClick onSelectedIdsChanged={(e) => setSelectedIds(e)} onSelectedItemsChanged={(e) => {setSelectedItems(e); console.log(selectedItems)}} />
      <div className='main-footer-button-group'>
        <Link to="substitute">
          <Button size="small">Jeg skal være vikar</Button>
        </Link>
        <Button size="small" disabled={selectedIds.length === 0} onClick={() => selectedItems.length > 0 && setIsShowRenewalDialog(true)}>Forleng vikariat</Button>
      </div>
      <Dialog isOpen={isShowRenewalDialog} onDismiss={() => setIsShowRenewalDialog(false)}>
        <DialogTitle>Fornye vikariat?</DialogTitle>
        <DialogBody>
          Er du sikker på at du ønsker å fornye vikariat for:
          <ul>
            {
              selectedItems.map((i) => <li key={i.id}>{i.team}</li>)
            }
          </ul>
        </DialogBody>
        <DialogActions>
          <Button size="small" style={{marginTop: '0.5rem'}} onClick={() => renewSubsitution()}>Ja</Button>
          <Button size="small" style={{marginTop: '0.5rem'}} onClick={() => setIsShowRenewalDialog(false)}>Nei</Button>
        </DialogActions>
      </Dialog>
    </div>

  )
}
