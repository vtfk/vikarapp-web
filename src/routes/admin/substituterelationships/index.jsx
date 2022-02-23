import { Button, Dialog, DialogActions, DialogBody, DialogTitle, IconButton } from "@vtfk/components";
import { useEffect, useState } from "react";
import Table from "../../../components/Table";
import useSubstituteRelationships from "../../../hooks/useSubstituteRelationships"

export default function SubstituteRelationships() {
  const [items, setItems] = useState([])
  const [editedItem, setEditedItem] = useState(undefined);

  const { state:relationships, get } = useSubstituteRelationships();
  

  const headers = [
    {
      label: 'Skole',
      value: 'school',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    },
    {
      label: 'Skoler',
      value: 'schools',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    },
    {
      label: 'Handlinger',
      value: 'actions',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    }
  ]

  useEffect(async () => {
    let rawItems = await get();

    rawItems.forEach((i) => {
      i.elements = {}

      function Action () {
        return (
          <IconButton size="small" onClick={() => onEditItem(i)} />
        )
      }

      i.elements.actions = <Action />
    })

    setItems(rawItems)
  }, [])

  function onEditItem(item) {
    setEditedItem(item);
  }

  return (
    <div>
      <div style={{color: 'white'}}>Her setter du opp hvilke skoler som for lov til å være vikar for hverandre</div>
      <Table headers={headers} items={items} showSelect={false} />
      {
        editedItem && 
        <Dialog isOpen={editedItem !== undefined} onDismiss={() => setEditedItem(undefined)}>
          <DialogTitle>Endre forhold</DialogTitle>
          <DialogBody>
            <div>Her endrer du hvem lærer på <b>{editedItem.school}</b> kan være vikar for.</div>
          </DialogBody>
          <DialogActions>
            <Button size="small">Lagre</Button>
            <Button size="small" onClick={() => setEditedItem(undefined)}>Avbryt</Button>
          </DialogActions>
        </Dialog>
      }
      
    </div>
  )
}