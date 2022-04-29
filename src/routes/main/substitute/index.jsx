import { Button } from '@vtfk/components'
import { useState } from 'react'
import { Table } from '@vtfk/components'
import {
  Link, useNavigate
} from "react-router-dom";
import useTeacherTeams from '../../../hooks/useTeacherTeams';
import useSubstitutions from '../../../hooks/useSubstitutions';
import { login } from '../../../auth'
import PersonSearchField from '../../../components/PersonSearchField';
import { getValidToken } from '../../../auth'

export default function Substitute () {
  const [selectedTeacher, setSelectedTeacher] = useState(undefined);
  const [availableTeams, setAvailableTeams] = useState([])
  const [hiddenTeams, setHiddenTeams] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [showHiddenTeams, setShowHiddenTeams] = useState(false);
  
  const navigate = useNavigate()
  const { search:searchTeacherTeams, isLoadingTeams} = useTeacherTeams();
  const { post:postSubstitutions } = useSubstitutions();

  // Table headers
  const headers = [
    {
      label: 'Team',
      value: 'displayName',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    },
    {
      label: 'Beskrivelse',
      value: 'description',
      style: {textAlign: 'left'},
      itemStyle: {textAlign: 'left'}
    }
  ]

  async function activateSubstitution() {
    // Input validation
    if(!selectedTeacher) {
      alert('Du må velge en lærer du skal være vikar for');
      return;
    }
    if(!selectedTeams || !Array.isArray(selectedTeams) || selectedTeams.length === 0) {
      alert('Du må velge velge en eller flere klasse å vikariere for');
      return;
    }

    // Verify that the request should be made
    let message = `Ønsker du å vikarere for lærer ${selectedTeacher.displayName}?\n\n`
    message += 'Klasser:\n'
    selectedTeams.map((t) => message += `${t.displayName}\n`)
    if(!window.confirm(message)) return;

    const token = await login({ type: 'popup'} )

    const substitutions = selectedTeams.map((i) => {
      return {
        substituteUpn: token.username,
        teacherUpn: selectedTeacher.userPrincipalName,
        teamId: i.id
      }
    })

    // Make the request
    const data = await postSubstitutions(substitutions)

    // Route back to the front page
    if(data) {
      navigate('/')
    }
  }

  async function onSelectedTeacherChanged(e) {
    setSelectedTeacher(e);
    if(e?.userPrincipalName) {
      // Retreive all of the substitutes teams
      const token = getValidToken();
      const ownTeams = await searchTeacherTeams(token.username);
      let ownTeamIds = ownTeams.map((i) => i.id);

      // Get all the teacher teams
      const allTeams = await searchTeacherTeams(e.userPrincipalName);

      // Filter out teams that the teacher is already a member of
      const teamsToShow = [];
      const teamsToHide = [];
      for(const team of allTeams) {
        if(!ownTeamIds.includes(team.id)) teamsToShow.push(team);
        else teamsToHide.push(team);
      }

      setAvailableTeams(teamsToShow);
      setHiddenTeams(teamsToHide);
    } else {
      setAvailableTeams([]);
    }
  }

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
      <div style={{flexGrow: '1'}}>

      <p className="description">Søk opp en lærer og start ett eller flere vikariat</p>
      <PersonSearchField 
        placeholder="Søk etter læreren du skal være vikar for"
        onSelected={(e) => { onSelectedTeacherChanged(e) }}
      />
      {
        <Table
          headers={headers}
          items={availableTeams}
          itemId="id"
          isLoading={isLoadingTeams}
          selectOnClick
          showSelect
          onSelectedItemsChanged={(e) => { setSelectedTeams(e)}}
          noDataText={'Ingen teams er funnet'}
          mobileHeaderText="Teams"
          style={{marginTop: '2rem', height: 'auto'}}
        />
      }
      { hiddenTeams.length > 0 && 
      <div style={{marginTop: '1rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '0.5rem'}}>
        Vi har skjult {hiddenTeams.length} teams som du allerede er medlem av
        <Button size="small" onClick={() => setShowHiddenTeams(!showHiddenTeams)}>{!showHiddenTeams ? 'Se skjulte teams' : 'Skjul'}</Button>
        {
          showHiddenTeams &&
          <div>
            {
              hiddenTeams.map((i, idx) => {
                return (
                  <div key={idx}>
                    { i.displayName }
                  </div>
                )
              })
            }
          </div>
        }
      </div>
      }
      </div>
      {
      <div className='main-footer-button-group'>
        <Button disabled={selectedTeams.length === 0} onClick={() => activateSubstitution()}>Aktiver vikariat</Button>
        <Link to="/">
          <Button>Avbryt</Button>
        </Link>
      </div>
      }
    </div>
  )
}