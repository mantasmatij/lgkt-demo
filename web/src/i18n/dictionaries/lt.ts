export const lt = {
  common: {
    language: 'Kalba',
    lithuanian: 'Lietuvių',
    english: 'Anglų',
    submit: 'Pateikti',
    optional: 'pasirinktinai',
  },
  form: {
    title: 'Anoniminė įmonės forma',
    section_company: 'Įmonė',
    section_contact: 'Kontaktai ir kita',
    section_submitter: 'Pateikėjas',
    requirements_applied: 'Reikalavimai taikomi',
    reasons_optional: 'Nepakankamos atstovybės priežastys (pasirinktinai)',
    consent_label: 'Sutinku su mano duomenų tvarkymu.',
    submitting: 'Pildoma forma...'
  },
  fields: {
    company_name: 'Juridinio asmens pavadinimas',
    company_code: 'Juridinio asmens kodas',
    country_iso2: 'Šalis (ISO2)',
    legal_form: 'Juridinio asmens teisinė forma',
    address: 'Juridinio asmens buveinės adresas',
    registry: 'Registras, kuriame kaupiami ir saugomi duomenys',
    e_delivery_address: 'Juridinio asmens elektroninio pristatymo dėžutės adresas',
    requirements_link_optional: 'Reikalavimų nuoroda (pasirinktinai)',
    reporting_from: 'Nuo',
    reporting_to: 'Iki',
    contact_name: 'Kontaktinio asmens vardas',
    contact_email: 'Kontaktinis el. paštas',
    contact_phone: 'Kontaktinis telefono numeris',
    submitter_full_name: 'Vardas, pavardė',
    submitter_title: 'Pareigos',
    submitter_phone: 'Telefonas',
    submitter_email: 'El. paštas',
  },
  home: {
    title: 'LGKT Forma - Įmonių ataskaitos',
    welcome: 'Sveiki atvykę',
  },
} as const;

export type LtDict = typeof lt;
