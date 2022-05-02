import { useEffect, useMemo, useState } from "react"
import PersonSearchField from "../PersonSearchField"
import Select from "../Select"
import useSubstitutions from "../../hooks/useSubstitutions"
import { getValidToken } from "../../auth"
import './style.css'
import SubstitutionTable from "../SubstitutionTable/SubstitutionTable"
import { locale, localizations } from "../../localization"

export default function History() {
  const [ selectedStatuses, setSelectedStatuses ] = useState([])
  const [ selectedYears, setSelectedYears ] = useState([])
  const { state:substitutions, get:getSubstitutions, isLoading:isSubsitutionLoading } = useSubstitutions()
  const [ selectedSubstitute, setSelectedSubstitute ] = useState()
  const [ selectedTeacher, setSelectedTeacher ] = useState()
  const [ hasInitialized, setHasInitialized ] = useState(false);

  const isAdmin = ['development', 'test'].includes(process.env.NODE_ENV) || getValidToken()?.roles?.includes('App.Admin')

  const allStatuses = [
    {
      label: locale(localizations.components.history.statuses.pending),
      value: 'pending'
    },
    {
      label: locale(localizations.components.history.statuses.active),
      value: 'active'
    },
    {
      label: locale(localizations.components.history.statuses.expired),
      value: 'expired'
    }
  ]

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
    <div className="history-column-group" style={{overflow: 'auto'}}>
      <div>
        <h2 style={{margin: '0', color: '#FFBF00'}}>{ locale(localizations.words.filters) }</h2>
        <div className="column-group" style={{gap: '1rem'}}>
        <div className="history-input-group">
          { isAdmin &&
            <PersonSearchField
              placeholder={ locale(localizations.words.substitute) }
              returnSelf
              onSelected={(e) => setSelectedSubstitute(e)}
            />
          }
          <PersonSearchField
            placeholder={ locale(localizations.words.teacher) }
            returnSelf
            onSelected={(e) => setSelectedTeacher(e)}
          />
        </div>
        <div className="history-input-group">
          <Select
            placeholder={ locale(localizations.components.history.chooseStatuses) }
            items={allStatuses}
            selected={selectedStatuses}
            multiple
            onChange={(e) => setSelectedStatuses(e)}
          />
          <Select
            placeholder={ locale(localizations.components.history.chooseYears) }
            items={availableYears}
            multiple
            onChange={(e) => setSelectedYears(e)}
          />
        </div>
      </div>
      </div>

      <h2 style={{margin: '0', marginTop: '0.75rem', color: '#FFBF00'}}>{ locale(localizations.words.substitutions)}</h2>
      <div style={{flexGrow: '1', overflow: 'auto'}}>
        <div >
          <SubstitutionTable
            items={substitutions}
            mobileHeaderText="Historikk"
            isLoading={isSubsitutionLoading}
            showSubstitute
            style={{overflow: 'auto'}}
          />
        </div>
      </div>


    </div>
  )
}