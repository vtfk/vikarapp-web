import { Button, Dialog, DialogActions, DialogBody, DialogTitle } from "@vtfk/components";
import { useEffect, useRef } from "react";

export default function ErrorDialog({ open, title, children, okBtnText, cancelBtnText, onClickOk, onClickCancel }) {

  function handleOkClick() {
    if(onClickOk && typeof onClickOk === 'function') onClickOk();
  }

  function handleCancelClick() {
    if(onClickCancel && typeof onClickCancel === 'function') onClickCancel();
  }

  const dialogRef = useRef(undefined);

  useEffect(() => {
    dialogRef.current.focus();
  }, [open])

  useEffect(() => {
    function listenForEnter(e) {
      try {
        e.preventDefault();
        e.stopPropagation();  
      } catch {}

      if(e.key === 'Enter') {
        handleOkClick();
        return;
      }
    }

    document.addEventListener('keydown', listenForEnter)

    return () => document.removeEventListener('keydown', listenForEnter)
    // eslint-disable-next-line
  }, [])

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