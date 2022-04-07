import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';

export default function useTeacherTeams() {
  const [state, setState] = useState([]);
  const [isLoadingTeams, setIsLoading] = useState(false);
  const { add:addError } = useContext(ErrorContext)
  
  async function search(id) {
    if(!id || typeof id !== 'string' || id.length <= 8) return;

    setIsLoading(true);

    const { bearerToken } = await login({ type: 'popup' })

    const request = {
      url: `${config.VTFK_VIKARAPI_BASEURL}teacherteams/${id}?code=${config.VTFK_VIKARAPI_APPKEY}`,
      method: 'GET',
      headers: {
        Authorization: bearerToken
      }
    }

    try {
      const { data } = await axios.request(request);
      setState(data);
      setIsLoading(false);
      return data;
    } catch(err) {
      addError(err);
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  return { state, setState, search, isLoadingTeams }
}