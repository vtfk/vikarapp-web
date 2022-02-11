import './style.css'

/*
  Props
*/
// Table.propTypes = {
//   items: PropTypes.array.isRequired,
//   headers: PropTypes.array.isRequired,
// }
function random() {
  return Math.floor(Math.random() * 10000000000)
}

export default function Table({items, headers, id = 'id', style}) {
  return(
    <table className="vtfk-table" style={style} cellSpacing="0" cellPadding="0">
      <thead>
        <tr>{ headers.map((header) => <th key={random()} className={header.class} style={header.style}>{header.label}</th>) }</tr>
      </thead>
      <tbody>
        {
          (items && Array.isArray(items) && items.length > 0) ?
          items.map((item, i) => {
            return (
              <tr key={item[id]}>
                {
                  headers.map((header) => {
                    return (
                      <td key={random()} style={header.itemStyle}>{item[header.value] || ''}</td>
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

