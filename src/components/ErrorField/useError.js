import { useState } from "react";

export default function useError() {
  // Array that keeps all reported errors
  const [errors, setErrors] = useState([])

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

    // Add the error to the errors-array
    const newErrors = JSON.parse(JSON.stringify(errors));
    newErrors.push(error);

    setErrors(newErrors);
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

  return { errors, add, remove, clear }
}