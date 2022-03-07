import './style.css'
import { Checkbox, Spinner } from '@vtfk/components'
import { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid'
import { mergeStyles, mergeClasses } from './lib/helpers'

export default function Table({items, headers, itemId = '_id', selected, style, headerClass, headerStyle, itemClass, itemStyle, trClass, trStyle, isLoading, loadingText, loadingElement, noDataText, noDataElement, dense = false, showSelect = false, selectOnClick = false, onSelectedIdsChanged, onSelectedItemsChanged}) {
  // State
  const [selectedIds, setSelectedIds] = useState(selected && Array.isArray(selected) ? selected : [])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Update selected ids if updated externally
    if(selected !== undefined) setSelectedIds(selected)

    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [selected])
  
  const mode = useMemo(() => {
    if(windowWidth <= 750) return 'mobile'
    return 'desktop'
  },[windowWidth])

  const validHeaders = useMemo(() => {
    if(!Array.isArray(headers) || headers.length === 0) return [];

    const vHeaders = []
    headers.forEach((h) => {
      if(h.label && h.value) vHeaders.push(h)
    })

    return vHeaders
  }, [headers])

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

    let newItems = items.filter((i) => newIds.includes(i[itemId]));
    // Strip away the _elements before returning
    newItems = newItems.map((i) => {
      let {_elements, ...clean} = i
      return clean
    })

    setSelectedIds(newIds)

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

  function getItemValue(item, header) {
    if(!item || !header || !header.value) return '';
    return item._elements?.[header.value] || item[header.value] || ''
  }

  // Render function
  return(
    <div className='vtfk-table-container' style={style} >
    { validHeaders.length === 0 && <div>Table cannot be shown when no headers are specified</div> }
    
    { validHeaders.length > 0 && 
      <>
      {/* Desktop mode */}
      {
        mode === 'desktop' &&
        <table className="vtfk-table" cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            { 
              // Render checkboxs for selecting all items if applicable
              showSelect && items && 
              <th className={mergeClasses('vtfk-table-checkbox-cell', headerClass)} style={headerStyle} >
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
            isLoading &&
            <tr>
              {
                !loadingElement && 
                <td colSpan={1000} height='100%' className={mergeClasses('vtfk-table-loading-td')}>
                  {
                    !loadingElement ?
                    <div className='vtfk-table-loading-container'>
                      <h2 style={{margin: 0, marginBottom: '0.2rem'}}>{ loadingText || 'Laster' }</h2>
                      <Spinner size="large" />
                    </div>
                    :
                    loadingElement
                  }
                </td>
              }
            </tr>
          }
          {
            !isLoading && (items && Array.isArray(items) && items.length > 0) &&
            items.map((item) => {
              return (
                <tr key={item[itemId]} onClick={(e) => selectOnClick && handleRowClick(e, item)} className={mergeClasses(trClass, isSelected(item) ? 'tr-selected' : '', selectOnClick ? 'tr-select-onclick' : '')} style={mergeStyles(trStyle)}>
                  { 
                    // Render checkbox for selecting the item in the current row, if applicable
                    showSelect &&
                    <td className='vtfk-table-checkbox-cell'>
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
                          { getItemValue(item, header) }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
          {
            !isLoading && (!items || !Array.isArray(items) || items.length === 0) &&
            <tr>
              <td colSpan={headers.length + 1} style={{ textAlign: 'center'}}>
                { noDataElement || noDataText || 'Ingen data er funnet'}
              </td>
            </tr>
          }
        </tbody>
        </table>
      }
      {
        /* Mobile mode */
        mode === 'mobile' &&
        <table className='vtfk-table vtfk-table-mobile'>
          <tbody>
            {
              items.map((item) => {
                return(
                  <tr key={item[itemId]} className={mergeClasses('vtfk-table-mobile-item', dense ? 'td-dense' : '', itemClass)}>
                    {
                      validHeaders.map((header) => {
                        return(
                          <td key={`${item[itemId]}-${header.value}`} className="vtfk-table-mobile-row">
                            <div className='vtfk-table-mobile-item-header '>{header.label}</div>
                            <div>{getItemValue(item, header)}</div>
                          </td>
                        )
                      })
                    }
                    
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      }
      </>
    }
    </div>
  )
}

