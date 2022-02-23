import { SearchField } from "@vtfk/components";


export default function SubstituteRelationships() {
  return (
    <div>
      <div className="column-group">
        <SearchField rounded placeholder="Hvem skal være vikar?"/>
        <SearchField rounded placeholder="For hvilken lærer?"/>
      </div>
    </div>
  )
}