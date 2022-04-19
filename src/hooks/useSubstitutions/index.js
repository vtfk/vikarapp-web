import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';

export default function useSubstitutions() {
  const [state, setState] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { add:addError } = useContext(ErrorContext)

  /**
   * Get substitutions
   * @param {String=} substituteUpn 
   * @param {String=} teacherUpn 
   * @param {String=} status 
   */
  async function get(substituteUpn, teacherUpn, status, years) {
    setIsLoading(true);

    const { bearerToken} = await login({ type: 'popup' })

    // Setup query parameters
    let queryParams = [];
    if(substituteUpn) queryParams.push(`substituteUpn=${substituteUpn}`)
    if(teacherUpn) queryParams.push(`teacherUpn=${teacherUpn}`)
    if(status) queryParams.push(`status=${status}`)
    if(years) queryParams.push(`years=${years}`)

    let query = '';
    for(let i = 0; i < queryParams.length; i++) {
      query += '&' + queryParams[i]
    }

    // Create the request
    const request = {
      url: `${config.VTFK_VIKARAPI_BASEURL}substitutions?code=${config.VTFK_VIKARAPI_APPKEY}${query}`,
      method: 'GET',
      headers: {
        Authorization: bearerToken
      }
    }

    // Make the request
    try {
      const { data } = await axios.request(request);
      console.log('Substitutions', data)
      // Set the state
      setState(data)
      setIsLoading(false)
      return data
    } catch (err) {
      addError(err)
    }
  }

  /**
   * 
   * @param {Object} teacherUpn
   * @param {[Object]} substitutions
   * @param {String} substitutions.teacherUpn
   * @param {String} substitutions.teamIds
   */
  async function post(substitutions) {
    try {
      // Input validation
      if(!substitutions || !Array.isArray(substitutions) || substitutions.length === 0) throw new Error('Vikariat kan ikke være tomt');
      for(const substitution of substitutions) {
        if(!substitution.substituteUpn) throw new Error(`Kan ikke fornye vikariat fordi substituteUpn mangler`)
        if(!substitution.teacherUpn) throw new Error(`Kan ikke fornye vikariat fordi teacherUpn mangler`)
        if(!substitution.teamId) throw new Error(`Kan ikke fornye vikariat for fordi teamId mangler`)
      }

      const { bearerToken} = await login({ type: 'popup' })

      // Create the request
      const request = {
        url: `${config.VTFK_VIKARAPI_BASEURL}substitutions?code=${config.VTFK_VIKARAPI_APPKEY}`,
        method: 'POST',
        headers: {
          Authorization: bearerToken
        },
        data: substitutions
      }

      // Make the request
      const { data } = await axios.request(request);
      return data;
    } catch (err) {
      addError(err)
      throw err;
    }
  }

  return { state, get, post, isLoading }
}