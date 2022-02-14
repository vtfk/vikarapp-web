import './style.css'
import { Checkbox } from '@vtfk/components'
import { useState } from 'react';

/*
  Props
*/
// Table.propTypes = {
//   items: PropTypes.array.isRequired,
//   headers: PropTypes.array.isRequired,
// }
function random() {
  return Math.floor(Math.random() * 10000000000)
}

export default function Table({items, headers, itemId = '_id', selected, style, dense = false, showSelect = true, selectOnClick = false, onSelectedIdsChanged, onSelectedItemsChanged}) {
  // State
  const [selectedIds, setSelectedIds] = useState(selected && Array.isArray(selected) ? selected : [])
  const [selectedItems, setSelectedItems] = useState([])

  // Functions
  function updateSelected(item) {
    if(items.length === 0) return;

    if(!selectedIds.includes(item[itemId])) {
      setSelectedIds([...selectedIds, item[itemId]]);
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== item[itemId]))
      setSelectedItems(selectedItems.filter((i) => i[itemId] !== item[itemId]))
    }

    if(onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function') onSelectedIdsChanged(selectedIds);
    if(onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function') onSelectedItemsChanged(selectedIds);

  }

  function selectAll(bool) {
    if(items.length === 0) return;

    if(bool) {
      setSelectedIds(items.map((i) => i[itemId]))
      setSelectedItems(items);
    } else {
      setSelectedIds([])
      setSelectedItems([]);
    }

    if(onSelectedIdsChanged && typeof onSelectedIdsChanged === 'function') onSelectedIdsChanged(selectedIds);
    if(onSelectedItemsChanged && typeof onSelectedItemsChanged === 'function') onSelectedItemsChanged(selectedIds);
  }

  function isSelected(item) {
    return selectedIds.includes(item[itemId]);
  }

  function isAllSelected() {
    if(!items || !Array.isArray(items) || items.length === 0) 
    if(!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) return false;
    return items.length === selectedIds.length;
  }

  // Render function
  return(
    <table className="vtfk-table" style={style} cellSpacing="0" cellPadding="0">
      <thead>
        <tr>
          { showSelect && <th><Checkbox checked={isAllSelected()} name={"checkAll"} value={"checkAll"} label={" "} onChange={(e) => selectAll(e.target.checked)} style={{padding: 0}}/></th>}
          { headers.map((header) => <th key={random()} className={header.class || undefined} style={header.style || undefined}>{header.label}</th>) }
        </tr>
      </thead>
      <tbody>
        {
          (items && Array.isArray(items) && items.length > 0) ?
          items.map((item) => {
            return (
              <tr key={item[itemId]} onClick={() => selectOnClick && updateSelected(item)} className={isSelected(item) ? 'tr-selected' : undefined}>
                { showSelect && <td><Checkbox checked={isSelected(item)} onChange={(e) => updateSelected(item, e.target.checked)} /></td>}
                {
                  headers.map((header) => {
                    return (
                      <td key={random()} className={dense ? 'td-dense' : undefined} style={header.itemStyle}>{item[header.value] || ''}</td>
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
  )
}

