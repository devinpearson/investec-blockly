import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";

export const countries = [
  {
    code: "AF",
    alpha3: "AFG",
    name: "Afghanistan",
  },
  {
    code: "AL",
    alpha3: "ALB",
    name: "Albania",
  },
  {
    code: "DZ",
    alpha3: "DZA",
    name: "Algeria",
  },
  {
    code: "AS",
    alpha3: "ASM",
    name: "American Samoa",
  },
  {
    code: "AD",
    alpha3: "AND",
    name: "Andorra",
  },
  {
    code: "AO",
    alpha3: "AGO",
    name: "Angola",
  },
  {
    code: "AI",
    alpha3: "AIA",
    name: "Anguilla",
  },
  {
    code: "AQ",
    alpha3: "ATA",
    name: "Antarctica",
  },
  {
    code: "AG",
    alpha3: "ATG",
    name: "Antigua and Barbuda",
  },
  {
    code: "AR",
    alpha3: "ARG",
    name: "Argentina",
  },
  {
    code: "AM",
    alpha3: "ARM",
    name: "Armenia",
  },
  {
    code: "AW",
    alpha3: "ABW",
    name: "Aruba",
  },
  {
    code: "AU",
    alpha3: "AUS",
    name: "Australia",
  },
  {
    code: "AT",
    alpha3: "AUT",
    name: "Austria",
  },
  {
    code: "AZ",
    alpha3: "AZE",
    name: "Azerbaijan",
  },
  {
    code: "BS",
    alpha3: "BHS",
    name: "Bahamas (the)",
  },
  {
    code: "BH",
    alpha3: "BHR",
    name: "Bahrain",
  },
  {
    code: "BD",
    alpha3: "BGD",
    name: "Bangladesh",
  },
  {
    code: "BB",
    alpha3: "BRB",
    name: "Barbados",
  },
  {
    code: "BY",
    alpha3: "BLR",
    name: "Belarus",
  },
  {
    code: "BE",
    alpha3: "BEL",
    name: "Belgium",
  },
  {
    code: "BZ",
    alpha3: "BLZ",
    name: "Belize",
  },
  {
    code: "BJ",
    alpha3: "BEN",
    name: "Benin",
  },
  {
    code: "BM",
    alpha3: "BMU",
    name: "Bermuda",
  },
  {
    code: "BT",
    alpha3: "BTN",
    name: "Bhutan",
  },
  {
    code: "BO",
    alpha3: "BOL",
    name: "Bolivia (Plurinational State of)",
  },
  {
    code: "BQ",
    alpha3: "BES",
    name: "Bonaire, Sint Eustatius and Saba",
  },
  {
    code: "BA",
    alpha3: "BIH",
    name: "Bosnia and Herzegovina",
  },
  {
    code: "BW",
    alpha3: "BWA",
    name: "Botswana",
  },
  {
    code: "BV",
    alpha3: "BVT",
    name: "Bouvet Island",
  },
  {
    code: "BR",
    alpha3: "BRA",
    name: "Brazil",
  },
  {
    code: "IO",
    alpha3: "IOT",
    name: "British Indian Ocean Territory (the)",
  },
  {
    code: "BN",
    alpha3: "BRN",
    name: "Brunei Darussalam",
  },
  {
    code: "BG",
    alpha3: "BGR",
    name: "Bulgaria",
  },
  {
    code: "BF",
    alpha3: "BFA",
    name: "Burkina Faso",
  },
  {
    code: "BI",
    alpha3: "BDI",
    name: "Burundi",
  },
  {
    code: "CV",
    alpha3: "CPV",
    name: "Cabo Verde",
  },
  {
    code: "KH",
    alpha3: "KHM",
    name: "Cambodia",
  },
  {
    code: "CM",
    alpha3: "CMR",
    name: "Cameroon",
  },
  {
    code: "CA",
    alpha3: "CAN",
    name: "Canada",
  },
  {
    code: "KY",
    alpha3: "CYM",
    name: "Cayman Islands (the)",
  },
  {
    code: "CF",
    alpha3: "CAF",
    name: "Central African Republic (the)",
  },
  {
    code: "TD",
    alpha3: "TCD",
    name: "Chad",
  },
  {
    code: "CL",
    alpha3: "CHL",
    name: "Chile",
  },
  {
    code: "CN",
    alpha3: "CHN",
    name: "China",
  },
  {
    code: "CX",
    alpha3: "CXR",
    name: "Christmas Island",
  },
  {
    code: "CC",
    alpha3: "CCK",
    name: "Cocos (Keeling) Islands (the)",
  },
  {
    code: "CO",
    alpha3: "COL",
    name: "Colombia",
  },
  {
    code: "KM",
    alpha3: "COM",
    name: "Comoros (the)",
  },
  {
    code: "CD",
    alpha3: "COD",
    name: "Congo (the Democratic Republic of the)",
  },
  {
    code: "CG",
    alpha3: "COG",
    name: "Congo (the)",
  },
  {
    code: "CK",
    alpha3: "COK",
    name: "Cook Islands (the)",
  },
  {
    code: "CR",
    alpha3: "CRI",
    name: "Costa Rica",
  },
  {
    code: "HR",
    alpha3: "HRV",
    name: "Croatia",
  },
  {
    code: "CU",
    alpha3: "CUB",
    name: "Cuba",
  },
  {
    code: "CW",
    alpha3: "CUW",
    name: "Curaçao",
  },
  {
    code: "CY",
    alpha3: "CYP",
    name: "Cyprus",
  },
  {
    code: "CZ",
    alpha3: "CZE",
    name: "Czechia",
  },
  {
    code: "CI",
    alpha3: "CIV",
    name: "Côte d'Ivoire",
  },
  {
    code: "DK",
    alpha3: "DNK",
    name: "Denmark",
  },
  {
    code: "DJ",
    alpha3: "DJI",
    name: "Djibouti",
  },
  {
    code: "DM",
    alpha3: "DMA",
    name: "Dominica",
  },
  {
    code: "DO",
    alpha3: "DOM",
    name: "Dominican Republic (the)",
  },
  {
    code: "EC",
    alpha3: "ECU",
    name: "Ecuador",
  },
  {
    code: "EG",
    alpha3: "EGY",
    name: "Egypt",
  },
  {
    code: "SV",
    alpha3: "SLV",
    name: "El Salvador",
  },
  {
    code: "GQ",
    alpha3: "GNQ",
    name: "Equatorial Guinea",
  },
  {
    code: "ER",
    alpha3: "ERI",
    name: "Eritrea",
  },
  {
    code: "EE",
    alpha3: "EST",
    name: "Estonia",
  },
  {
    code: "SZ",
    alpha3: "SWZ",
    name: "Eswatini",
  },
  {
    code: "ET",
    alpha3: "ETH",
    name: "Ethiopia",
  },
  {
    code: "FK",
    alpha3: "FLK",
    name: "Falkland Islands (the) [Malvinas]",
  },
  {
    code: "FO",
    alpha3: "FRO",
    name: "Faroe Islands (the)",
  },
  {
    code: "FJ",
    alpha3: "FJI",
    name: "Fiji",
  },
  {
    code: "FI",
    alpha3: "FIN",
    name: "Finland",
  },
  {
    code: "FR",
    alpha3: "FRA",
    name: "France",
  },
  {
    code: "GF",
    alpha3: "GUF",
    name: "French Guiana",
  },
  {
    code: "PF",
    alpha3: "PYF",
    name: "French Polynesia",
  },
  {
    code: "TF",
    alpha3: "ATF",
    name: "French Southern Territories (the)",
  },
  {
    code: "GA",
    alpha3: "GAB",
    name: "Gabon",
  },
  {
    code: "GM",
    alpha3: "GMB",
    name: "Gambia (the)",
  },
  {
    code: "GE",
    alpha3: "GEO",
    name: "Georgia",
  },
  {
    code: "DE",
    alpha3: "DEU",
    name: "Germany",
  },
  {
    code: "GH",
    alpha3: "GHA",
    name: "Ghana",
  },
  {
    code: "GI",
    alpha3: "GIB",
    name: "Gibraltar",
  },
  {
    code: "GR",
    alpha3: "GRC",
    name: "Greece",
  },
  {
    code: "GL",
    alpha3: "GRL",
    name: "Greenland",
  },
  {
    code: "GD",
    alpha3: "GRD",
    name: "Grenada",
  },
  {
    code: "GP",
    alpha3: "GLP",
    name: "Guadeloupe",
  },
  {
    code: "GU",
    alpha3: "GUM",
    name: "Guam",
  },
  {
    code: "GT",
    alpha3: "GTM",
    name: "Guatemala",
  },
  {
    code: "GG",
    alpha3: "GGY",
    name: "Guernsey",
  },
  {
    code: "GN",
    alpha3: "GIN",
    name: "Guinea",
  },
  {
    code: "GW",
    alpha3: "GNB",
    name: "Guinea-Bissau",
  },
  {
    code: "GY",
    alpha3: "GUY",
    name: "Guyana",
  },
  {
    code: "HT",
    alpha3: "HTI",
    name: "Haiti",
  },
  {
    code: "HM",
    alpha3: "HMD",
    name: "Heard Island and McDonald Islands",
  },
  {
    code: "VA",
    alpha3: "VAT",
    name: "Holy See (the)",
  },
  {
    code: "HN",
    alpha3: "HND",
    name: "Honduras",
  },
  {
    code: "HK",
    alpha3: "HKG",
    name: "Hong Kong",
  },
  {
    code: "HU",
    alpha3: "HUN",
    name: "Hungary",
  },
  {
    code: "IS",
    alpha3: "ISL",
    name: "Iceland",
  },
  {
    code: "IN",
    alpha3: "IND",
    name: "India",
  },
  {
    code: "ID",
    alpha3: "IDN",
    name: "Indonesia",
  },
  {
    code: "IR",
    alpha3: "IRN",
    name: "Iran (Islamic Republic of)",
  },
  {
    code: "IQ",
    alpha3: "IRQ",
    name: "Iraq",
  },
  {
    code: "IE",
    alpha3: "IRL",
    name: "Ireland",
  },
  {
    code: "IM",
    alpha3: "IMN",
    name: "Isle of Man",
  },
  {
    code: "IL",
    alpha3: "ISR",
    name: "Israel",
  },
  {
    code: "IT",
    alpha3: "ITA",
    name: "Italy",
  },
  {
    code: "JM",
    alpha3: "JAM",
    name: "Jamaica",
  },
  {
    code: "JP",
    alpha3: "JPN",
    name: "Japan",
  },
  {
    code: "JE",
    alpha3: "JEY",
    name: "Jersey",
  },
  {
    code: "JO",
    alpha3: "JOR",
    name: "Jordan",
  },
  {
    code: "KZ",
    alpha3: "KAZ",
    name: "Kazakhstan",
  },
  {
    code: "KE",
    alpha3: "KEN",
    name: "Kenya",
  },
  {
    code: "KI",
    alpha3: "KIR",
    name: "Kiribati",
  },
  {
    code: "KP",
    alpha3: "PRK",
    name: "Korea (the Democratic People's Republic of)",
  },
  {
    code: "KR",
    alpha3: "KOR",
    name: "Korea (the Republic of)",
  },
  {
    code: "KW",
    alpha3: "KWT",
    name: "Kuwait",
  },
  {
    code: "KG",
    alpha3: "KGZ",
    name: "Kyrgyzstan",
  },
  {
    code: "LA",
    alpha3: "LAO",
    name: "Lao People's Democratic Republic (the)",
  },
  {
    code: "LV",
    alpha3: "LVA",
    name: "Latvia",
  },
  {
    code: "LB",
    alpha3: "LBN",
    name: "Lebanon",
  },
  {
    code: "LS",
    alpha3: "LSO",
    name: "Lesotho",
  },
  {
    code: "LR",
    alpha3: "LBR",
    name: "Liberia",
  },
  {
    code: "LY",
    alpha3: "LBY",
    name: "Libya",
  },
  {
    code: "LI",
    alpha3: "LIE",
    name: "Liechtenstein",
  },
  {
    code: "LT",
    alpha3: "LTU",
    name: "Lithuania",
  },
  {
    code: "LU",
    alpha3: "LUX",
    name: "Luxembourg",
  },
  {
    code: "MO",
    alpha3: "MAC",
    name: "Macao",
  },
  {
    code: "MG",
    alpha3: "MDG",
    name: "Madagascar",
  },
  {
    code: "MW",
    alpha3: "MWI",
    name: "Malawi",
  },
  {
    code: "MY",
    alpha3: "MYS",
    name: "Malaysia",
  },
  {
    code: "MV",
    alpha3: "MDV",
    name: "Maldives",
  },
  {
    code: "ML",
    alpha3: "MLI",
    name: "Mali",
  },
  {
    code: "MT",
    alpha3: "MLT",
    name: "Malta",
  },
  {
    code: "MH",
    alpha3: "MHL",
    name: "Marshall Islands (the)",
  },
  {
    code: "MQ",
    alpha3: "MTQ",
    name: "Martinique",
  },
  {
    code: "MR",
    alpha3: "MRT",
    name: "Mauritania",
  },
  {
    code: "MU",
    alpha3: "MUS",
    name: "Mauritius",
  },
  {
    code: "YT",
    alpha3: "MYT",
    name: "Mayotte",
  },
  {
    code: "MX",
    alpha3: "MEX",
    name: "Mexico",
  },
  {
    code: "FM",
    alpha3: "FSM",
    name: "Micronesia (Federated States of)",
  },
  {
    code: "MD",
    alpha3: "MDA",
    name: "Moldova (the Republic of)",
  },
  {
    code: "MC",
    alpha3: "MCO",
    name: "Monaco",
  },
  {
    code: "MN",
    alpha3: "MNG",
    name: "Mongolia",
  },
  {
    code: "ME",
    alpha3: "MNE",
    name: "Montenegro",
  },
  {
    code: "MS",
    alpha3: "MSR",
    name: "Montserrat",
  },
  {
    code: "MA",
    alpha3: "MAR",
    name: "Morocco",
  },
  {
    code: "MZ",
    alpha3: "MOZ",
    name: "Mozambique",
  },
  {
    code: "MM",
    alpha3: "MMR",
    name: "Myanmar",
  },
  {
    code: "NA",
    alpha3: "NAM",
    name: "Namibia",
  },
  {
    code: "NR",
    alpha3: "NRU",
    name: "Nauru",
  },
  {
    code: "NP",
    alpha3: "NPL",
    name: "Nepal",
  },
  {
    code: "NL",
    alpha3: "NLD",
    name: "Netherlands (the)",
  },
  {
    code: "NC",
    alpha3: "NCL",
    name: "New Caledonia",
  },
  {
    code: "NZ",
    alpha3: "NZL",
    name: "New Zealand",
  },
  {
    code: "NI",
    alpha3: "NIC",
    name: "Nicaragua",
  },
  {
    code: "NE",
    alpha3: "NER",
    name: "Niger (the)",
  },
  {
    code: "NG",
    alpha3: "NGA",
    name: "Nigeria",
  },
  {
    code: "NU",
    alpha3: "NIU",
    name: "Niue",
  },
  {
    code: "NF",
    alpha3: "NFK",
    name: "Norfolk Island",
  },
  {
    code: "MP",
    alpha3: "MNP",
    name: "Northern Mariana Islands (the)",
  },
  {
    code: "NO",
    alpha3: "NOR",
    name: "Norway",
  },
  {
    code: "OM",
    alpha3: "OMN",
    name: "Oman",
  },
  {
    code: "PK",
    alpha3: "PAK",
    name: "Pakistan",
  },
  {
    code: "PW",
    alpha3: "PLW",
    name: "Palau",
  },
  {
    code: "PS",
    alpha3: "PSE",
    name: "Palestine, State of",
  },
  {
    code: "PA",
    alpha3: "PAN",
    name: "Panama",
  },
  {
    code: "PG",
    alpha3: "PNG",
    name: "Papua New Guinea",
  },
  {
    code: "PY",
    alpha3: "PRY",
    name: "Paraguay",
  },
  {
    code: "PE",
    alpha3: "PER",
    name: "Peru",
  },
  {
    code: "PH",
    alpha3: "PHL",
    name: "Philippines (the)",
  },
  {
    code: "PN",
    alpha3: "PCN",
    name: "Pitcairn",
  },
  {
    code: "PL",
    alpha3: "POL",
    name: "Poland",
  },
  {
    code: "PT",
    alpha3: "PRT",
    name: "Portugal",
  },
  {
    code: "PR",
    alpha3: "PRI",
    name: "Puerto Rico",
  },
  {
    code: "QA",
    alpha3: "QAT",
    name: "Qatar",
  },
  {
    code: "MK",
    alpha3: "MKD",
    name: "Republic of North Macedonia",
  },
  {
    code: "RO",
    alpha3: "ROU",
    name: "Romania",
  },
  {
    code: "RU",
    alpha3: "RUS",
    name: "Russian Federation (the)",
  },
  {
    code: "RW",
    alpha3: "RWA",
    name: "Rwanda",
  },
  {
    code: "RE",
    alpha3: "REU",
    name: "Réunion",
  },
  {
    code: "BL",
    alpha3: "BLM",
    name: "Saint Barthélemy",
  },
  {
    code: "SH",
    alpha3: "SHN",
    name: "Saint Helena, Ascension and Tristan da Cunha",
  },
  {
    code: "KN",
    alpha3: "KNA",
    name: "Saint Kitts and Nevis",
  },
  {
    code: "LC",
    alpha3: "LCA",
    name: "Saint Lucia",
  },
  {
    code: "MF",
    alpha3: "MAF",
    name: "Saint Martin (French part)",
  },
  {
    code: "PM",
    alpha3: "SPM",
    name: "Saint Pierre and Miquelon",
  },
  {
    code: "VC",
    alpha3: "VCT",
    name: "Saint Vincent and the Grenadines",
  },
  {
    code: "WS",
    alpha3: "WSM",
    name: "Samoa",
  },
  {
    code: "SM",
    alpha3: "SMR",
    name: "San Marino",
  },
  {
    code: "ST",
    alpha3: "STP",
    name: "Sao Tome and Principe",
  },
  {
    code: "SA",
    alpha3: "SAU",
    name: "Saudi Arabia",
  },
  {
    code: "SN",
    alpha3: "SEN",
    name: "Senegal",
  },
  {
    code: "RS",
    alpha3: "SRB",
    name: "Serbia",
  },
  {
    code: "SC",
    alpha3: "SYC",
    name: "Seychelles",
  },
  {
    code: "SL",
    alpha3: "SLE",
    name: "Sierra Leone",
  },
  {
    code: "SG",
    alpha3: "SGP",
    name: "Singapore",
  },
  {
    code: "SX",
    alpha3: "SXM",
    name: "Sint Maarten (Dutch part)",
  },
  {
    code: "SK",
    alpha3: "SVK",
    name: "Slovakia",
  },
  {
    code: "SI",
    alpha3: "SVN",
    name: "Slovenia",
  },
  {
    code: "SB",
    alpha3: "SLB",
    name: "Solomon Islands",
  },
  {
    code: "SO",
    alpha3: "SOM",
    name: "Somalia",
  },
  {
    code: "ZA",
    alpha3: "ZAF",
    name: "South Africa",
  },
  {
    code: "GS",
    alpha3: "SGS",
    name: "South Georgia and the South Sandwich Islands",
  },
  {
    code: "SS",
    alpha3: "SSD",
    name: "South Sudan",
  },
  {
    code: "ES",
    alpha3: "ESP",
    name: "Spain",
  },
  {
    code: "LK",
    alpha3: "LKA",
    name: "Sri Lanka",
  },
  {
    code: "SD",
    alpha3: "SDN",
    name: "Sudan (the)",
  },
  {
    code: "SR",
    alpha3: "SUR",
    name: "Suriname",
  },
  {
    code: "SJ",
    alpha3: "SJM",
    name: "Svalbard and Jan Mayen",
  },
  {
    code: "SE",
    alpha3: "SWE",
    name: "Sweden",
  },
  {
    code: "CH",
    alpha3: "CHE",
    name: "Switzerland",
  },
  {
    code: "SY",
    alpha3: "SYR",
    name: "Syrian Arab Republic",
  },
  {
    code: "TW",
    alpha3: "TWN",
    name: "Taiwan (Province of China)",
  },
  {
    code: "TJ",
    alpha3: "TJK",
    name: "Tajikistan",
  },
  {
    code: "TZ",
    alpha3: "TZA",
    name: "Tanzania, United Republic of",
  },
  {
    code: "TH",
    alpha3: "THA",
    name: "Thailand",
  },
  {
    code: "TL",
    alpha3: "TLS",
    name: "Timor-Leste",
  },
  {
    code: "TG",
    alpha3: "TGO",
    name: "Togo",
  },
  {
    code: "TK",
    alpha3: "TKL",
    name: "Tokelau",
  },
  {
    code: "TO",
    alpha3: "TON",
    name: "Tonga",
  },
  {
    code: "TT",
    alpha3: "TTO",
    name: "Trinidad and Tobago",
  },
  {
    code: "TN",
    alpha3: "TUN",
    name: "Tunisia",
  },
  {
    code: "TR",
    alpha3: "TUR",
    name: "Turkey",
  },
  {
    code: "TM",
    alpha3: "TKM",
    name: "Turkmenistan",
  },
  {
    code: "TC",
    alpha3: "TCA",
    name: "Turks and Caicos Islands (the)",
  },
  {
    code: "TV",
    alpha3: "TUV",
    name: "Tuvalu",
  },
  {
    code: "UG",
    alpha3: "UGA",
    name: "Uganda",
  },
  {
    code: "UA",
    alpha3: "UKR",
    name: "Ukraine",
  },
  {
    code: "AE",
    alpha3: "ARE",
    name: "United Arab Emirates (the)",
  },
  {
    code: "GB",
    alpha3: "GBR",
    name: "United Kingdom of Great Britain and Northern Ireland (the)",
  },
  {
    code: "UM",
    alpha3: "UMI",
    name: "United States Minor Outlying Islands (the)",
  },
  {
    code: "US",
    alpha3: "USA",
    name: "United States of America (the)",
  },
  {
    code: "UY",
    alpha3: "URY",
    name: "Uruguay",
  },
  {
    code: "UZ",
    alpha3: "UZB",
    name: "Uzbekistan",
  },
  {
    code: "VU",
    alpha3: "VUT",
    name: "Vanuatu",
  },
  {
    code: "VE",
    alpha3: "VEN",
    name: "Venezuela (Bolivarian Republic of)",
  },
  {
    code: "VN",
    alpha3: "VNM",
    name: "Viet Nam",
  },
  {
    code: "VG",
    alpha3: "VGB",
    name: "Virgin Islands (British)",
  },
  {
    code: "VI",
    alpha3: "VIR",
    name: "Virgin Islands (U.S.)",
  },
  {
    code: "WF",
    alpha3: "WLF",
    name: "Wallis and Futuna",
  },
  {
    code: "EH",
    alpha3: "ESH",
    name: "Western Sahara",
  },
  {
    code: "YE",
    alpha3: "YEM",
    name: "Yemen",
  },
  {
    code: "ZM",
    alpha3: "ZMB",
    name: "Zambia",
  },
  {
    code: "ZW",
    alpha3: "ZWE",
    name: "Zimbabwe",
  },
  {
    code: "AX",
    alpha3: "ALA",
    name: "Åland Islands",
  },
];

export const investecCountriesBlock = {
  type: "investec_countries",
  message0: "country: %1",
  args0: [
    {
      type: "field_dropdown",
      name: "COUNTRY",
      options: countries.map((country) => {
        return [country.name, country.code];
      }),
    },
  ],
  output: String,
  colour: 230,
};

export function installCountriesBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecCountriesBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_countries"] = countriesGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const countriesGenerator = function (block) {
  var mode = block.getFieldValue("COUNTRY");
  return [mode, Order.ATOMIC]; // Simplified returns as well.
};
