// Fields shared by the `authorization` (beforeTransaction) and `transaction`
// (afterTransaction / afterDecline) objects, mapped to their property paths.
export const cardFields = {
  ACCOUNT_NUMBER: { label: "account number", path: "accountNumber" },
  DATETIME: { label: "datetime", path: "dateTime" },
  CURRENCY_CODE: { label: "currency code", path: "currencyCode" },
  REFERENCE: { label: "reference", path: "reference" },
  CENTS_AMOUNT: { label: "cents amount", path: "centsAmount" },
  MCC: { label: "merchant code", path: "merchant.category.code" },
  MERCHANT_NAME: { label: "merchant name", path: "merchant.name" },
  MERCHANT_CITY: { label: "merchant city", path: "merchant.city" },
  MERCHANT_COUNTRY: {
    label: "merchant country",
    path: "merchant.country.code",
  },
};

export const cardFieldOptions = Object.entries(cardFields).map(
  ([value, { label }]) => [label, value],
);
