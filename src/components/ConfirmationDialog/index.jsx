import { Button, Dialog, DialogActions, DialogBody, DialogTitle } from "@vtfk/components";

export default function ErrorDialog({ open, title, children, okBtnText, cancelBtnText, onClickOk, onClickCancel }) {

  function handleOkClick() {
    if(onClickOk && typeof onClickOk === 'function') onClickOk();
  }

  function handleCancelClick() {
    if(onClickCancel && typeof onClickCancel === 'function') onClickCancel();
  }

  return(
    <>
      <Dialog isOpen={open}>
        { title && <DialogTitle>{title}</DialogTitle>}
        <DialogBody>
          {children}
        </DialogBody>
        <DialogActions>
          <Button onClick={() => handleOkClick()}>{ okBtnText || 'Ok' }</Button>
          <Button onClick={() => handleCancelClick()}>{ cancelBtnText || 'Lukk' }</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}