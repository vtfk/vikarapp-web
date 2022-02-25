import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { login } from '../../auth'

export default function useTeachers() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function search(term) {
    if(!term || typeof term !== 'string' || term.length <= 3) return;

    setIsLoading(true);

    const { bearerToken } = await login({ type: 'popup' })

    const request = {
      url: `${config.vikarAPIBaseurl}teachers/${term}`,
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
    } catch {
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  return { state, setState, search, isLoading }
}