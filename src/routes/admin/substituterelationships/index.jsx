import { Button, Checkbox, Dialog, DialogActions, DialogBody, DialogTitle } from "@vtfk/components";
import { useEffect, useMemo, useState } from "react";
import Table from "../../../components/Table";
import useSubstituteRelationships from "../../../hooks/useSubstituteRelationships"

export default function SubstituteRelationships() {
  const [editedItem, setEditedItem] = useState(undefined);

  const { state:relationships, get, put } = useSubstituteRelationships();
  

  const headers = [
    {
      label: 'Skole',
      value: 'school',
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

  const schools = [
    {
      label: 'Holmestrand Videregående Skole',
      value: 'Holmestrand Videregående Skole'
    },
    {
      label: 'Greveskogen Videregående Skole',
      value: 'Greveskogen Videregående Skole'
    },
    {
      label: 'Færder Videregående Skole',
      value: 'Færder Videregående Skole'
    },
    {
      label: 'Sande Videregående Skole',
      value: 'Sande Videregående Skole'
    },
    {
      label: 'Thor Heyerdahl Videregående Skole',
      value: 'Thor Heyerdahl Videregående Skole'
    },
    {
      label: 'Re Videregående Skole',
      value: 'Re Videregående Skole'
    },
    {
      label: 'Melsom Videregående Skole',
      value: 'Melsom Videregående Skole'
    },
    {
      label: 'Nøtterøy Videregående Skole',
      value: 'Nøtterøy Videregående Skole'
    }
  ]

  const items = useMemo(() => {
    let rawItems = relationships
    rawItems.forEach((i, index) => {
      function Action () {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button size="small" onClick={() => onEditItem({...relationships[index]})} style={{minHeight: '25px', padding: '0 1rem'}}>Rediger</Button>
          </div>
        )
      }
      function SchoolCount () {
        return (
          <div>{i.permittedSchools?.length || 0}</div>
        )
      }

      i.elements = {
        actions: <Action />,
        schools: <SchoolCount />
      }
    })
    return rawItems
  }, [relationships])

  useEffect(() => {
    function getData () { get() }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onEditItem(item) {
    setEditedItem(item);
  }

  function onSchoolCheck(school) {
    if(!school || !editedItem) return;

    let item = {...editedItem}

    if(school === '*') {
      if(!item.permittedSchools.includes('*') && item.permittedSchools.length <= schools.length) item.permittedSchools = ['*'];
      else item.permittedSchools = []
    }
    else {
      item.permittedSchools = item.permittedSchools.filter((s) => s !== '*')
      if(item.permittedSchools.includes(school)) item.permittedSchools = item.permittedSchools.filter((s) => s !== school)
      else item.permittedSchools.push(school)
    }

    setEditedItem(item)
  }

  async function saveChange() {
    if(!editedItem._id) return;

    await put(editedItem)
    await get();

    setEditedItem(undefined)
  }

  return (
    <div>
      <div style={{color: 'white'}}>Her setter du opp hvilke skoler som for lov til å være vikar for hverandre</div>
      <Table headers={headers} items={items} showSelect={false} headerStyle={{textAlign: 'left'}} itemStyle={{textAlign: 'left'}}/>
      {
        editedItem && 
        <Dialog isOpen={editedItem !== undefined} onDismiss={() => setEditedItem(undefined)}>
          <DialogTitle>Endre forhold</DialogTitle>
          <DialogBody>
            <div>Her endrer du hvilke skoler lærere på <b>{editedItem.school}</b> kan være vikar for.</div>
            <div style={{height: '275px', maxHeight: '275px', marginTop: '1rem', overflowY: 'auto'}}>
            <div>
              <Checkbox
                label="Alle"
                checked={editedItem.permittedSchools?.includes('*') || editedItem.permittedSchools.length >= schools.length}
                onChange={() => {onSchoolCheck('*')}}
                style={{fontWeight: 'bold'}}
              />
            </div>
              {
                schools.filter((s) => s.value !== editedItem.school).map((s) => {
                  return (
                    <div key={s.value}>
                      <Checkbox checked={editedItem.permittedSchools?.includes('*') || editedItem.permittedSchools?.includes(s.value)} label={s.label} onChange={() => {onSchoolCheck(s.value)}} />
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