import config from '../../config'
import axios from "axios";
import { login } from '../../auth'
import { useContext, useState } from "react";
import { ErrorContext } from '../../components/ErrorField/ErrorContext';

export default function useLogs() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { add:addError } = useContext(ErrorContext)

  async function get(from, to) {
    setIsLoading(true);

    const { bearerToken} = await login({ type: 'popup' })

    const request = {
      url: `${config.VTFK_VIKARAPI_BASEURL}logs?code=${config.VTFK_VIKARAPI_APPKEY}`,
      method: 'GET',
      headers: {
        Authorization: bearerToken
      }
    }

    let query = '';
    if(from && to) query += `from=${from.toISOString()}&to=${to.toISOString()}` 
    if(query) {
      query = '&' + query;
      request.url += query;
    }

    try {
      const { data } = await axios.request(request);
      setState(data);
      setIsLoading(false);
      return data;
    } catch(err) {
      addError(err)
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  return { state, isLoading, get }
}