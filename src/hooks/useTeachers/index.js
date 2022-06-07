import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';

export default function useTeachers() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { add:addError } = useContext(ErrorContext)

  async function search(term, returnSelf) {
    try {
      if(!term || typeof term !== 'string' || term.length <= 2) return [];

      setIsLoading(true);

      const { bearerToken } = await login({ type: 'popup' })

      let query = ''
      if(returnSelf) query += 'returnSelf=true'

      const request = {
        url: `${config.VTFK_VIKARAPI_BASEURL}teachers/${term}?code=${config.VTFK_VIKARAPI_APPKEY}&${query}`,
        method: 'GET',
        headers: {
          Authorization: bearerToken
        }
      }

      const { data } = await axios.request(request);
      setState(data);
      setIsLoading(false);
      return data
    } catch(err) {
      addError(err)
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  return { state, setState, search, isLoading }
}