import './style.css'
import Table from '../../../components/Table'
import { Button } from '@vtfk/components'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function MainOverview() {
  // State
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  
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

  return (
    <div className="overview main-content-bg">
      <Table itemId="_id" headers={headers} items={items} selected={selectedIds} onSelectedIdsChanged={(e) => setSelectedIds(e)} onSelectedItemsChanged={(e) => {setSelectedItems(e); console.log(selectedItems)}} />
      <div className='main-footer-button-group'>
        <Link to="substitute">
          <Button size="small">Jeg skal være vikar</Button>
        </Link>
        <Button size="small" disabled={selectedIds.length === 0}>Forleng vikariat</Button>
      </div>
    </div>
  )
}
