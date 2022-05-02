import { useState, createContext } from "react";
import { locale, localizations } from "../../localization";
import ErrorDialog from "./ErrorDialog";
import { createObjectWithOrderedKeys } from './lib/helpers'

export const ErrorContext = createContext()

export function ErrorProvider({children}) {
  const [errors, setErrors] = useState([])
  const [isShowDialog, setIsShowDialog] = useState(true)

  /**
   * Add an error to the queue
   * @param {Object || Error || String} error 
   */
   function add(error) {
    // If the error is nothig, just return
    if(!error) return;
    
    // If the error is a string, convert to object
    if(typeof error === 'string') {
      error = {
        message: error
      }
    }

    // If the error is not a object, return
    if(typeof error !== 'object') return;

    // If error is a axios error
    if(error.response?.data) error = error.response.data
    if(error.error) error = error.error

    // Any error object to a regular object
    let normalizedError = {}
    Object.getOwnPropertyNames(error).forEach((i) => normalizedError[i] = error[i])
    normalizedError = createObjectWithOrderedKeys(normalizedError, ['title', 'statuscode', 'message'], ['stack'])

    setErrors([...errors, normalizedError]);
  }

    /**
   * Removes an error at the given index, if none is provided i
   * @param {Integer} index Default 0
   */
     function remove(index = 0) {
      if(errors.length === 0) return
      index = parseInt(index);
      if(isNaN(index) || index === undefined || index === null) return;
  
      const newErrors = errors.filter((x, i) => i !== index)
      setErrors(newErrors);
    }
  
    /**
     * Clears all errors
     */
    function clear() {
      setErrors([])
    }


  return(
    <ErrorContext.Provider value={{errors, add, remove, clear, setIsShowDialog}}>
      { children }
      { isShowDialog && 
        <ErrorDialog
          errors={errors}
          onOk={(e) => { remove(e) }}
          onClear={() => { clear()}}
          okAllBtnText={ locale(localizations.components.errorDialog.okAllBtnText) }
          showDetailsBtnText={ locale(localizations.components.errorDialog.showDetailsBtnText) }
          hideDetailsBtnText={ locale(localizations.components.errorDialog.hideDetailsBtnText) }
        />
      }
    </ErrorContext.Provider>
  )
}