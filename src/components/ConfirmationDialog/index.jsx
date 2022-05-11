import { Button, Dialog, DialogActions, DialogBody, DialogTitle } from "@vtfk/components";
import { useCallback, useEffect, useRef } from "react";


export default function ErrorDialog({ open, title, children, okBtnText, cancelBtnText, onClickOk, onClickCancel }) {

  const handleOkClick = useCallback(() => {
    if(onClickOk && typeof onClickOk === 'function') onClickOk();
  }, [onClickOk])

  const listenForEnter = useCallback((e) => {
    console.log('Callback', e);
    try {
      e.preventDefault();
      e.stopPropagation();  
    } catch {}
  
    if(e.key === 'Enter') {
      handleOkClick();
      return;
    }
  },[handleOkClick])

  function handleCancelClick() {
    if(onClickCancel && typeof onClickCancel === 'function') onClickCancel();
  }

  const dialogRef = useRef(undefined);

  useEffect(() => {
    if(open) {
      dialogRef.current.focus();
      document.removeEventListener('keydown', listenForEnter);
      document.addEventListener('keydown', listenForEnter)
    } else {
      document.removeEventListener('keydown', listenForEnter)
    }
  }, [open, listenForEnter])

  useEffect(() => {
    return () => document.removeEventListener('keydown', listenForEnter)
    // eslint-disable-next-line
  }, [listenForEnter])

  return(
    <>
      <div ref={dialogRef}>
        <Dialog isOpen={open}>
          { title && <DialogTitle>{title}</DialogTitle>}
          <DialogBody>
            {children}
          </DialogBody>
          <DialogActions>
            <Button size="small" onClick={() => handleOkClick()}>{ okBtnText || 'Ok' }</Button>
            <Button size="small" onClick={() => handleCancelClick()}>{ cancelBtnText || 'Lukk' }</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  )
}