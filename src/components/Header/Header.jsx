import './style.css'
import { Dialog, DialogBody, DialogTitle, IconButton } from "@vtfk/components";
import { useNavigate, useLocation } from "react-router-dom"
import { hasRole } from '../../auth'
import { useState } from 'react';
import Select from '../Select';
import { getCurrentLaguage, locale, localizations, setLanguage } from '../../localization';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);
  
  let isAdmin = false;

  if(['development', 'test'].includes(process.env.NODE_ENV)) isAdmin = true;
  isAdmin = isAdmin || hasRole(['App.Admin', 'App.Config'])

  const languages = [
    {
      label: 'Norsk Bokmål',
      value: 'nb'
    },
    {
      label: 'Nynorsk',
      value: 'nn'
    },
    {
      label: 'English',
      value: 'en'
    }
  ]

  function handleLanguageChange(e) {
    setLanguage(e);
    window.location.reload(false);
  }

  return (
    <div className="header">
      <div className='header-item header-item-1'>
        {
          location && location.pathname !== '/' &&
          <div className='header-button'>
            <IconButton icon="arrowLeft" onClick={() => navigate(-1)}/>
            Tilbake
          </div>
        }
      </div>
      <div className='header-item header-item-2'>
        <h1 className='header-title' style={{margin: 0, fontSize: '3rem'}} onClick={() => navigate('/')}>VikarApp</h1>
      </div>
      <div className='header-item header-item-3'> 
        {
          isAdmin && 
          <div className='header-button'>
            <IconButton icon="lock" onClick={() => navigate('/admin')} />
            Admin
          </div>
        }
        <div className='header-button'>
          <IconButton icon="settings" onClick={() => setShowSettings(true)} />
          Innstillinger
        </div>
      </div>
      <Dialog isOpen={showSettings} onDismiss={() => setShowSettings(false)} draggable style={{minWidth: '30%'}} height="30%">
        <DialogTitle>{ locale(localizations.words.settings) }</DialogTitle>
        <DialogBody>
          <div style={{color: 'red'}}>{ locale(localizations.components.settings.warning) } </div>
          <table style={{textAlign: 'left'}}>
            <tbody>
              <tr>
                <th style={{width: '100px'}}>{ locale(localizations.words.language) }</th>
                <td>
                  <Select selected={[getCurrentLaguage()]} items={languages} itemValue="value" style={{width: '250px'}} onChange={(e) => handleLanguageChange(e) } />
                </td>
              </tr>
            </tbody>
          </table>
        </DialogBody>
      </Dialog>
    </div>
  )
}