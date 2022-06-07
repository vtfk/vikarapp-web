import { Button } from '@vtfk/components'
import { useEffect, useMemo, useState } from 'react'
import './style.css'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function ErrorField({ error, showDetails = false, showDetailsButton}) {
  /*
    State
  */
  const [isShowDetails, setIsShowDetails] = useState(showDetails || false)
  const [isShowDetailsButton, setIsShowDetailsButton] = useState(showDetailsButton || false)

  /*
    UseEffect
  */
  useEffect(() => {
    if(showDetails !== undefined) setIsShowDetails(showDetails)
    if(showDetailsButton !== undefined) setIsShowDetailsButton(showDetailsButton)
  }, [showDetails, showDetailsButton])

  /*
    Computed
  */
  const title = useMemo(() => {
    let defaultTitle = 'En feil har oppstått' 
    if(!error) return defaultTitle

    if(error.title) return error.title;
    if(error.data?.title) return error.data.title;

    return defaultTitle;
  }, [error])

  const message = useMemo(() => {
    if(!error) return;

    if(error.message) return error.message;
    if(error.data?.message) return error.data.message;

    return;
  }, [error])

  const statuscode = useMemo(() => {
    if(!error) return

    if(error.code) return error.code;
    if(error.statusCode) return error.statusCode;
    if(error.status) return error.status;

    return;
  }, [error])

  const stack = useMemo(() => {
    if(!error) return

    if(error.stack) return error.stack
    if(error.data?.stack) return error.data.stack

    return
  }, [error])

  const stringyfiedError = useMemo(() => {
    if(!error) return;
    if(typeof error !== 'object') return

    return JSON.stringify(error, null, 2);
  }, [error])

  return (
    <div className="vtfk-errorfield">
      <h1 className='vtfk-errorfield-title'>{ title }</h1>
      { statuscode && <div className='vtfk-errorfield-statuscode'><b>Status:</b> {statuscode}</div>}
      { message && <h3 className='vtfk-errorfield-message'>{ message }</h3> }
      { isShowDetails &&
        <div style={{width: '100%'}}>
          {
            stack &&
            <div className='vtfk-errorfield-details'>
              <h3 style={{margin: '0'}}>Stack:</h3>
              {stack}
            </div>
          }
          {
            stringyfiedError &&
            <div className='vtfk-errorfield-details' style={{maxWidth: '100%', width: '100%'}}>
              <h3 style={{margin: '0'}}>Full feilmelding:</h3>
              <SyntaxHighlighter language='json' style={docco} customStyle={{ background: 'none', overflowX: 'none', marginTop: '0' }} >{stringyfiedError}</SyntaxHighlighter>
            </div>
          }
        </div>
      }
      { isShowDetailsButton && 
      <div className='vtfk-errorfield-buttons'>
        { isShowDetailsButton && <Button size="small" onClick={() => { setIsShowDetails(!isShowDetails) }}>{ !isShowDetails ? 'Vis detaljer' : 'Skjul detaljer'}</Button> }
      </div>
      }
    </div>
  )
}