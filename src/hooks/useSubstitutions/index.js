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
  async function get(substituteUpn, teacherUpn, status) {
    setIsLoading(true);

    const { bearerToken} = await login({ type: 'popup' })

    // Setup query parameters
    let queryParams = [];
    if(substituteUpn) queryParams.push(`substituteUpn=${substituteUpn}`)
    if(teacherUpn) queryParams.push(`teacherUpn=${teacherUpn}`)
    if(status) queryParams.push(`status=${status}`)

    let query = '';
    for(let i = 0; i < queryParams.length; i++) {
      if(i === 0) query += '?'
      query += queryParams[i]
    }

    // Create the request
    const request = {
      url: `${config.vikarAPIBaseurl}substitutions${query}`,
      method: 'GET',
      headers: {
        Authorization: bearerToken
      }
    }

    // Make the request
    try {
      const { data } = await axios.request(request);
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
        url: `${config.vikarAPIBaseurl}substitutions`,
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


/*
  Mulige måter å sette dette opp på

{
  "_id": "",
  "status": "pending || active || expired",
  "teamId": "",
  "teamName": "",
  "substituteteacherUpn": "",
  "substituteTeacherName": "",
  "teacherUpn": "",
  "teacherName": "",
  "expirationTimestamp": ""
}

{
  "_id": "",
  "teamId": "",
  "teamName": "",
  "substitutions": [
    {
      "_id": "",
      "teacherUpn": "",
      "teacherName": "",
      "expirationTimestamp": ""
    }
  ]
}

{
  "_id": "",
  "teacherUpn": "",
  "teacherName": "",
  "substitutions": [
    {
      "teamId": "",
      "teamName": "",
      "expirationTimestamp": ""
    }
  ]
}
*/