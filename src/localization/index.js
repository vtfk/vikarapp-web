import { getValidToken } from '../auth'


function getLanguageFromToken() {
  let language = getValidToken()?.language;
  if(language && language.includes('-')) language = language.substring(0, 2);
  return 'nn' || language;
}

const preferredLanguage = getLanguageFromToken() || 'nb'

export const localizations = {
  teacher: {
    nb: 'Lærer',
    nn: 'Lærar',
    en: 'Teacher'
  },
  class: {
    nb: 'Klasse',
    nn: 'Undervisningsgruppe',
    en: 'Class'
  },
  classes: {
    nb: 'Klasser',
    nn: 'Undervisningsgruppar',
    en: 'Classes'
  },
  expires: {
    nb: 'Utløper',
    nn: 'Utløpar',
    en: 'Expires'
  }
}

export function locale(value) {
  if(!value) return 'Tekst ikke funnet';
  let val = value[preferredLanguage];
  if(!val) return value['nb']
  return val
}