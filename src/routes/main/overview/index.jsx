import './style.css'
import { Button, DialogTitle, DialogBody} from '@vtfk/components'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useSubstitutions from '../../../hooks/useSubstitutions'
import { getValidToken } from '../../../auth'
import SubstitutionTable from '../../../components/SubstitutionTable/SubstitutionTable'
import { localizations, locale } from '../../../localization'
import ConfirmationDialog from '../../../components/ConfirmationDialog'

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

  const uniqueIds = useMemo(() => {
    const unique = [];
    const alreadyAddedIds = [];

    for(const item of selectedItems) {
      if(alreadyAddedIds.includes(item.teamId)) continue;
      unique.push(item);
      alreadyAddedIds.push(item.teamId);
    }

    return unique;
  }, [selectedItems])

  async function renewSubsitution() {
    // Input validation
    if(!selectedItems || selectedItems.length === 0) return;
    setIsShowRenewalDialog(false);

    // Make an array of each request
    const request = []
    const alreadyAddedIds = [];
    for(const substitution of selectedItems) {
      if(alreadyAddedIds.includes(substitution.teamId)) continue;
      request.push({
        substituteUpn: substitution.substituteUpn,
        teacherUpn: substitution.teacherUpn,
        teamId: substitution.teamId
      })
      alreadyAddedIds.push(substitution.teamId);
    }

    setIsShowRenewalDialog(false)
    await postSubstitutions(request)
    setSelectedIds([]);
    setSelectedItems([]);
    await get(getValidToken().username)
  }

  function handleRenewedClick() {
    if(selectedItems.length > 0) setIsShowRenewalDialog(true)
  }

  return (
    <div className="overview">
      <p className="description">{locale(localizations.routes.overview.headerSubtext)}</p>
      <SubstitutionTable
        itemId="_id"
        items={substitutions}
        isLoading={isLoading}
        selected={selectedIds}
        showSelect
        selectOnClick
        mobileHeaderText={locale(localizations.routes.overview.tableMobileHeader)}
        onSelectedIdsChanged={(e) => setSelectedIds(e)}
        onSelectedItemsChanged={(e) => setSelectedItems(e)}
      />
      <div className='main-footer-button-group' style={{marginTop: '1rem'}}>
        <Link to="substitute">
          <Button>{ locale(localizations.routes.overview.iShallSubstitute) }</Button>
        </Link>
        <Button disabled={selectedIds.length === 0} onClick={() => handleRenewedClick()}>{locale(localizations.routes.overview.extendSubstitution)}</Button>
        <Button onClick={() => navigate('/history')}>{locale(localizations.words.historyNoun)}</Button>
      </div>
      <ConfirmationDialog
        open={isShowRenewalDialog}
        onClickOk={() => renewSubsitution()}
        onClickCancel={() => setIsShowRenewalDialog(false)}
        okBtnText={locale(localizations.words.yes)}
        cancelBtnText={locale(localizations.words.no)}
      >
        <DialogTitle>{locale(localizations.terms.doYouWantToSave)}</DialogTitle>
        <DialogBody>
          {locale(localizations.routes.overview.doYouWantToRenew)}
            <ul>
              {
                uniqueIds.map((i) => <li key={i._id}>{i.teamName}</li>)
              }
            </ul>
        </DialogBody>
      </ConfirmationDialog>
    </div>
  )
}
