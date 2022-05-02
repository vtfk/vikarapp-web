import HistoryComponent from '../../../components/History'
import { locale, localizations } from '../../../localization'

export default function History() {
  return (
    <div className='column-group'>
      <p className="description">{ locale(localizations.routes.admin.history.headerSubtext) }</p>
      <HistoryComponent />
    </div>
  )
}