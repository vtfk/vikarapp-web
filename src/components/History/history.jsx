import { useEffect, useMemo, useState } from "react"
import PersonSearchField from "../PersonSearchField"
import Select from "../Select"
import useSubstitutions from "../../hooks/useSubstitutions"
import { getValidToken } from "../../auth"
import './style.css'
import SubstitutionTable from "../SubstitutionTable/SubstitutionTable"

const allStatuses = [
  {
    label: 'Venter',
    value: 'pending'
  },
  {
    label: 'Aktiv',
    value: 'active'
  },
  {
    label: 'Utløpt',
    value: 'expired'
  }
]

export default function History() {
  const [ selectedStatuses, setSelectedStatuses ] = useState([])
  const [ selectedYears, setSelectedYears ] = useState([])
  const { state:substitutions, get:getSubstitutions } = useSubstitutions()
  const [ selectedSubstitute, setSelectedSubstitute ] = useState()
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ hasInitialized, setHasInitialized ] = useState(false);

  const isAdmin = ['development', 'test'].includes(process.env.NODE_ENV) || getValidToken()?.roles?.includes('App.Admin')

  /*
    Use effect
  */
  useEffect(() => {
    async function load() {
      // Only make a general search when admin
      if(getValidToken()?.roles?.includes('App.Admin')) await getSubstitutions()
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load data when filtering options change
  useEffect(() => {
    if(!hasInitialized) {
      setHasInitialized(true);
      return;
    }

    // Retreive the data
    getSubstitutions(selectedSubstitute?.userPrincipalName, selectedTeacher?.userPrincipalName, selectedStatuses, selectedYears)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubstitute, selectedTeacher, selectedStatuses, selectedYears])

  /*
    Memos
  */
  const availableYears = useMemo(() => {
    if(!substitutions) return []

    const thisYear = new Date().getFullYear();
    const years = [];
    for(let i = 2020; i <= thisYear; i++) {
      years.push(i);
    }

    return years.map((y) => {return {label: y, value: y}})
  }, [substitutions])

  /*
    Functions
  */

  return(
    <div className="column-group">
      <h2 style={{margin: '0', color: '#FFBF00'}}>Filtrering</h2>
      <div className="history-input-group">
        { isAdmin &&
          <PersonSearchField
            placeholder="Vikar"
            returnSelf
            onSelected={(e) => setSelectedSubstitute(e)}
          />
        }
        <PersonSearchField
          placeholder="Lærer"
          returnSelf
          onSelected={(e) => setSelectedTeacher(e)}
        />
      </div>
      <div className="history-input-group">
        <Select
          placeholder="Velg statuser"
          items={allStatuses}
          selected={selectedStatuses}
          multiple
          onChange={(e) => setSelectedStatuses(e)}
        />
        <Select
          placeholder="Velg år"
          items={availableYears}
          multiple
          onChange={(e) => setSelectedYears(e)}
        />
      </div>
      <h2 style={{margin: '0', color: '#FFBF00'}}>Vikariat</h2>
      <SubstitutionTable
        items={substitutions}
        mobileHeaderText="Historikk"
        showSubstitute
      />
    </div>
  )
}