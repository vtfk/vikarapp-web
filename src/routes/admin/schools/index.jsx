import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogTitle, TextField } from "@vtfk/components";
import { useEffect, useMemo, useState } from "react";
import Table from "../../../components/Table";
import useSchools from "../../../hooks/useSchools"

export default function SubstituteRelationships() {
  const [editedItem, setEditedItem] = useState(undefined);
  const { state:schools, get, put, post, isLoading } = useSchools();
  

  const headers = [
    {
      label: 'Skole',
      value: 'name',
    },
    {
      label: 'Skoler',
      value: 'schools',
      style: { textAlign: 'center' },
      itemStyle: { textAlign: 'center' }
    },
    {
      label: 'Handlinger',
      value: 'actions',
      style: { textAlign: 'center' },
      itemStyle: { textAlign: 'center' }
    }
  ]

  const tableItems = useMemo(() => {
    // Make a copy of the items and break all references
    let tableItems = JSON.parse(JSON.stringify(schools))

    // Update the fields with custom components
    tableItems.forEach((i, index) => {
      function Action () {
        const item = {...schools[index]}
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button size="small" onClick={() => onEditItem(item)} style={{minHeight: '25px', padding: '0 1rem'}}>Rediger</Button>
          </div>
        )
      }
      function SchoolCount () {
        let str = i.permittedSchools?.length || 0;
        if(i.permittedSchools?.includes('*')) str = 'Alle'

        return (
          <div>{str}</div>
        )
      }
      i.actions = <Action />
      i.schools = <SchoolCount />
    })
    // Return the prepared tableItems
    return tableItems
  }, [schools])

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
      <div style={{color: 'white', textAlign: 'center'}}>Her setter du opp hvilke skoler som for lov til å være vikar for hverandre</div>
      <Button style={{marginLeft: 'auto'}} onClick={() => onEditItem({name: '', permittedSchools: []})} size="small">Legg til ny skole</Button>
      <Table headers={headers} items={tableItems} showSelect={false} headerStyle={{textAlign: 'left'}} itemStyle={{textAlign: 'left'}} isLoading={isLoading} mobileHeaderText="Skoler"/>
      {
        editedItem && 
        <Dialog isOpen={editedItem !== undefined} onDismiss={() => setEditedItem(undefined)}>
          <DialogTitle>{editedItem._id ? 'Rediger skole' : 'Legg til skole'}</DialogTitle>
          <DialogBody>
            { editedItem._id ? <div>Her endrer du hvilke skoler lærere på <b>{editedItem.name}</b> kan være vikar for.</div> : <div>Her oppretter du en ny skole</div>}
            <div>Navnet på skolen må være navnet som skolen har i <b>officeLocation</b> i Active Directory</div>
            <TextField value={editedItem.name} placeholder="Navn på skole" rounded style={{marginTop: '1rem'}} onChange={(e) => setEditedItem({...editedItem, name: e.target.value})} />
            <div style={{marginTop: '1rem', marginBottom: '0.2rem'}}>Lærer skal kunne vikariere for disse skolene:</div>
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
                      <Checkbox checked={editedItem.permittedSchools.includes(s._id)} label={s.name} onChange={() => {onSchoolCheck(s._id)}} />
                    </div>
                  )
                })
              }
            </div>
          </DialogBody>
          <DialogActions>
            <Button size="small" onClick={() => saveChange()}>Lagre</Button>
            <Button size="small" onClick={() => setEditedItem(undefined)}>Avbryt</Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  )
}