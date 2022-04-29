import './style.css'
import { Button, Dialog, DialogTitle, DialogBody, DialogActions} from '@vtfk/components'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSubstitutions from '../../../hooks/useSubstitutions'
import { getValidToken } from '../../../auth'
import SubstitutionTable from '../../../components/SubstitutionTable/SubstitutionTable'

export default function MainOverview() {
  // State
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [isShowRenewalDialog, setIsShowRenewalDialog] = useState(false);
  const { state:substitutions, post:postSubstitutions, get, isLoading } = useSubstitutions()
  const navigate = useNavigate()

  useEffect(() => {
    get(getValidToken().username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function renewSubsitution() {
    // Input validation
    if(!selectedItems || selectedItems.length === 0) return;

    // Make an array of each request
    const request = []
    for(const substitution of selectedItems) {
      request.push({
        substituteUpn: substitution.substituteUpn,
        teacherUpn: substitution.teacherUpn,
        teamId: substitution.teamId
      })
    }

    try {
      setIsShowRenewalDialog(false)
      await postSubstitutions(request)
      setSelectedIds([]);
      setSelectedItems([]);
      await get(getValidToken().username)
    } catch {}
  }

  return (
    <div className="overview">
      <p className="description">Her kan du se og fornye dine siste vikariater</p>
      <SubstitutionTable
        itemId="_id"
        items={substitutions}
        isLoading={isLoading}
        selected={selectedIds}
        showSelect
        selectOnClick
        mobileHeaderText="Mine vikariat"
        onSelectedIdsChanged={(e) => setSelectedIds(e)}
        onSelectedItemsChanged={(e) => setSelectedItems(e)}
      />
      <div className='main-footer-button-group' style={{marginTop: '1rem'}}>
        <Link to="substitute">
          <Button>Jeg skal være vikar</Button>
        </Link>
        <Button disabled={selectedIds.length === 0} onClick={() => selectedItems.length > 0 && setIsShowRenewalDialog(true)}>Forleng vikariat</Button>
        <Button onClick={() => navigate('/history')}>Historikk</Button>
      </div>
      <Dialog isOpen={isShowRenewalDialog} onDismiss={() => setIsShowRenewalDialog(false)}>
        <DialogTitle>Fornye vikariat?</DialogTitle>
        <DialogBody>
          Er du sikker på at du ønsker å fornye vikariat for:
          <ul>
            {
              selectedItems.map((i) => <li key={i._id}>{i.teamName}</li>)
            }
          </ul>
        </DialogBody>
        <DialogActions>
          <Button size="small" style={{marginTop: '0.5rem'}} onClick={() => renewSubsitution()}>Ja</Button>
          <Button size="small" style={{marginTop: '0.5rem'}} onClick={() => setIsShowRenewalDialog(false)}>Nei</Button>
        </DialogActions>
      </Dialog>
    </div>

  )
}
