import config from '../../config'
import axios from "axios";
import { useState } from "react";
import { getValidBearerToken, login } from '../../auth'

export default function useSubstituteRelationships() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function get() {
    setIsLoading(true);

    const token = getValidBearerToken();
    if(!token) await login({ type: 'popup' })

    const request = {
      url: `${config.vikarAPIBaseurl}substituterelationships`,
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

  async function put(item) {
    if(!item?._id) throw new Error('The provided item must have a id')

    const token = getValidBearerToken();
    if(!token) await login({ type: 'popup' })

    delete item.elements;

    const request = {
      url: `${config.vikarAPIBaseurl}substituterelationships/${item._id}`,
      method: 'PUT',
      headers: {
        Authorization: token
      },
      data: item
    }

    // Update the relationship
    await axios.request(request);
  }

  return { state, setState, get, put, isLoading }
}