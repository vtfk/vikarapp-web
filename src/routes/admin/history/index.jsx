import HistoryComponent from '../../../components/History'

export default function History() {
  return (
    <div className='column-group'>
      <p className="description">Her kan du søke og filtrere i alle vikariater</p>
      <div style={{flexGrow: 1}}>
        <HistoryComponent />
      </div>
    </div>
  )
}