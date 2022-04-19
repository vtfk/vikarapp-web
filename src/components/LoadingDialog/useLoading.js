import { useContext } from "react";
import { LoadingContext } from "./LoadingContext";

export default function useLoading() {
  const { queue, add:addLoading, complete:completeLoading, clear:clearLoadings } = useContext(LoadingContext)

  /**
   * Add an error to the queue
   * @param {Object || Error || String} loadig 
   */
  function add(loading) {
    // If the error is nothig, just return
    if(!loading) return;
    const id = addLoading(loading);
    return id;
  }


  /**
   * Removes an error at the given index, if none is provided i
   * @param {Integer} index Default 0
   */
  function complete(id) {
    completeLoading(id);
  }

  /**
   * Clears all errors
   */
  function clear() {
    clearLoadings();
  }

  return { queue, add, complete, clear }
}