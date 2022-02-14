




export default function Table(headers, items) {
  return(
    <table>
      <thead>
        <tr>
           { headers.map((h) => h)}
        </tr>
      </thead>
      <tbody>
        {
          items.map((i) => {
            <tr>
              
            </tr>
          })
        }
      </tbody>
    </table>
  )
}