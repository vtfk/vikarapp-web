/*
  Import dependencies
*/
import * as auth from '../auth';

export default function HandleLogin() {
  auth.handleRedirect();

  return (
    <div>Handling login!</div>
  )
}