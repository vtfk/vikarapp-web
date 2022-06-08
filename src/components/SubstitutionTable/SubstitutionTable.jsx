import { Table } from "@vtfk/components"
import { localizations, locale } from '../../localization'


// Support functions
// Translate status for display
function translateStatus(status) {
  switch(status) {
    case 'pending':
      return locale(localizations.words.pending)
    case 'active':
      return locale(localizations.words.active)
    case 'expired':
      return locale(localizations.words.expired)
    default:
      return locale(localizations.words.unknown)
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
    label: locale(localizations.words.substitute),
    value: 'substituteName'
  },
  {
    label: locale(localizations.words.teacher),
    value: 'teacherName'
  },
  {
    label: locale(localizations.words.classes),
    value: 'teamName',
  },
  {
    label: locale(localizations.words.expires),
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
      selectedIds={selected}
      selectOnClick={selectOnClick}
      showSelect={showSelect}
      mobileHeaderText={mobileHeaderText}
      noDataText={locale(localizations.terms.noDataIsFound)}
      headerStyle={{fontSize: '14px'}}
      itemStyle={{fontSize: '14px'}}
      onSelectedIdsChanged={(e) => onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function' && onSelectedIdsChanged(e)}
      onSelectedItemsChanged={(e) => onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function' && onSelectedItemsChanged(e)}
    />
  )
}