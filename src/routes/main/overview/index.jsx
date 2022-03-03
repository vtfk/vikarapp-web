import './style.css'
import Table from '../../../components/Table'
import { Button, Dialog, DialogTitle, DialogBody, DialogActions} from '@vtfk/components'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useSubstitutions from '../../../hooks/useSubstitutions'
import { getValidToken } from '../../../auth'

export default function MainOverview() {
  // State
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isShowRenewalDialog, setIsShowRenewalDialog] = useState(false);
  const { state:substitutions, get, isLoading } = useSubstitutions()

  // Table headers
  const headers = [
    {
      label: 'Status',
      value: 'status',
      itemStyle: { textTransform: 'capitalize' },
    },
    {
      label: 'Lærer',
      value: 'teacherName'
    },
    {
      label: 'Klasse / team',
      value: 'teamName'
    },
    {
      label: 'Utløper',
      value: 'expirationTimestamp'
    }
  ]

  const tableItems = useMemo(() => {
    // Make a copy of the data
    const items = JSON.parse(JSON.stringify(substitutions))

    // Support function
    // Translate status for display
    function translateStatus(status) {
      switch(status) {
        case 'pending':
          return 'Venter'
        case 'active':
          return 'Aktiv'
        case 'expired':
          return 'Utløpt'
        default:
          return 'Ukjent'
      }
    }

    // Format dateTime to dd.mm.yyyy
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

    // Update the items
    items.forEach((i, index) => {
      // Get a reference to the source data
      const item = substitutions[index]

      // Components
      function Status() {
        return (
          <div>
            { translateStatus(item.status) }
          </div>
        )
      }

      function Expiration() {
        return (
          <div>
            {
              formatDate(new Date(item.expirationTimestamp))
            }
          </div>
        )
      }

      // Set the components
      i._elements = {
        status: <Status />,
        expirationTimestamp: <Expiration />
      }
    })

    return items
  }, [substitutions])

  useEffect(() => {
    get(getValidToken().username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function renewSubsitution() {
    // Input validation
    if(!selectedItems || selectedItems.length === 0) return;

    // window.alert('TODO: Implementere fornying');

    for(const substitution of selectedItems) {

      console.log('Fornyer:', substitution)
    }

    
    setIsShowRenewalDialog(false)
    setSelectedIds([]);
    setSelectedItems([]);
  }

  return (
    <div className="overview">
      <Table
        itemId="_id"
        headers={headers}
        items={tableItems}
        isLoading={isLoading}
        selected={selectedIds}
        selectOnClick
        onSelectedIdsChanged={(e) => setSelectedIds(e)}
        onSelectedItemsChanged={(e) => setSelectedItems(e)}
      />
      <div className='main-footer-button-group' style={{marginTop: '1rem'}}>
        <Link to="substitute">
          <Button>Jeg skal være vikar</Button>
        </Link>
        <Button disabled={selectedIds.length === 0} onClick={() => selectedItems.length > 0 && setIsShowRenewalDialog(true)}>Forleng vikariat</Button>
        <Button>Historikk</Button>
      </div>
      <Dialog isOpen={isShowRenewalDialog} onDismiss={() => setIsShowRenewalDialog(false)}>
        <DialogTitle>Fornye vikariat?</DialogTitle>
        <DialogBody>
          Er du sikker på at du ønsker å fornye vikariat for:
          <ul>
            {
              selectedItems.map((i) => <li key={i._id}>{i.teamName}</li>)
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
