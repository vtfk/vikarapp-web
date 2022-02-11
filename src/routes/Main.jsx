import './Main.css'
import logo from '../images/vtfk-logo.svg'

import { Button } from '@vtfk/components'
import Table from '../components/Table'
import { useState } from 'react'

export default function Main() {
  const headers = [
    {
      label: 'Status',
      value: 'status',
      itemStyle: { textTransform: 'capitalize' }
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

  const [selectedIds, setSelectedIds] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  return (
    <main className='main-container'>
      <div className='app-container'>
        <div className='main-header'>
          <h1 className='main-title' style={{margin: 0, fontSize: '3rem'}}>VikarApp</h1>
        </div>
        <div className='main-content'>
          { selectedIds }
          <Table itemId="_id" headers={headers} items={items} onSelectedIdsChanged={(e) => setSelectedIds(e)} onSelectedItemsChanged={(e) => setSelectedItems(e)} />
        </div>
        <div className='main-footer'>
          <img className='main-footer-logo' alt="footer-logo" src={logo} width="100px" />
          <div className='main-footer-button-group'>
            <Button size="small">Jeg skal være vikar</Button>
            <Button size="small" disabled={selectedItems.length === 0}>Forleng vikariat</Button>
          </div>
        </div>
      </div>
    </main>
  )
}