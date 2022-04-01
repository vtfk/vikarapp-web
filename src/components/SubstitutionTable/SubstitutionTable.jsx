import { useMemo } from "react";
import { Table } from "@vtfk/components"
import { localizations, locale } from '../../localization'

// Table headers
const headers = [
  {
    label: 'Status',
    value: 'status',
    itemStyle: { textTransform: 'capitalize' },
  },
  {
    label: locale(localizations.teacher),
    value: 'teacherName'
  },
  {
    label: locale(localizations.classes),
    value: 'teamName'
  },
  {
    label: locale(localizations.expires),
    value: 'expirationTimestamp'
  }
]

export default function SubstitutionTable({items, mobileHeaderText, isLoading, selected, selectOnClick, showSelect, onSelectedIdsChanged, onSelectedItemsChanged}) {

  const tableItems = useMemo(() => {
    // Make a copy of the data
    const _items = JSON.parse(JSON.stringify(items))
    if(!items || !Array.isArray(_items)) return []

    // Support function
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

      return [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('.');
    }

    // Update the items
    _items.forEach((i, index) => {
      // Get a reference to the source data
      const item = items[index]

      // Components
      function Status() {
        return (
          <div>
            { translateStatus(item.status) }
          </div>
        )
      }

      function Expiration() {
        return (
          <div>
            {
              formatDate(new Date(item.expirationTimestamp))
            }
          </div>
        )
      }

      // Set the components
      i._elements = {
        status: <Status />,
        expirationTimestamp: <Expiration />
      }
    })

    return _items
  }, [items])

  return(
    <Table
      itemId="_id"
      headers={headers}
      items={tableItems}
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