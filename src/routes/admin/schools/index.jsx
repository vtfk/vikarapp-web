import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogTitle, TextField } from "@vtfk/components";
import { useEffect, useState } from "react";
import { Table } from "@vtfk/components";
import useSchools from "../../../hooks/useSchools"
import { locale, localizations } from "../../../localization";

export default function SubstituteRelationships() {
  const [editedItem, setEditedItem] = useState(undefined);
  const { state:schools, get, put, post, isLoading } = useSchools();
  

  const headers = [
    {
      label: locale(localizations.words.school),
      value: 'name',
    },
    {
      label: locale(localizations.words.schools),
      value: 'schools',
      style: { textAlign: 'center' },
      itemStyle: { textAlign: 'center' },
      itemRender: (val, item) => {
        return (
          <>
            { item.permittedSchools?.length || 0 }
          </>
        )
      }
    },
    {
      label: locale(localizations.words.actions),
      value: 'actions',
      style: { textAlign: 'center' },
      itemStyle: { textAlign: 'center' },
      itemRender: (val, item) => {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button size="small" onClick={() => onEditItem(item)} style={{minHeight: '25px', padding: '0 1rem'}}>{locale(localizations.words.edit)}</Button>
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    function getData () { get() }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onEditItem(item) {
    setEditedItem(item);
  }

  function onSchoolCheck(schoolId) {
    if(!schoolId || !editedItem) return;

    let item = {...editedItem}

    if(!item.permittedSchools || !Array.isArray(item.permittedSchools)) item.permittedSchools = [];

    if(schoolId === '*') {
      if(item.permittedSchools.length === schools.length) item.permittedSchools = [];
      else item.permittedSchools = schools.map((i) => i._id)
    } else {
      if(item.permittedSchools.includes(schoolId)) item.permittedSchools = item.permittedSchools.filter((i) => i !== schoolId)
      else item.permittedSchools.push(schoolId)
    }

    setEditedItem(item)
  }

  async function saveChange() {
    if(!editedItem) return;

    try {
      if(editedItem._id) await put(editedItem)
      else await await post(editedItem)
      await get();
      setEditedItem(undefined)
    } catch {}
  }

  return (
    <div className='column-group'>
      <p className="description">{ locale(localizations.routes.admin.schools.headerSubtext) }</p>
      <Button style={{marginLeft: 'auto'}} onClick={() => onEditItem({name: '', permittedSchools: []})} size="small">{ locale(localizations.routes.admin.schools.addNewSchool) }</Button>
      <Table headers={headers} items={schools} showSelect={false} headerStyle={{textAlign: 'left'}} itemStyle={{textAlign: 'left'}} isLoading={isLoading} mobileHeaderText="Skoler"/>
      {
        editedItem && 
        <Dialog isOpen={editedItem !== undefined} onDismiss={() => setEditedItem(undefined)} width='60%'>
          <DialogTitle>{editedItem._id ? `${locale(localizations.words.edit)} ${locale(localizations.words.school)}` : `${locale(localizations.words.add)} ${locale(localizations.words.school)}`}</DialogTitle>
          <DialogBody>
            { editedItem._id ? <div>{locale(localizations.routes.admin.schools.editDescPart1)} <b>{editedItem.name}</b> {locale(localizations.routes.admin.schools.editDescPart2)}</div> : <div>{locale(localizations.routes.admin.schools.newSchoolDesc)}</div>}
            <div>{locale(localizations.routes.admin.schools.adWarningPart1)} <b>company</b> {locale(localizations.routes.admin.schools.adWarningPart2)}</div>
            <TextField value={editedItem.name} placeholder={locale(localizations.routes.admin.schools.nameOfSchoolLabel)} rounded style={{marginTop: '1rem'}} onChange={(e) => setEditedItem({...editedItem, name: e.target.value})} />
            <div style={{marginTop: '1rem', marginBottom: '0.2rem'}}>{ locale(localizations.routes.admin.schools.teachersShouldBeAbleTo) }</div>
            <div style={{height: '275px', maxHeight: '275px', overflowY: 'auto'}}>
            <div>
              <Checkbox
                label="Alle"
                checked={editedItem.permittedSchools?.length >= schools.length}
                onChange={() => { onSchoolCheck('*') }}
                style={{fontWeight: 'bold'}}
              />
            </div>
              {
                schools && schools.length > 0 &&
                schools.filter((s) => s._id !== editedItem._id).map((s) => {
                  return (
                    <div key={s.name}>
                      <Checkbox checked={editedItem.permittedSchools?.includes(s._id)} label={s.name} onChange={() => {onSchoolCheck(s._id)}} />
                    </div>
                  )
                })
              }
            </div>
          </DialogBody>
          <DialogActions>
            <Button size="small" onClick={() => saveChange()}>{ locale(localizations.words.save)} </Button>
            <Button size="small" onClick={() => setEditedItem(undefined)}>{ locale(localizations.words.cancel)}</Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  )
}