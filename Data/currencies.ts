export interface Currency {
  code: string;
  name: string;
  rate: number;
}

export const currencies: Currency[] = [
  { code: "AED", name: "UAE Dirham", rate: 1 },
  { code: "USD", name: "US Dollar", rate: 3.67 },
  { code: "EUR", name: "Euro", rate: 4.00 },
  { code: "GBP", name: "British Pound", rate: 4.70 },
  { code: "SAR", name: "Saudi Riyal", rate: 0.98 },
  { code: "KWD", name: "Kuwaiti Dinar", rate: 11.90 },
  { code: "QAR", name: "Qatari Riyal", rate: 1.01 },
  { code: "OMR", name: "Omani Rial", rate: 9.53 },
  { code: "BHD", name: "Bahraini Dinar", rate: 9.74 },
  { code: "EGP", name: "Egyptian Pound", rate: 0.074 },
];