import './style.css'
import { Checkbox } from '@vtfk/components'
import { useState } from 'react';
import { nanoid } from 'nanoid'
import { mergeStyles, mergeClasses } from './lib/helpers'

export default function Table({items, headers, itemId = '_id', selected, style, headerClass, headerStyle, itemClass, itemStyle, trClass, trStyle, dense = false, showSelect = true, selectOnClick = false, onSelectedIdsChanged, onSelectedItemsChanged}) {
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
    console.log('Selected Items:', selectedItems);

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

  function handleCheckboxClick(e, item) {
    updateSelected(item);
  }

  function handleRowClick(e, item) {
    const targetNodeType = e.target.nodeName;
    if(targetNodeType !== 'TD' && targetNodeType !== 'TR') return;
    updateSelected(item);
  }

  // Render function
  return(
    <div className='vtfk-table-container'>
    { headers ?
      <table className="vtfk-table" style={style} cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            { 
              // Render checkboxs for selecting all items if applicable
              showSelect && items && 
              <th className={mergeClasses('vtfk-table-checkbox', headerClass)} style={headerStyle} >
                <Checkbox checked={isAllSelected()} name={"checkAll"} value={"checkAll"} label={" "} onChange={(e) => selectAll(e.target.checked)} style={{padding: 0, display: 'block'}}/>
              </th>
            }
            { 
              // Render all headers
              headers.map((header) => 
                <th key={nanoid()} className={mergeClasses(headerClass, header.class)} style={mergeStyles(headerStyle, header.style)}>
                  {header.label}
                </th>
              )
            }
          </tr>
        </thead>
        <tbody>
          {
            (items && Array.isArray(items) && items.length > 0) ?
            items.map((item) => {
              return (
                <tr key={item[itemId]} onClick={(e) => selectOnClick && handleRowClick(e, item)} className={mergeClasses(trClass, isSelected(item) ? 'tr-selected' : '')} style={mergeStyles(trStyle)}>
                  { 
                    // Render checkbox for selecting the item in the current row, if applicable
                    showSelect &&
                    <td className='vtfk-table-checkbox'>
                      <Checkbox checked={isSelected(item)} onChange={(e) => handleCheckboxClick(e, item)} style={{display: 'block'}} />
                    </td>
                  }
                  {
                    // Render item
                    headers.map((header) => {
                      return (
                        <td
                          key={nanoid()}
                          className={mergeClasses(dense ? 'td-dense' : '', itemClass, header.itemClass)}
                          style={mergeStyles(itemStyle, header.itemStyle)}
                        >
                          { item.elements?.[header.value] || item[header.value] || '' }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
            : <tr><td colSpan={headers.length + 1} style={{ textAlign: 'center'}}>Ingen data funnet</td></tr>
          }
        </tbody>
      </table>
      :
      <div>Table cannot be shown when no headers are specified</div>
    }
    </div>
  )
}

