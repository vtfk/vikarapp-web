import { Switch } from '@vtfk/components'
import { useEffect, useState } from 'react'
import SubstitutionTable from '../../../components/SubstitutionTable/SubstitutionTable';
import useSubstitutions from '../../../hooks/useSubstitutions';
import { getValidToken } from '../../../auth'
import { locale, localizations } from '../../../localization';

export default function History() {
  /*
    State
  */
  const [wasSubstitute, setWasSubstitute] = useState(true);
  const [wasTeacher, setWasTeacher] = useState(false);

  /*
    Hooks
  */
  const { state:substitutions, isLoading, get } = useSubstitutions();

  /*
    useEffect
  */
  useEffect(() => {
    refresh();
  },[])

  useEffect(() => {
    refresh();
  }, [wasSubstitute, wasTeacher])

  /*
    Functions
  */
  async function refresh() {
    // Retreive the token
    const token = getValidToken();

    // Determine what to retreive
    const substituteUpn = wasSubstitute ? token.username : undefined;
    const teacherUpn = wasTeacher ? token.username : undefined;

    // Retreive
    await get(substituteUpn, teacherUpn)
  }


  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <div>
        <p className="description">{ locale(localizations.routes.history.headerSubtext) }</p>
        <h2 className='color-primary' style={{marginBottom: '0.5rem'}}>{ locale(localizations.routes.history.showSubstitutionWhere) }</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Switch label={locale(localizations.routes.history.iWasSubstitute)} isActive={wasSubstitute} onClick={() => { setWasSubstitute(!wasSubstitute); setWasTeacher(!wasTeacher) }}/>
          <Switch label={locale(localizations.routes.history.iHadSubstitute)} isActive={wasTeacher} onClick={() => { setWasSubstitute(!wasSubstitute); setWasTeacher(!wasTeacher) }}/>
        </div>
        <h2 className='color-primary' style={{marginTop: '1rem', marginBottom: '0.5rem'}}>{ locale(localizations.substitute) }</h2>
      </div>
      <div style={{ flexGrow: 1, overflow: 'auto'}}>
        <SubstitutionTable items={substitutions} isLoading={isLoading} />
      </div>
    </div>
  )
}