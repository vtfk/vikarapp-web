import './Main.css'
import logo from '../images/vtfk-logo.svg'

import { Button } from '@vtfk/components'
import Table from '../components/Table'

export default function Main() {
  const headers = [
    {
      label: 'Status',
      value: 'status',
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
      id: 'd95fac91-38d3-4a9a-b473-cc3af4143e61',
      status: 'active',
      team: 'Section_2021-Test av vikarapp',
      teacher: 'per.test@vtfk.no',
      expiration: '13.02.2022'
    },
    {
      id: '30e43a62-4d43-4e1f-8e5a-8c8055819ffe',
      status: 'active',
      team: 'Section_2021-Test av vikarapp',
      teacher: 'per.test@vtfk.no',
      expiration: '13.02.2022'
    }
  ]

  return (
    <main className='main-container'>
      <div className='app-container'>
        <div className='main-header'>
          <h1 className='main-title' style={{margin: 0, fontSize: '3rem'}}>VikarApp</h1>
        </div>
        <div className='main-content'>
          <Table headers={headers} items={items} />
        </div>
        <div className='main-footer'>
          <img className='main-footer-logo' alt="footer-logo" src={logo} width="100px" />
          <div className='main-footer-button-group'>
            <Button size="small">Jeg skal være vikar</Button>
            <Button size="small">Forleng vikariat</Button>
          </div>
        </div>
      </div>
    </main>
  )
}