import { Dialog, DialogActions, Button, IconButton, DialogBody } from "@vtfk/components";
import { useEffect, useState } from "react";
import ErrorField from '.'
import './style.css'

export default function ErrorDialog({ errors, onOk, onClear, style }) {
  const [errorIndex, setErrorIndex] = useState(0)
  const [isShowDetails, setIsShowDetails] = useState(false)

  useEffect(() => {
    if(Array.isArray(errors)) {
      if(errors.length === 0) setErrorIndex(0)
      else if(errors.length === 1) setErrorIndex(0)
      else if(errorIndex > errors.length) setErrorIndex(errors.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors])

  function decrementErrorIndex() {
    if(errorIndex > 0) setErrorIndex(errorIndex - 1)
  }

  function incrementErrorIndex() {
    if(errorIndex < errors.length) setErrorIndex(errorIndex + 1)
  }

  function handleOk() {
    if(onOk && typeof onOk === 'function') onOk(errorIndex)
  }

  function handleClear() {
    if(onClear && typeof onClear === 'function') onClear()
  }

  return(
    <Dialog isOpen={errors.length > 0} onDismiss={() => onClear()} showCloseButton={false}>
      <DialogBody>
        <ErrorField error={errors[errorIndex]} showDetails={isShowDetails}/>
      </DialogBody>
      <DialogActions className='vtfk-errordialog-actions'>
        <Button size="small" onClick={() => handleOk()}>Ok</Button>
        { errors.length > 1 && <Button size="small" onClick={() => handleClear()}>Ok til alle</Button> }
        <Button size="small" onClick={() => setIsShowDetails(!isShowDetails)}>{!isShowDetails ? 'Vis detaljer' : 'Skjul detaljer'}</Button>
        { errors.length > 1 && 
          <div className='vtfk-errordialog-multiple-error-button-group'>
            <IconButton icon="arrowLeft" onClick={() => decrementErrorIndex()} disabled={errorIndex === 0} style={{margin: '0'}}/>
            <IconButton icon="arrowRight" onClick={() => incrementErrorIndex()} disabled={errorIndex === errors.length - 1}/>
            <div style={{height: '100%', display: 'flex', alignItems: 'center', marginTop: 'auto', marginBottom: 'auto'}}>
              <span><b>{errorIndex + 1}</b> av <b>{errors.length}</b></span>
            </div>
          </div>
        }
      </DialogActions>
    </Dialog>
  )
}