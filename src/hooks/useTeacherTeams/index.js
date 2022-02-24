import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { getValidBearerToken, login } from '../../auth'

export default function useTeacherTeams() {
  const [state, setState] = useState([]);
  const [isLoadingTeams, setIsLoading] = useState(false);

  async function search(id) {
    if(!id || typeof id !== 'string' || id.length <= 8) return;

    setIsLoading(true);

    const token = getValidBearerToken();
    if(!token) await login({ type: 'popup' })

    const request = {
      url: `${config.vikarAPIBaseurl}teacherteams/${id}`,
      method: 'GET',
      headers: {
        Authorization: token
      }
    }

    try {
      const { data } = await axios.request(request);
      setState(data);
      setIsLoading(false);
      return data;
    } catch {
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  return { state, setState, search, isLoadingTeams }
}