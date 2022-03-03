import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';

export default function useSchools() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { add:addError } = useContext(ErrorContext)

  async function get() {
    setIsLoading(true);

    const { bearerToken} = await login({ type: 'popup' })

    const request = {
      url: `${config.vikarAPIBaseurl}schools`,
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
      addError(err)
      setState([]);
      setIsLoading(false);
      return [];
    }
  }

  async function put(item) {
    if(!item?._id) throw new Error('The provided item must have a id')

    const { bearerToken} = await login({ type: 'popup' })

    delete item.elements;

    const request = {
      url: `${config.vikarAPIBaseurl}substituterelationships/${item._id}`,
      method: 'PUT',
      headers: {
        Authorization: bearerToken
      },
      data: item
    }

    // Update the relationship
    try {
      await axios.request(request);
    } catch (err) {
      addError(err)
    }
  }

  return { state, setState, get, put, isLoading }
}