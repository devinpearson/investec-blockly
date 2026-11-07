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
  MERCHANT_COUNTRY_NAME: {
    label: "merchant country name",
    path: "merchant.country.name",
  },
  MERCHANT_CATEGORY_NAME: {
    label: "merchant category name",
    path: "merchant.category.name",
  },
  CARD_ID: { label: "card ID", path: "card.id" },
  TYPE: { label: "transaction type", path: "type" },
} satisfies Record<string, { label: string; path: string }>;

export type CardField = keyof typeof cardFields;

export const cardFieldOptions: [string, string][] = Object.entries(
  cardFields,
).map(([value, { label }]) => [label, value]);
