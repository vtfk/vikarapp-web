import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { login } from '../../auth'

export default function useSubstitutions() {
  const [state, setState] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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
    const { data } = await axios.request(request);

    // Set the state
    setState(data)

    return data
  }

  /**
   * 
   * @param {Object} teacherUpn
   * @param {[Object]} substitutions
   * @param {String} substitutions.teacherUpn
   * @param {String} substitutions.teamIds
   */
  async function post(substituteUpn, substitutions) {
    // Input validation
    if(!substituteUpn) throw new Error('Vikariat kan ikke registreres, substituteteacherUpn mangler');
    if(!substitutions) throw new Error('Vikariat kan ikke registreres, teamdId mangler');
    if(!Array.isArray(substitutions)) throw new Error('substitutions må være av type array');
    substitutions.forEach((sub) => {
      if(!sub.teacherUpn) throw new Error('teacherUpn kan ikke være tomt');
      if(!sub.teamId) throw new Error(`teamId kan ikke være tomt`)
    })

    const { bearerToken} = await login({ type: 'popup' })

    // Create the request
    const request = {
      url: `${config.vikarAPIBaseurl}substitutions`,
      method: 'POST',
      headers: {
        Authorization: bearerToken
      },
      data: {
        substituteUpn,
        substitutions
      }
    }

    // Make the request
    const { data } = await axios.request(request);
    return data;
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