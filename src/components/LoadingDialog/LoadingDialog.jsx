import { Dialog, DialogBody, Spinner } from "@vtfk/components";
import './style.css'

export default function LoadingDialog({ loadings, style }) {
  return(
    <Dialog isOpen={loadings.length > 0} showCloseButton={false}>
      <DialogBody style={{padding: '1rem'}}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '0.5rem'}}>
          <h1 style={{margin: 0}}>Handling gjennomføres</h1>
          <h3 style={{margin: 0}}>Vennligst vent</h3>
          <div>
            <Spinner size='xlarge' />
          </div>
        </div>
      </DialogBody>
    </Dialog>
  )
}