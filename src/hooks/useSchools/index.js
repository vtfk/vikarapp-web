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
      url: `${config.VTFK_VIKARAPI_BASEURL}schools?code=${config.VTFK_VIKARAPI_APPKEY}`,
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

    delete item._elements;

    const request = {
      url: `${config.VTFK_VIKARAPI_BASEURL}schools/${item._id}`,
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
      throw err;
    }
  }

  async function post(school) {
    try {
      // Validation
      if(!school) throw new Error('Kan ikke opprette en ny skole når school er tom')
      if(!school.name) throw new Error(`Kan ikke opprette ny skole når 'name' er tomt`)

      // Ensure valid token
      const { bearerToken} = await login({ type: 'popup' })

      // Prepare the request
      const request = {
        url: `${config.VTFK_VIKARAPI_BASEURL}schools`,
        method: 'POST',
        headers: {
          Authorization: bearerToken
        },
        data: school
      }

      // Make the request
      const { data } = await axios.request(request);

      // Return the data
      return data
    } catch (err) {
      addError(err)
      throw err;
    }
  }

  return { state, setState, get, post, put, isLoading }
}