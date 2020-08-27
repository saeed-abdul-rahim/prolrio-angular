const callingCodes = [
    {
        name: 'Afghanistan',
        callingCode: '+93',
        code: 'AF'
    },
    {
        name: 'Aland Islands',
        callingCode: '+358',
        code: 'AX'
    },
    {
        name: 'Albania',
        callingCode: '+355',
        code: 'AL'
    },
    {
        name: 'Algeria',
        callingCode: '+213',
        code: 'DZ'
    },
    {
        name: 'AmericanSamoa',
        callingCode: '+1684',
        code: 'AS'
    },
    {
        name: 'Andorra',
        callingCode: '+376',
        code: 'AD'
    },
    {
        name: 'Angola',
        callingCode: '+244',
        code: 'AO'
    },
    {
        name: 'Anguilla',
        callingCode: '+1264',
        code: 'AI'
    },
    {
        name: 'Antarctica',
        callingCode: '+672',
        code: 'AQ'
    },
    {
        name: 'Antigua and Barbuda',
        callingCode: '+1268',
        code: 'AG'
    },
    {
        name: 'Argentina',
        callingCode: '+54',
        code: 'AR'
    },
    {
        name: 'Armenia',
        callingCode: '+374',
        code: 'AM'
    },
    {
        name: 'Aruba',
        callingCode: '+297',
        code: 'AW'
    },
    {
        name: 'Australia',
        callingCode: '+61',
        code: 'AU'
    },
    {
        name: 'Austria',
        callingCode: '+43',
        code: 'AT'
    },
    {
        name: 'Azerbaijan',
        callingCode: '+994',
        code: 'AZ'
    },
    {
        name: 'Bahamas',
        callingCode: '+1242',
        code: 'BS'
    },
    {
        name: 'Bahrain',
        callingCode: '+973',
        code: 'BH'
    },
    {
        name: 'Bangladesh',
        callingCode: '+880',
        code: 'BD'
    },
    {
        name: 'Barbados',
        callingCode: '+1246',
        code: 'BB'
    },
    {
        name: 'Belarus',
        callingCode: '+375',
        code: 'BY'
    },
    {
        name: 'Belgium',
        callingCode: '+32',
        code: 'BE'
    },
    {
        name: 'Belize',
        callingCode: '+501',
        code: 'BZ'
    },
    {
        name: 'Benin',
        callingCode: '+229',
        code: 'BJ'
    },
    {
        name: 'Bermuda',
        callingCode: '+1441',
        code: 'BM'
    },
    {
        name: 'Bhutan',
        callingCode: '+975',
        code: 'BT'
    },
    {
        name: 'Bolivia, Plurinational State of',
        callingCode: '+591',
        code: 'BO'
    },
    {
        name: 'Bosnia and Herzegovina',
        callingCode: '+387',
        code: 'BA'
    },
    {
        name: 'Botswana',
        callingCode: '+267',
        code: 'BW'
    },
    {
        name: 'Brazil',
        callingCode: '+55',
        code: 'BR'
    },
    {
        name: 'British Indian Ocean Territory',
        callingCode: '+246',
        code: 'IO'
    },
    {
        name: 'Brunei Darussalam',
        callingCode: '+673',
        code: 'BN'
    },
    {
        name: 'Bulgaria',
        callingCode: '+359',
        code: 'BG'
    },
    {
        name: 'Burkina Faso',
        callingCode: '+226',
        code: 'BF'
    },
    {
        name: 'Burundi',
        callingCode: '+257',
        code: 'BI'
    },
    {
        name: 'Cambodia',
        callingCode: '+855',
        code: 'KH'
    },
    {
        name: 'Cameroon',
        callingCode: '+237',
        code: 'CM'
    },
    {
        name: 'Canada',
        callingCode: '+1',
        code: 'CA'
    },
    {
        name: 'Cape Verde',
        callingCode: '+238',
        code: 'CV'
    },
    {
        name: 'Cayman Islands',
        callingCode: '+ 345',
        code: 'KY'
    },
    {
        name: 'Central African Republic',
        callingCode: '+236',
        code: 'CF'
    },
    {
        name: 'Chad',
        callingCode: '+235',
        code: 'TD'
    },
    {
        name: 'Chile',
        callingCode: '+56',
        code: 'CL'
    },
    {
        name: 'China',
        callingCode: '+86',
        code: 'CN'
    },
    {
        name: 'Christmas Island',
        callingCode: '+61',
        code: 'CX'
    },
    {
        name: 'Cocos (Keeling) Islands',
        callingCode: '+61',
        code: 'CC'
    },
    {
        name: 'Colombia',
        callingCode: '+57',
        code: 'CO'
    },
    {
        name: 'Comoros',
        callingCode: '+269',
        code: 'KM'
    },
    {
        name: 'Congo',
        callingCode: '+242',
        code: 'CG'
    },
    {
        name: 'Congo, The Democratic Republic of the Congo',
        callingCode: '+243',
        code: 'CD'
    },
    {
        name: 'Cook Islands',
        callingCode: '+682',
        code: 'CK'
    },
    {
        name: 'Costa Rica',
        callingCode: '+506',
        code: 'CR'
    },
    {
        name: 'Cote d\'Ivoire',
        callingCode: '+225',
        code: 'CI'
    },
    {
        name: 'Croatia',
        callingCode: '+385',
        code: 'HR'
    },
    {
        name: 'Cuba',
        callingCode: '+53',
        code: 'CU'
    },
    {
        name: 'Cyprus',
        callingCode: '+357',
        code: 'CY'
    },
    {
        name: 'Czech Republic',
        callingCode: '+420',
        code: 'CZ'
    },
    {
        name: 'Denmark',
        callingCode: '+45',
        code: 'DK'
    },
    {
        name: 'Djibouti',
        callingCode: '+253',
        code: 'DJ'
    },
    {
        name: 'Dominica',
        callingCode: '+1767',
        code: 'DM'
    },
    {
        name: 'Dominican Republic',
        callingCode: '+1849',
        code: 'DO'
    },
    {
        name: 'Ecuador',
        callingCode: '+593',
        code: 'EC'
    },
    {
        name: 'Egypt',
        callingCode: '+20',
        code: 'EG'
    },
    {
        name: 'El Salvador',
        callingCode: '+503',
        code: 'SV'
    },
    {
        name: 'Equatorial Guinea',
        callingCode: '+240',
        code: 'GQ'
    },
    {
        name: 'Eritrea',
        callingCode: '+291',
        code: 'ER'
    },
    {
        name: 'Estonia',
        callingCode: '+372',
        code: 'EE'
    },
    {
        name: 'Ethiopia',
        callingCode: '+251',
        code: 'ET'
    },
    {
        name: 'Falkland Islands (Malvinas)',
        callingCode: '+500',
        code: 'FK'
    },
    {
        name: 'Faroe Islands',
        callingCode: '+298',
        code: 'FO'
    },
    {
        name: 'Fiji',
        callingCode: '+679',
        code: 'FJ'
    },
    {
        name: 'Finland',
        callingCode: '+358',
        code: 'FI'
    },
    {
        name: 'France',
        callingCode: '+33',
        code: 'FR'
    },
    {
        name: 'French Guiana',
        callingCode: '+594',
        code: 'GF'
    },
    {
        name: 'French Polynesia',
        callingCode: '+689',
        code: 'PF'
    },
    {
        name: 'Gabon',
        callingCode: '+241',
        code: 'GA'
    },
    {
        name: 'Gambia',
        callingCode: '+220',
        code: 'GM'
    },
    {
        name: 'Georgia',
        callingCode: '+995',
        code: 'GE'
    },
    {
        name: 'Germany',
        callingCode: '+49',
        code: 'DE'
    },
    {
        name: 'Ghana',
        callingCode: '+233',
        code: 'GH'
    },
    {
        name: 'Gibraltar',
        callingCode: '+350',
        code: 'GI'
    },
    {
        name: 'Greece',
        callingCode: '+30',
        code: 'GR'
    },
    {
        name: 'Greenland',
        callingCode: '+299',
        code: 'GL'
    },
    {
        name: 'Grenada',
        callingCode: '+1473',
        code: 'GD'
    },
    {
        name: 'Guadeloupe',
        callingCode: '+590',
        code: 'GP'
    },
    {
        name: 'Guam',
        callingCode: '+1671',
        code: 'GU'
    },
    {
        name: 'Guatemala',
        callingCode: '+502',
        code: 'GT'
    },
    {
        name: 'Guernsey',
        callingCode: '+44',
        code: 'GG'
    },
    {
        name: 'Guinea',
        callingCode: '+224',
        code: 'GN'
    },
    {
        name: 'Guinea-Bissau',
        callingCode: '+245',
        code: 'GW'
    },
    {
        name: 'Guyana',
        callingCode: '+595',
        code: 'GY'
    },
    {
        name: 'Haiti',
        callingCode: '+509',
        code: 'HT'
    },
    {
        name: 'Holy See (Vatican City State)',
        callingCode: '+379',
        code: 'VA'
    },
    {
        name: 'Honduras',
        callingCode: '+504',
        code: 'HN'
    },
    {
        name: 'Hong Kong',
        callingCode: '+852',
        code: 'HK'
    },
    {
        name: 'Hungary',
        callingCode: '+36',
        code: 'HU'
    },
    {
        name: 'Iceland',
        callingCode: '+354',
        code: 'IS'
    },
    {
        name: 'India',
        callingCode: '+91',
        code: 'IN'
    },
    {
        name: 'Indonesia',
        callingCode: '+62',
        code: 'ID'
    },
    {
        name: 'Iran, Islamic Republic of Persian Gulf',
        callingCode: '+98',
        code: 'IR'
    },
    {
        name: 'Iraq',
        callingCode: '+964',
        code: 'IQ'
    },
    {
        name: 'Ireland',
        callingCode: '+353',
        code: 'IE'
    },
    {
        name: 'Isle of Man',
        callingCode: '+44',
        code: 'IM'
    },
    {
        name: 'Israel',
        callingCode: '+972',
        code: 'IL'
    },
    {
        name: 'Italy',
        callingCode: '+39',
        code: 'IT'
    },
    {
        name: 'Jamaica',
        callingCode: '+1876',
        code: 'JM'
    },
    {
        name: 'Japan',
        callingCode: '+81',
        code: 'JP'
    },
    {
        name: 'Jersey',
        callingCode: '+44',
        code: 'JE'
    },
    {
        name: 'Jordan',
        callingCode: '+962',
        code: 'JO'
    },
    {
        name: 'Kazakhstan',
        callingCode: '+77',
        code: 'KZ'
    },
    {
        name: 'Kenya',
        callingCode: '+254',
        code: 'KE'
    },
    {
        name: 'Kiribati',
        callingCode: '+686',
        code: 'KI'
    },
    {
        name: 'Korea, Democratic People\'s Republic of Korea',
        callingCode: '+850',
        code: 'KP'
    },
    {
        name: 'Korea, Republic of South Korea',
        callingCode: '+82',
        code: 'KR'
    },
    {
        name: 'Kuwait',
        callingCode: '+965',
        code: 'KW'
    },
    {
        name: 'Kyrgyzstan',
        callingCode: '+996',
        code: 'KG'
    },
    {
        name: 'Laos',
        callingCode: '+856',
        code: 'LA'
    },
    {
        name: 'Latvia',
        callingCode: '+371',
        code: 'LV'
    },
    {
        name: 'Lebanon',
        callingCode: '+961',
        code: 'LB'
    },
    {
        name: 'Lesotho',
        callingCode: '+266',
        code: 'LS'
    },
    {
        name: 'Liberia',
        callingCode: '+231',
        code: 'LR'
    },
    {
        name: 'Libyan Arab Jamahiriya',
        callingCode: '+218',
        code: 'LY'
    },
    {
        name: 'Liechtenstein',
        callingCode: '+423',
        code: 'LI'
    },
    {
        name: 'Lithuania',
        callingCode: '+370',
        code: 'LT'
    },
    {
        name: 'Luxembourg',
        callingCode: '+352',
        code: 'LU'
    },
    {
        name: 'Macao',
        callingCode: '+853',
        code: 'MO'
    },
    {
        name: 'Macedonia',
        callingCode: '+389',
        code: 'MK'
    },
    {
        name: 'Madagascar',
        callingCode: '+261',
        code: 'MG'
    },
    {
        name: 'Malawi',
        callingCode: '+265',
        code: 'MW'
    },
    {
        name: 'Malaysia',
        callingCode: '+60',
        code: 'MY'
    },
    {
        name: 'Maldives',
        callingCode: '+960',
        code: 'MV'
    },
    {
        name: 'Mali',
        callingCode: '+223',
        code: 'ML'
    },
    {
        name: 'Malta',
        callingCode: '+356',
        code: 'MT'
    },
    {
        name: 'Marshall Islands',
        callingCode: '+692',
        code: 'MH'
    },
    {
        name: 'Martinique',
        callingCode: '+596',
        code: 'MQ'
    },
    {
        name: 'Mauritania',
        callingCode: '+222',
        code: 'MR'
    },
    {
        name: 'Mauritius',
        callingCode: '+230',
        code: 'MU'
    },
    {
        name: 'Mayotte',
        callingCode: '+262',
        code: 'YT'
    },
    {
        name: 'Mexico',
        callingCode: '+52',
        code: 'MX'
    },
    {
        name: 'Micronesia, Federated States of Micronesia',
        callingCode: '+691',
        code: 'FM'
    },
    {
        name: 'Moldova',
        callingCode: '+373',
        code: 'MD'
    },
    {
        name: 'Monaco',
        callingCode: '+377',
        code: 'MC'
    },
    {
        name: 'Mongolia',
        callingCode: '+976',
        code: 'MN'
    },
    {
        name: 'Montenegro',
        callingCode: '+382',
        code: 'ME'
    },
    {
        name: 'Montserrat',
        callingCode: '+1664',
        code: 'MS'
    },
    {
        name: 'Morocco',
        callingCode: '+212',
        code: 'MA'
    },
    {
        name: 'Mozambique',
        callingCode: '+258',
        code: 'MZ'
    },
    {
        name: 'Myanmar',
        callingCode: '+95',
        code: 'MM'
    },
    {
        name: 'Namibia',
        callingCode: '+264',
        code: 'NA'
    },
    {
        name: 'Nauru',
        callingCode: '+674',
        code: 'NR'
    },
    {
        name: 'Nepal',
        callingCode: '+977',
        code: 'NP'
    },
    {
        name: 'Netherlands',
        callingCode: '+31',
        code: 'NL'
    },
    {
        name: 'Netherlands Antilles',
        callingCode: '+599',
        code: 'AN'
    },
    {
        name: 'New Caledonia',
        callingCode: '+687',
        code: 'NC'
    },
    {
        name: 'New Zealand',
        callingCode: '+64',
        code: 'NZ'
    },
    {
        name: 'Nicaragua',
        callingCode: '+505',
        code: 'NI'
    },
    {
        name: 'Niger',
        callingCode: '+227',
        code: 'NE'
    },
    {
        name: 'Nigeria',
        callingCode: '+234',
        code: 'NG'
    },
    {
        name: 'Niue',
        callingCode: '+683',
        code: 'NU'
    },
    {
        name: 'Norfolk Island',
        callingCode: '+672',
        code: 'NF'
    },
    {
        name: 'Northern Mariana Islands',
        callingCode: '+1670',
        code: 'MP'
    },
    {
        name: 'Norway',
        callingCode: '+47',
        code: 'NO'
    },
    {
        name: 'Oman',
        callingCode: '+968',
        code: 'OM'
    },
    {
        name: 'Pakistan',
        callingCode: '+92',
        code: 'PK'
    },
    {
        name: 'Palau',
        callingCode: '+680',
        code: 'PW'
    },
    {
        name: 'Palestinian Territory, Occupied',
        callingCode: '+970',
        code: 'PS'
    },
    {
        name: 'Panama',
        callingCode: '+507',
        code: 'PA'
    },
    {
        name: 'Papua New Guinea',
        callingCode: '+675',
        code: 'PG'
    },
    {
        name: 'Paraguay',
        callingCode: '+595',
        code: 'PY'
    },
    {
        name: 'Peru',
        callingCode: '+51',
        code: 'PE'
    },
    {
        name: 'Philippines',
        callingCode: '+63',
        code: 'PH'
    },
    {
        name: 'Pitcairn',
        callingCode: '+872',
        code: 'PN'
    },
    {
        name: 'Poland',
        callingCode: '+48',
        code: 'PL'
    },
    {
        name: 'Portugal',
        callingCode: '+351',
        code: 'PT'
    },
    {
        name: 'Puerto Rico',
        callingCode: '+1939',
        code: 'PR'
    },
    {
        name: 'Qatar',
        callingCode: '+974',
        code: 'QA'
    },
    {
        name: 'Romania',
        callingCode: '+40',
        code: 'RO'
    },
    {
        name: 'Russia',
        callingCode: '+7',
        code: 'RU'
    },
    {
        name: 'Rwanda',
        callingCode: '+250',
        code: 'RW'
    },
    {
        name: 'Reunion',
        callingCode: '+262',
        code: 'RE'
    },
    {
        name: 'Saint Barthelemy',
        callingCode: '+590',
        code: 'BL'
    },
    {
        name: 'Saint Helena, Ascension and Tristan Da Cunha',
        callingCode: '+290',
        code: 'SH'
    },
    {
        name: 'Saint Kitts and Nevis',
        callingCode: '+1869',
        code: 'KN'
    },
    {
        name: 'Saint Lucia',
        callingCode: '+1758',
        code: 'LC'
    },
    {
        name: 'Saint Martin',
        callingCode: '+590',
        code: 'MF'
    },
    {
        name: 'Saint Pierre and Miquelon',
        callingCode: '+508',
        code: 'PM'
    },
    {
        name: 'Saint Vincent and the Grenadines',
        callingCode: '+1784',
        code: 'VC'
    },
    {
        name: 'Samoa',
        callingCode: '+685',
        code: 'WS'
    },
    {
        name: 'San Marino',
        callingCode: '+378',
        code: 'SM'
    },
    {
        name: 'Sao Tome and Principe',
        callingCode: '+239',
        code: 'ST'
    },
    {
        name: 'Saudi Arabia',
        callingCode: '+966',
        code: 'SA'
    },
    {
        name: 'Senegal',
        callingCode: '+221',
        code: 'SN'
    },
    {
        name: 'Serbia',
        callingCode: '+381',
        code: 'RS'
    },
    {
        name: 'Seychelles',
        callingCode: '+248',
        code: 'SC'
    },
    {
        name: 'Sierra Leone',
        callingCode: '+232',
        code: 'SL'
    },
    {
        name: 'Singapore',
        callingCode: '+65',
        code: 'SG'
    },
    {
        name: 'Slovakia',
        callingCode: '+421',
        code: 'SK'
    },
    {
        name: 'Slovenia',
        callingCode: '+386',
        code: 'SI'
    },
    {
        name: 'Solomon Islands',
        callingCode: '+677',
        code: 'SB'
    },
    {
        name: 'Somalia',
        callingCode: '+252',
        code: 'SO'
    },
    {
        name: 'South Africa',
        callingCode: '+27',
        code: 'ZA'
    },
    {
        name: 'South Sudan',
        callingCode: '+211',
        code: 'SS'
    },
    {
        name: 'South Georgia and the South Sandwich Islands',
        callingCode: '+500',
        code: 'GS'
    },
    {
        name: 'Spain',
        callingCode: '+34',
        code: 'ES'
    },
    {
        name: 'Sri Lanka',
        callingCode: '+94',
        code: 'LK'
    },
    {
        name: 'Sudan',
        callingCode: '+249',
        code: 'SD'
    },
    {
        name: 'Suriname',
        callingCode: '+597',
        code: 'SR'
    },
    {
        name: 'Svalbard and Jan Mayen',
        callingCode: '+47',
        code: 'SJ'
    },
    {
        name: 'Swaziland',
        callingCode: '+268',
        code: 'SZ'
    },
    {
        name: 'Sweden',
        callingCode: '+46',
        code: 'SE'
    },
    {
        name: 'Switzerland',
        callingCode: '+41',
        code: 'CH'
    },
    {
        name: 'Syrian Arab Republic',
        callingCode: '+963',
        code: 'SY'
    },
    {
        name: 'Taiwan',
        callingCode: '+886',
        code: 'TW'
    },
    {
        name: 'Tajikistan',
        callingCode: '+992',
        code: 'TJ'
    },
    {
        name: 'Tanzania, United Republic of Tanzania',
        callingCode: '+255',
        code: 'TZ'
    },
    {
        name: 'Thailand',
        callingCode: '+66',
        code: 'TH'
    },
    {
        name: 'Timor-Leste',
        callingCode: '+670',
        code: 'TL'
    },
    {
        name: 'Togo',
        callingCode: '+228',
        code: 'TG'
    },
    {
        name: 'Tokelau',
        callingCode: '+690',
        code: 'TK'
    },
    {
        name: 'Tonga',
        callingCode: '+676',
        code: 'TO'
    },
    {
        name: 'Trinidad and Tobago',
        callingCode: '+1868',
        code: 'TT'
    },
    {
        name: 'Tunisia',
        callingCode: '+216',
        code: 'TN'
    },
    {
        name: 'Turkey',
        callingCode: '+90',
        code: 'TR'
    },
    {
        name: 'Turkmenistan',
        callingCode: '+993',
        code: 'TM'
    },
    {
        name: 'Turks and Caicos Islands',
        callingCode: '+1649',
        code: 'TC'
    },
    {
        name: 'Tuvalu',
        callingCode: '+688',
        code: 'TV'
    },
    {
        name: 'Uganda',
        callingCode: '+256',
        code: 'UG'
    },
    {
        name: 'Ukraine',
        callingCode: '+380',
        code: 'UA'
    },
    {
        name: 'United Arab Emirates',
        callingCode: '+971',
        code: 'AE'
    },
    {
        name: 'United Kingdom',
        callingCode: '+44',
        code: 'GB'
    },
    {
        name: 'United States',
        callingCode: '+1',
        code: 'US'
    },
    {
        name: 'Uruguay',
        callingCode: '+598',
        code: 'UY'
    },
    {
        name: 'Uzbekistan',
        callingCode: '+998',
        code: 'UZ'
    },
    {
        name: 'Vanuatu',
        callingCode: '+678',
        code: 'VU'
    },
    {
        name: 'Venezuela, Bolivarian Republic of Venezuela',
        callingCode: '+58',
        code: 'VE'
    },
    {
        name: 'Vietnam',
        callingCode: '+84',
        code: 'VN'
    },
    {
        name: 'Virgin Islands, British',
        callingCode: '+1284',
        code: 'VG'
    },
    {
        name: 'Virgin Islands, U.S.',
        callingCode: '+1340',
        code: 'VI'
    },
    {
        name: 'Wallis and Futuna',
        callingCode: '+681',
        code: 'WF'
    },
    {
        name: 'Yemen',
        callingCode: '+967',
        code: 'YE'
    },
    {
        name: 'Zambia',
        callingCode: '+260',
        code: 'ZM'
    },
    {
        name: 'Zimbabwe',
        callingCode: '+263',
        code: 'ZW'
    }
];
export default callingCodes;
