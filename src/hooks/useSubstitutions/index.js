import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { login } from '../../auth'

export default function useSubstitutions() {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Get substitutions
   * @param {String=} teamId 
   * @param {String=} teacherId 
   */
  async function get(teamId, teacherId) {
    setIsLoading(true);

    const { bearerToken} = await login({ type: 'popup' })

    // Setup query parameters
    let queryParams = [];
    if(teamId) queryParams.push(`teamId=${teamId}`)
    if(teacherId) queryParams.push(`teacherId=${teacherId}`)

    let query = '';
    for(let i = 0; i < queryParams.length; i++) {
      if(i === 0) query += '?'
      query += queryParams[i]
    }

    // Create the request
    const request = {
      url: `${config.vikarAPIBaseurl}substitutes${query}`,
      method: 'GET',
      headers: {
        Authorization: bearerToken
      }
    }

    // Make the request
    const { data } = await axios.request(request);

    return data
  }

  return { get, post, isLoading }
}

/**
 * 
 * @param {Object} teacherId
 * @param {String} substituteTeacherId
 * @param {[String]} teamIds
 */
async function post(teacherId, substituteTeacherId, teamIds) {
  // Input validation
  if(!teamIds) throw new Error('Vikariat kan ikke registreres, teamdId mangler');
  if(!teacherId) throw new Error('Vikariat kan ikke registreres, teacherId mangler');
  if(!substituteTeacherId) throw new Error('Vikariat kan ikke registreres, substituteTeacherId mangler');
  if(!Array.isArray(teamIds)) throw new Error('teamIds må være av type array');
  teamIds.forEach((id) => {
    if(id === '') throw new Error('TeamId cannot be empty');
    if(id.length < 35) throw new Error(`TeamId ${id} is not valid`)
  })

  const { bearerToken} = await login({ type: 'popup' })

  // Create the request
  const request = {
    url: `${config.vikarAPIBaseurl}substitutes`,
    method: 'POST',
    headers: {
      Authorization: bearerToken
    },
    data: {
      teacherId,
      substituteTeacherId,
      teamIds
    }
  }

  console.log('Request:', request)

  // Make the request
  // const { data } = await axios.request(request);

  // return data;
}

/*
  Mulige måter å sette dette opp på

{
  "_id": "",
  "status": "pending || active || expired",
  "teamId": "",
  "teamName": "",
  "substituteTeacherId": "",
  "substituteTeacherName": "",
  "teacherId": "",
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
      "teacherId": "",
      "teacherName": "",
      "expirationTimestamp": ""
    }
  ]
}

{
  "_id": "",
  "teacherId": "",
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