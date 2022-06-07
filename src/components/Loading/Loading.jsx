import './style.css'
import { Spinner } from '@vtfk/components'

export default function Loading({title, message}) {
  return (
    <div className="loading">
      <h1 style={{marginBottom: '0.5rem'}}>{title || 'Laster'}</h1>
      {
        message && <h3 style={{marginTop: 0}}>{message}</h3>
      }
      <Spinner size={'large'}/>
    </div>
  )
}