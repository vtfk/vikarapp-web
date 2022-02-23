import { Button } from '@vtfk/components'
import { Link } from 'react-router-dom'
import './style.css'

export default function Admin() {
  return (
    <div className='admin-container'>
      <div className='admin-action-button'>
        <Link to="/admin/substitute">
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer'}}>Behandle vikariat</Button>
        </Link>
      </div>
      <div className='admin-action-button'>
        <Link to="/admin/substituterelationships">
          <Button style={{width: '450px', maxWidth: '450px', height: '100px', fontSize: '27px', cursor: 'pointer', textDecoration: 'none'}}>Behandle søkerettigheter</Button>
        </Link>
      </div>

    </div>
  )
}