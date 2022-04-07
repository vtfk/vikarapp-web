import { Table } from "@vtfk/components"
import { localizations, locale } from '../../localization'


// Support functions
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

  if(typeof date === 'string') date = new Date(date)

  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('.');
}

// Table headers
const headers = [
  {
    label: 'Status',
    value: 'status',
    itemStyle: { textTransform: 'capitalize' },
    itemRender: (val) => {
      return (
        <>
          { translateStatus(val)}
        </>
      )
    }
  },
  {
    label: locale(localizations.teacher),
    value: 'teacherName'
  },
  {
    label: locale(localizations.classes),
    value: 'teamName',
  },
  {
    label: locale(localizations.expires),
    value: 'expirationTimestamp',
    itemRender: (val) => {
      return (
        <>
          { formatDate(val)}
        </>
      )
    }
  }
]

export default function SubstitutionTable({items, mobileHeaderText, isLoading, selected, selectOnClick, showSelect, onSelectedIdsChanged, onSelectedItemsChanged}) {
  return(
    <Table
      itemId="_id"
      headers={headers}
      items={items}
      isLoading={isLoading}
      selected={selected}
      selectOnClick={selectOnClick}
      showSelect={showSelect}
      mobileHeaderText={mobileHeaderText}
      onSelectedIdsChanged={(e) => onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function' && onSelectedIdsChanged(e)}
      onSelectedItemsChanged={(e) => onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function' && onSelectedItemsChanged(e)}
    />
  )
}