import './Main.css'
import logo from '../images/vtfk-logo.svg'

import { Button } from '@vtfk/components'

export default function Main() {
  return (
    <main className='main-container'>
      <div className='app-container'>
        <div className='main-header'>
          <h1 className='main-title' style={{margin: 0, fontSize: '3rem'}}>VikarApp</h1>
        </div>
        <div className='main-content'>
          Her skal det være innhold
        </div>
        <div className='main-footer'>
          <img src={logo} width="100px" />
          <div className='main-footer-button-group'>
            <Button size="small">Jeg skal være vikar</Button>
            <Button size="small">Forleng vikariat</Button>
          </div>
        </div>
      </div>
    </main>
  )
}