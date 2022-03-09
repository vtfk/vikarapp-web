import { Checkbox, Icon } from '@vtfk/components';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useState } from 'react'
import './styles.scss'

function isArray(item) {
  if(!item && !Array.isArray(item)) return false;
  return true
}

export default function Select({id, items, itemLabel = 'label', itemValue = 'value', selected, label, placeholder, open, multiple, showClear = true, disabled, required, noDataText, noDataElement, style, containerStyle, onChange, onSelectedValues, onSelectedItems, onClickOutside, onClose}) {
  /*
    State
  */
  const [ _id, setId ] = useState(id || `${nanoid()}`)
  const [selectedValues, setSelectedValues] = useState(isArray(selected) ? selected : [])
  const [isOpen, setIsOpen] = useState(open || false)

  /*
    Effects
  */
  useEffect(() => {
    // Update items if applicable
    if(id !== undefined) setId(id)
    if(selected !== undefined) setSelectedValues(selected)
    if(open !== undefined) setIsOpen(open)

    function handleKeyDown(e) {
      if(e?.key === 'Escape') handleClose()
    }

    function handleMouseUp(e) {
      if(!e) return;
      const path = e.path || (e.composedPath && e.composedPath())
      const clickedInside = path.map((i) => i.id).includes(`select-${_id}`);
  
      if(!clickedInside) {
        if(onClickOutside && typeof onClickOutside === 'function') onClickOutside(e)
        handleClose()
      }
    }

    // Setup & Cleanup event handlers
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, _id, items, selected, open])

  /*
    Event handlers
  */
  function handleClose() {
    setIsOpen(false)
    if(onClose && typeof onClose === 'function') onClose()
  }

  function handleSelectedItem(value, close = true) {
    if(value === undefined || value === null) return;

    // Determine how to update the new values
    let newValues = []
    if(!selectedValues.includes(value)) newValues = [...selectedValues, value]
    else { newValues = selectedValues.filter((i) => i !== value) }

    // Handle a bit differently if the mode is multiple or not
    if(!multiple) {
      setSelectedValues([value])
      if(onChange && onChange) onChange(value)
      if(onSelectedValues && onSelectedValues) onSelectedValues(value)
      if(onSelectedItems && typeof onSelectedItems === 'function') onSelectedItems(getSelectedItems(newValues)[0])
    } else {
      setSelectedValues(newValues)
      if(onChange && onChange) onChange(newValues)
      if(onSelectedValues && onSelectedValues) onSelectedValues(newValues)
      if(onSelectedItems && typeof onSelectedItems === 'function') onSelectedItems(getSelectedItems(newValues))
    }

    // Handle closing the popup
    if(close) handleClose();
  }

  function clearItems() {
    let newValues = undefined;
    if(multiple) newValues = [];

    setSelectedValues([]);
    if(onChange && onChange) onChange(newValues)
    if(onSelectedValues && onSelectedValues) onSelectedValues(newValues)
    if(onSelectedItems && typeof onSelectedItems === 'function') onSelectedItems(newValues)
  }

  /*
    Memos
  */
  const hasSelectedValues = useMemo(() => {
    if(Array.isArray(selectedValues) && selectedValues.length > 0) return true;
    return false
  }, [selectedValues])

  const selectClasses = useMemo(() => {
    let classes = 'vtfk-select';
    if(selectedValues && selectedValues.length > 0) classes += ' has-selected'
    if(disabled) classes += ' disabled'
    
    return classes
  }, [disabled, selectedValues])

  /*
    Functions
  */
  function getSelectedItems(values) {
    if(!items || !Array.isArray(items) || !values || !Array.isArray(values)) return [];

    return items.filter((i) => values.includes(i[itemValue]))
  }

  /*
    Render
  */
  return (
    <span id={`select-${_id}`} className={selectClasses} style={containerStyle}>
      {
        label &&
        <label htmlFor={`btn-${_id}`} required={required || false} title={label}>{label}</label>
      }
      <button
        id={`btn-${_id}`}
        className={`${required && !label && !placeholder ? 'required' : ''} rounded`}
        style={style}
        disabled={disabled || false}
        required={required}
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='vtfk-select-content'>
          {
            !hasSelectedValues ? <span className='placeholder'>{placeholder || label || 'Gjør ett valg'}</span>
            : getSelectedItems(selectedValues).map((i) => i[itemLabel]).join(', ')
          }
        </div>
        <div className='vtfk-select-button-group'>
          { showClear && <Icon name="close" size='auto' onClick={(e) => { clearItems(); e.preventDefault(); e.stopPropagation()}} alt='clear select' disabled={disabled || false} /> }
          <Icon name={isOpen ? 'chevronUp' : 'chevronDown'} size='auto' alt='open/close select' disabled={disabled || false} />
        </div>
        {
        isOpen &&
        <div className='vtfk-select-popup'>
          {
            items.length === 0 &&
            <div className='no-data'>{ noDataElement || noDataText || 'Ingen valg tilgjengelig' }</div>
          }
          {
            isArray(items) && items.length > 0 &&
            <>
              {
                items.map((i) => {
                  return (
                    <div className='item' key={i[itemValue]} onClick={() => handleSelectedItem(i.value)}>
                      { multiple &&
                        <Checkbox
                          checked={hasSelectedValues && selectedValues.includes(i.value)}
                          onClick={(e) => { e.stopPropagation(); }}
                          onChange={() => { handleSelectedItem(i.value, false);}}
                          style={{marginRight: '0'}}
                        />
                      }
                      <span>{i[itemLabel]}</span>
                    </div>
                  )
                })
              }
            </>
          }
        </div>
      }
      </button>
    </span>
  )
}