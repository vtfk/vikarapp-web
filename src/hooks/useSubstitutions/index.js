import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';
import { LoadingContext } from '../../components/LoadingDialog/LoadingContext';
import { toast } from 'react-toastify'
import { locale, localizations } from '../../localization';

export default function useSubstitutions() {
  const [state, setState] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { add:addError } = useContext(ErrorContext)
  const { add:addLoading, complete:completeLoading } = useContext(LoadingContext)

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
    let loadingId = undefined;
    try {
      // Input validation
      if(!substitutions || !Array.isArray(substitutions) || substitutions.length === 0) throw new Error('Cannot renew substitution because no request was provided');
      for(const substitution of substitutions) {
        if(!substitution.substituteUpn) throw new Error(`Cannot renew substitution because 'substituteUpn'-property is missing`)
        if(!substitution.teacherUpn) throw new Error(`Cannot renew substitution because 'teacherUpn'-property is missing`)
        if(!substitution.teamId) throw new Error(`Cannot renew substitution because 'teamId'-property is missing`)
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
      loadingId = addLoading({ message: 'test' })
      const { data } = await axios.request(request);
      completeLoading(loadingId)
      toast.success(locale(localizations.terms.actionWasSuccessful))
      return data;
    } catch (err) {
      completeLoading(loadingId);
      addError(err);
      throw err;
    }
  }

  return { state, get, post, isLoading }
}