import HistoryComponent from '../../../components/History'

export default function History() {
  return (
    <div className='column-group'>
      <p className="description">Her kan du se og filtrere dine tidligere vikariater</p>
      <div style={{ flexGrow: 1}}>
        <HistoryComponent />
      </div>
    </div>
  )
}