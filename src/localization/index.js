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
  substitute: {
    nb: 'Vikar',
    nn: 'Vikar',
    en: 'Substitute'
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
  },
  yes: {
    nb: 'Ja',
    nn: 'Ja',
    en: 'Yes'
  },
  no: {
    nb: 'Nei',
    nn: 'Nei',
    en: 'No'
  },
  cancel: {
    nb: 'Avbryt',
    nn: 'Avbryt',
    en: 'Cancel'
  },
  activateSubstitution: {
    nb: 'Aktiver vikariat',
    nn: 'Aktiver vikariat',
    en: 'Activate substitution'
  },
  doYouWantToSave: {
    nb: 'Ønsker du å lagre?',
    nn: 'Ønsker du å lagra?',
    en: 'Do you want to save?'
  },
  substituteHeaderSubtext: {
    nb: 'Søk opp en lærer og start ett eller flere vikariat',
    nn: 'Søk opp ein lærar og start eitt eller fleire vikariat',
    en: 'Search for a teacher to start one or more substitutions'
  },
  history: {
    nb: 'Historikk',
    nn: 'Historikk',
    en: 'History'
  },
  overview: {
    headerSubtext: {
      nb: 'Her kan du se og fornye dine siste vikariater',
      nn: 'Her kan du sjå og fornya dei siste vikariata dine',
      en: 'Here you can see and renew your last substitutions'
    },
    tableMobileHeader: {
      nb: 'Mine vikariat',
      nn: 'Vikariata mine',
      en: 'My substitutions'
    },
    iShallSubstitute: {
      nb: 'Jeg skal være vikar',
      nn: 'Eg skal vera vikar',
      en: 'Substitute'
    },
    extendSubstitution: {
      nb: 'Forleng vikariat',
      nn: 'Forleng vikariat',
      en: 'Extend substitution'
    },
    doYouWantToRenew: {
      nb: 'Er du sikker på at du ønsker å forlenge eller fornye vikariat for:',
      nn: 'Er du sikker på at du ønsker å forlenga eller fornya vikariat for:',
      en: 'Are you sure you want to extend or renew substitution for:'
    }
  },
  historyRoute: {
    headerSubtext: {
      nb: 'Her kan du se og filtrere dine tidligere vikariater',
      nn: 'Her kan du sjå og filtrera dei tidlegare vikariata dine',
      en: 'Here you can see and filter your previous substitutions'
    },
    showSubstitutionWhere: {
      nb: 'Vis vikariat hvor:',
      nn: 'Vis vikariat kvar:',
      en: 'Show substitutions where:'
    },
    iWasSubstitute: {
      nb: 'Jeg var vikar',
      nn: 'Eg var vikar',
      en: 'I were substituting'
    },
    iHadSubstitute: {
      nb: 'Jeg hadde vikar',
      nn: 'Eg hadde vikar',
      en: 'I had substitution'
    }
  },
  admin: {
    manageSubstitutions: {
      nb: 'Behandle vikariat',
      nn: 'Behandl vikariat',
      en: 'Manage substitutions'
    },
    manageSearchPermissions: {
      nb: 'Behandle søkerettigheter',
      nn: 'Behandl søkerettigheter',
      en: 'Manage search permissions'
    },
    logger: {
      nb: 'Logger',
      nn: 'Loggar',
      en: 'Logs'
    },
  },
  words: {
    school: {
      nb: 'Skole',
      nn: 'Skule',
      en: 'School'
    },
    schools: {
      nb: 'Skoler',
      nn: 'Skuler',
      en: 'Schools'
    },
    actions: {
      nb: 'Handlinger',
      nn: 'Handlingar',
      en: 'Actions'
    },
    edit: {
      nb: 'Rediger',
      nn: 'Rediger',
      en: 'Edit'
    },
    add: {
      nb: 'Legg til',
      nn: 'Legg til',
      en: 'Add'
    },
    save: {
      nb: 'Lagre',
      nn: 'Lagre',
      en: 'Save'
    },
    yes: {
      nb: 'Ja',
      nn: 'Ja',
      en: 'Yes'
    },
    no: {
      nb: 'Nei',
      nn: 'Nei',
      en: 'No'
    },
    cancel: {
      nb: 'Avbryt',
      nn: 'Avbryt',
      en: 'Cancel'
    },
  },
  routes: {
    admin: {
      substitute: {
        headerSubtext: {
          nb: 'Her kan du administrere alle vikariater',
          nn: 'Her kan du administrera alle vikariat',
          en: 'Administrate substitutions '
        },
        tableHeaderTeamClass: {
          nb: 'Team / Klasse',
          nn: 'Team / Klasse',
          en: 'Team / Class'
        },
        whoShouldSubstitute: {
          nb: 'Hvem skal være vikar?',
          nn: 'Kven skal vera vikar?',
          en: 'Who should substitute?'
        },
        forWhatTeacher: {
          nb: 'For hvilken lærer?',
          nn: 'For kva lærar?',
          en: 'For what teacher?'
        },
        addSubstitution: {
          nb: 'Legg til vikariat',
          nn: 'Legg til vikariat',
          en: 'Add substitution'
        },
        areYouSure: {
          nb: 'Er du helt sikker på at du ønsker å sette opp følgende vikariat?',
          nn: 'Er du heilt sikker på at du ønsker å setja opp følgjande vikariat?',
          en: 'Are you sure you want to setup the following substitution?'
        }
      },
      schools: {
        headerSubtext: {
          nb: 'Her setter du opp hvilke skoler som for lov til å være vikar for hverandre',
          nn: 'Her set du opp kva skular som for lov til å vera vikar for kvarandre',
          en: 'Setup what schools are allowed to substitute for each other'
        },
        addNewSchool: {
          nb: 'Legg til ny skole',
          nn: 'Legg til ny skule',
          en: 'Add school'
        },
        teachersShouldBeAbleTo: {
          nb: 'Lærere skal kunne vikariere for disse skolene:',
          nn: 'Lærarar skal kunna vikariera for desse skulane:',
          en: 'Teachers should be able to substitue for there schools:'
        },
        editDescPart1: {
          nb: 'Her endrer du hvilke skoler lærere på',
          nn: 'Her endrar du kva skular lærarar på',
          en: 'Edit what schools teachers on'
        },
        editDescPart2: {
          nb: 'kan være vikar for.',
          nn: 'kan vera vikar for.',
          en: 'substitute for.'
        },
        newSchoolDesc: {
          nb: 'Her oppretter du en ny skole',
          nn: 'Her opprettar du ein ny skule',
          en: 'Create a new school'
        },
        nameOfSchoolLabel: {
          nb: 'Navn på skole',
          nn: 'Namn på skule',
          en: 'School name'
        },
        adWarningPart1: {
          nb: 'Navnet på skolen må være navnet som skolen har i',
          nn: 'Namnet på skulen må vera namnet som skulen har i',
          en: 'The name of the school must be the same as it has in'
        },
        adWarningPart2: {
          nb: 'i Active Directory',
          nn: 'i Active Directory',
          en: 'in Active Directory'
        }
      }
    }
  }
}

export function locale(value) {
  if(!value) return 'Tekst ikke funnet';
  let val = value[preferredLanguage];
  if(!val) return value['nb']
  return val
}