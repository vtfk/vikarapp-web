import { getValidToken } from '../auth'

const supportedLanguages = ['nb', 'nn', 'en']

function getLanguageFromToken() {
  let language = getValidToken()?.language;
  if(language && language.includes('-')) language = language.substring(0, 2);
  
  return supportedLanguages.includes(language) ? language : 'nb'
}

function getLanguageFromStorage() {
  const language = localStorage.getItem('language');
  return supportedLanguages.includes(language) ? language : 'nb'
}

export const localizations = {
  words: {
    settings: {
      nb: 'Innstillinger',
      nn: 'Innstillingar',
      en: 'Settings'
    },
    language: {
      nb: 'Språk',
      nn: 'Språk',
      en: 'Language'
    },
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
    substitution: {
      nb: 'Vikariat',
      nn: 'Vikariat',
      en: 'Substitution'
    },
    substitutions: {
      nb: 'Vikariat',
      nn: 'Vikariat',
      en: 'Substitutions'
    },
    school: {
      nb: 'Skole',
      nn: 'Skule',
      en: 'School'
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
    from: {
      nb: 'Fra',
      nn: 'Frå',
      en: 'From'
    },
    to: {
      nb: 'Til',
      en: 'To'
    },
    show: {
      nb: 'Vis',
      nn: 'Vis',
      en: 'Show'
    },
    hide: {
      nb: 'Skjul',
      nn: 'Skjul',
      en: 'Hide'
    },
    filters: {
      nb: 'Filtere',
      nn: 'Filtere',
      en: 'Filters'
    },
    filter: {
      nb: 'Filter',
      nn: 'Filter',
      en: 'Filter'
    },
    unknown: {
      nb: 'Ukjent',
      nn: 'Ukjent',
      en: 'Unknown'
    },
    active: {
      nb: 'Aktiv',
      nn: 'Aktiv',
      en: 'Active'
    },
    activate: {
      nb: 'Aktiver',
      nn: 'Aktiver',
      en: 'Activate'
    },
    pending: {
      nb: 'Venter',
      nn: 'Ventar',
      en: 'Pending'
    },
    expires: {
      nb: 'Utløper',
      nn: 'Utløpar',
      en: 'Expires'
    },
    expired: {
      nb: 'Utløpt',
      nn: 'Gått ut',
      en: 'Expired'
    },
    description: {
      nb: 'Beskrivelse',
      nn: 'Beskriving',
      en: 'Description'
    },
    historyNoun: {
      nb: 'Historikk',
      nn: 'Historikk',
      en: 'History'
    }
  },
  terms: {
    loggingIn: {
      nb: 'Logger inn',
      nn: 'Loggar inn',
      en: 'Logging in'
    },
    loggingOut: {
      nb: 'Logger ut',
      nn: 'Loggar ut',
      en: 'Logging out'
    },
    youWillSoonBeRedirected: {
      nb: 'Du vil snart bli videresendt',
      nn: 'Du vil snart bli vidaresendt',
      en: 'You will soon be redirected'
    },
    doYouWantToSave: {
      nb: 'Ønsker du å lagre?',
      nn: 'Ønsker du å lagra?',
      en: 'Do you want to save?'
    },
    actionWasSuccessful: {
      nb: 'Handlingen var vellykket',
      nn: 'Handlinga var vellykka',
      en: 'The action was successful'
    }
  },
  components: {
    history: {
      statuses: {
        pending: {
          nb: 'Venter',
          nn: 'Ventar',
          en: 'Pending'
        },
        active: {
          nb: 'Aktiv',
          nn: 'Aktiv',
          en: 'Active'
        },
        expired: {
          nb: 'Utløpt',
          nn: 'Gått ut',
          en: 'Expired'
        }
      },
      chooseStatuses: {
        nb: 'Velg statuser',
        nn: 'Vel statusar',
        en: 'Choose statuses'
      },
      chooseYears: {
        nb: 'Velg år',
        nn: 'Vel år',
        en: 'Choose years'
      }
    },
    errorDialog: {
      okAllBtnText: {
        nb: 'Ok til alle',
        en: 'Ok to all'
      },
      showDetailsBtnText: {
        nb: 'Vis detaljer',
        nn: 'Vis detaljar',
        en: 'Show details'
      },
      hideDetailsBtnText: {
        nb: 'Skjul detlajer',
        nn: 'Skjul detaljar',
        en: 'Hide details'
      }
    },
    loadingDialog: {
      message: {
        nb: 'Forespørsel behandles',
        nn: 'Førespurnad blir behandla',
        en: 'Request is processed'
      },
      pleaseWait: {
        nb: 'Vennligst vent',
        nn: 'Ver vennleg og vent',
        en: 'Please wait'
      }
    },
    settings: {
      warning: {
        nb: 'Når innstillingene endres vil appen lastes inn på nytt.',
        nn: 'Når innstillingane blir endra vil appen lastast inn på nytt.',
        en: 'When the settings change the app will restart'
      }
    }
  },
  routes: {
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
        },
      },
      history: {
        headerSubtext: {
          nb: 'Her kan du se og filtrere dine tidligere vikariater',
          nn: 'Her kan du sjå og filtrera dei tidlegare vikariata dine',
          en: 'Here you can see and filter your previous substitutions'
        }
      }
    },
    substitute: {
      headerSubtext: {
        nb: 'Søk opp en lærer og start ett eller flere vikariat',
        nn: 'Søk opp ein lærar og start eitt eller fleire vikariat',
        en: 'Search for a teacher to start one or more substitutions'
      },
      teacherSearchLabel: {
        nb: 'Søk etter læreren du skal være vikar for',
        nn: 'Søk etter læraren du skal vera vikar for',
        en: 'Search for the teacher you want to substitute for'
      },
      tableNoData: {
        nb: 'Ingen teams er funnet',
        nn: 'Ingen teams er funne',
        en: 'No teams found'
      },
      hiddenMsgPart1: {
        nb: 'Vi har skjult',
        en: 'We have hidden'
      },
      hiddenMsgPart2: {
        nb: 'teams som du allerede er medlem av',
        nn: 'teams som du allereie er medlem av',
        en: 'teams you are already a member of'
      },
      confirmationTitle: {
        nb: 'Ønsker du å aktivere vikariat?',
        nn: 'Ønsker du å aktivera vikariat?',
        en: 'Are you sure you want to activate the substitution?'
      }
    },
    history: {
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
    logs: {
      headerSubtext: {
        nb: 'Logger over handlinger i VikarApp',
        nn: 'Loggar over handlingar i VikarApp',
        en: 'Action logs'
      },
      thTimestamp: {
        nb: 'Tidspunkt',
        nn: 'Tidspunkt',
        en: 'Time'
      },
      thEndpoint: {
        nb: 'Endepunkt',
        en: 'Endpoint'
      },
      thDoneBy: {
        nb: 'Utført av',
        en: 'Done by'
      },
      thDuration: {
        nb: 'Varighet',
        nn: 'Varigheit',
        en: 'Duration'
      },
      thDetails: {
        nb: 'Detaljer',
        nn: 'Detaljar',
        en: 'Details'
      }
    },
    login: {
      title: {
        nb: 'Du logges inn',
        nn: 'Du blir logga inn',
        en: 'You are beeing logged in'
      },
      subtitle: {
        nb: 'Hvis det ikke skjer automatisk, vennligst forsøk knappen',
        nn: 'Viss det ikkje skjer automatisk, vennlegast forsøk knappen',
        en: 'If it does not happen automatically, please try the button'
      }
    }
  }
}

export function getCurrentLaguage() {
  return getLanguageFromStorage() || getLanguageFromToken() || 'nb';
}

export function setLanguage(language) {
  const lang = supportedLanguages.includes(language) ? language : 'nb'
  localStorage.setItem('language', lang);
}

export function locale(value) {
  if(!value) return 'Tekst ikke funnet';
  let val = value[getCurrentLaguage()];
  if(!val) return value['nb']
  return val
}