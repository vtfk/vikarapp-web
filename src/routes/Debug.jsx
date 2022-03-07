
// import ErrorDialog from '../components/ErrorField/ErrorDialog'
// import useError from '../components/ErrorField/useError'

import Select from "../components/Select";

export default function Debug() {
  // const { errors, remove, clear } = useError()

  const items = [
    {
      label: 'Test #1',
      value: 'test#1'
    },
    {
      label: 'Test #2',
      value: 'test#2'
    }
  ]

  return (
    <div>
      <Select label="År" placeholder="Gjør ett valg" hint="Dette er en test" items={items} required multiple disabled onSelectedItems={(e) => console.log('Selected items:',e) } />
      {/* <ErrorDialog errors={errors} onOk={(e) => { remove(e) }} onClear={() => { clear()}} /> */}
    </div>
  )
}