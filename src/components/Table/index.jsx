import { useEffect } from "react";
import './style.css'

/*
  Props
*/
// Table.propTypes = {
//   items: PropTypes.array.isRequired,
//   headers: PropTypes.array.isRequired,
// }

export default function Table({items, headers, id = 'id', style}) {
  return(
    <table className="vtfk-table" style={style}>
      <thead>
        <tr>{ headers.map((header, i) => <th key={i} className={header.class} style={header.style}>{header.label}</th>) }</tr>
      </thead>
      <tbody>
        {
          (items && Array.isArray(items) && items.length > 0) ?
          items.map((item, i) => {
            return (
              <tr key={i + 1000}>
                {
                  headers.map((header, i) => {
                    return (
                      <td>{item[header.value] || ''}</td>
                    )
                  })
                }
              </tr>
            )
          })
          : <tr><td colSpan={headers.length} style={{ textAlign: 'center'}}>Ingen data funnter</td></tr>
        }
      </tbody>
    </table>
  )
}

