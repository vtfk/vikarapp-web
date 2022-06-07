import config from '../../config'
import axios from "axios";
import { useContext, useState } from "react";
import { login } from '../../auth'
import { ErrorContext } from '../../components/ErrorField/ErrorContext';
import { LoadingContext } from '../../components/LoadingDialog/LoadingContext';
import { toast } from 'react-toastify'
import { locale, localizations } from '../../localization';

export default function useSchools() {
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { add:addError } = useContext(ErrorContext)
  const { add:addLoading, complete:completeLoading, clear:clearLoading } = useContext(LoadingContext)

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
      url: `${config.VTFK_VIKARAPI_BASEURL}schools/${item._id}?code=${config.VTFK_VIKARAPI_APPKEY}`,
      method: 'PUT',
      headers: {
        Authorization: bearerToken
      },
      data: item
    }

    // Update the relationship
    try {
      const loadingId = addLoading({ message: '' })
      await axios.request(request);
      toast.success(locale(localizations.terms.actionWasSuccessful))
      completeLoading(loadingId)
    } catch (err) {
      clearLoading();
      addError(err)
      throw err;
    }
  }

  async function post(school) {
    try {
      // Validation
      if(!school) throw new Error(`Cannot create a new school when 'school'-property is empty`)
      if(!school.name) throw new Error(`Cannot create a new school when 'name'-property is empty`)

      // Ensure valid token
      const { bearerToken} = await login({ type: 'popup' })

      // Prepare the request
      const request = {
        url: `${config.VTFK_VIKARAPI_BASEURL}schools?code=${config.VTFK_VIKARAPI_APPKEY}`,
        method: 'POST',
        headers: {
          Authorization: bearerToken
        },
        data: school
      }

      // Make the request
      const loadingId = addLoading({ message: '' })
      const { data } = await axios.request(request);
      completeLoading(loadingId)
      toast.success(locale(localizations.terms.actionWasSuccessful))
      // Return the data
      return data
    } catch (err) {
      clearLoading();
      addError(err)
      throw err;
    }
  }

  return { state, setState, get, post, put, isLoading }
}