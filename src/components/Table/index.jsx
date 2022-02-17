import './style.css'
import { Checkbox } from '@vtfk/components'
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid'


export default function Table({items, headers, itemId = '_id', selected, style, dense = false, showSelect = true, selectOnClick = false, onSelectedIdsChanged, onSelectedItemsChanged}) {
  // State
  const [selectedIds, setSelectedIds] = useState(selected && Array.isArray(selected) ? selected : [])
  const [selectedItems, setSelectedItems] = useState([])
  // Functions
  function updateSelected(tableItems) {
    if(items.length === 0) return;

    let newIds = [];

    if(Array.isArray(tableItems)) {
      newIds = tableItems;
    } else if(typeof tableItems === 'object') {
      // If the item don't exist, add it. Else remove it
      if(!selectedIds.includes(tableItems[itemId])){
        newIds = [...selectedIds, tableItems[itemId]];
      }
      else {
        newIds = selectedIds.filter((i) => i !== tableItems[itemId])
      }
    }

    const newItems = items.filter((i) => newIds.includes(i[itemId]));

    setSelectedIds(newIds)
    setSelectedItems(newItems)

    if(onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function') onSelectedIdsChanged(newIds);
    if(onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function') onSelectedItemsChanged(newItems);
  }

  function selectAll(bool) {
    if(items.length === 0) return;

    let newIds = undefined;
    let newItems = undefined;
    if(bool) {
      newIds = items.map((i) => i[itemId]);
      newItems = items
    } else {
      newIds = [];
      newItems = [];
    }

    setSelectedIds(newIds)
    setSelectedItems(newItems)

    if(onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function') onSelectedIdsChanged(newIds);
    if(onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function') onSelectedItemsChanged(newItems);
  }

  function isSelected(item) {
    return selectedIds.includes(item[itemId]);
  }

  function isAllSelected() {
    if(!items || !Array.isArray(items) || items.length === 0) 
    if(!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) return false;
    return items.length === selectedIds.length;
  }

  useEffect(() => {
    updateSelected(selected);
  }, [selected])

  // Render function
  return(
    <div>
    { headers ?
      <table className="vtfk-table" style={style} cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            { showSelect && <th className='vtfk-table-checkbox'><Checkbox checked={isAllSelected()} name={"checkAll"} value={"checkAll"} label={" "} onChange={(e) => selectAll(e.target.checked)} style={{padding: 0, display: 'block'}}/></th>}
            { headers.map((header) => <th key={nanoid()} className={header.class || undefined} style={header.style || undefined}>{header.label}</th>) }
          </tr>
        </thead>
        <tbody>
          {
            (items && Array.isArray(items) && items.length > 0) ?
            items.map((item) => {
              return (
                <tr key={item[itemId]} onClick={() => selectOnClick && updateSelected(item)} className={isSelected(item) ? 'tr-selected' : undefined}>
                  { showSelect && <td className='vtfk-table-checkbox'><Checkbox checked={isSelected(item)} onChange={(e) => updateSelected(item)} style={{display: 'block'}} /></td>}
                  {
                    headers.map((header) => {
                      return (
                        <td key={nanoid()} className={dense ? 'td-dense' : undefined} style={header.itemStyle}>{item[header.value] || ''}</td>
                      )
                    })
                  }
                </tr>
              )
            })
            : <tr><td colSpan={headers.length} style={{ textAlign: 'center'}}>Ingen data funnter</td></tr>
          }
        </tbody>
      </table>
      : <div>Table cannot be shown when no headers are specified</div>
    }
    </div>
  )
}

