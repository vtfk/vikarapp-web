import Table from "../../../components/Table";

export default function SubstituteRelationships() {
  
  const headers = [
    {
      label: 'Skole',
      value: 'school'
    },
    {
      label: 'Skoler',
      value: 'schools'
    }
  ]
  
  return (
    <div>
      <Table headers={headers} />
    </div>
  )
}