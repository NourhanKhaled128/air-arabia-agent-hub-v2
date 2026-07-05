export interface Airport {
  code: string;
  city: string;
  airport: string;
  country: string;
}

export const airports: Airport[] = [
  {
    code: "SHJ",
    city: "Sharjah",
    airport: "Sharjah International Airport",
    country: "United Arab Emirates",
  },
  {
    code: "DXB",
    city: "Dubai",
    airport: "Dubai International Airport",
    country: "United Arab Emirates",
  },
  {
    code: "AUH",
    city: "Abu Dhabi",
    airport: "Zayed International Airport",
    country: "United Arab Emirates",
  },
  {
    code: "CAI",
    city: "Cairo",
    airport: "Cairo International Airport",
    country: "Egypt",
  },
  {
    code: "AMM",
    city: "Amman",
    airport: "Queen Alia International Airport",
    country: "Jordan",
  },
  {
    code: "DOH",
    city: "Doha",
    airport: "Hamad International Airport",
    country: "Qatar",
  },
  {
    code: "RUH",
    city: "Riyadh",
    airport: "King Khalid International Airport",
    country: "Saudi Arabia",
  },
  {
    code: "JED",
    city: "Jeddah",
    airport: "King Abdulaziz International Airport",
    country: "Saudi Arabia",
  },
  {
    code: "MCT",
    city: "Muscat",
    airport: "Muscat International Airport",
    country: "Oman",
  },
  {
    code: "KWI",
    city: "Kuwait City",
    airport: "Kuwait International Airport",
    country: "Kuwait",
  },
];