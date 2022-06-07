import { nanoid } from "nanoid";
import { useState, createContext } from "react";
import LoadingDialog from "./LoadingDialog";

export const LoadingContext = createContext()

export function LoadingProvider({children}) {
  const [queue, setQueue] = useState([])
  const [isShowDialog, setIsShowDialog] = useState(true)

  /**
   * Add an error to the queue
   * @param { String } options
   * @param { String } options.title
   * @param { String } options.message
   * @param { String } options.submessage
   */
   function add(options = {}) {
    // Input validation
    if(!options || typeof options !== 'object' || Object.keys(options).length === 0) return;

    // Create a unique id for the entry
    options.id = nanoid();

    // Update the queue
    const newItems = JSON.parse(JSON.stringify(queue));
    newItems.push(options);

    setQueue(newItems);

    // Return the id
    return options.id;
  }

    /**
   * Completed a loading opertation by a given id
   * @param {Integer} index Default 0
   */
     function complete(id) {
       // Input validation
      if(!id || typeof id !== 'string') return;

      const newQueue = queue.filter((i) => i.id !== id);
      setQueue(newQueue);
    }
  
    /**
     * Clears all errors
     */
    function clear() {
      setQueue([])
    }


  return(
    <LoadingContext.Provider value={{queue, add, complete, clear, setIsShowDialog}}>
      { children }
      { isShowDialog && 
        <LoadingDialog
          loadings={queue}
        />
      }
    </LoadingContext.Provider>
  )
}