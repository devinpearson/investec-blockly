// Merchant category code (MCC) groups for common card rules. Each group is a
// list of inclusive [from, to] ranges of ISO 18245 codes.
export type MerchantGroup = {
  label: string;
  ranges: [number, number][];
};

export const merchantGroups = {
  FUEL: {
    label: "fuel",
    // Petroleum products, service stations, fuel dispensers, fuel dealers,
    // EV charging.
    ranges: [
      [5172, 5172],
      [5541, 5542],
      [5552, 5552],
      [5983, 5983],
    ],
  },
  GROCERIES: {
    label: "groceries",
    // Grocery stores, butchers, dairies, bakeries, misc. food stores.
    ranges: [
      [5411, 5411],
      [5422, 5422],
      [5441, 5441],
      [5451, 5451],
      [5462, 5462],
      [5499, 5499],
    ],
  },
  RESTAURANTS: {
    label: "restaurants & takeaways",
    // Restaurants, bars, fast food.
    ranges: [[5812, 5814]],
  },
  ALCOHOL: {
    label: "alcohol",
    // Bars and liquor stores.
    ranges: [
      [5813, 5813],
      [5921, 5921],
    ],
  },
  GAMBLING: {
    label: "gambling",
    // Betting, lotteries, casinos, government-owned lotteries.
    ranges: [
      [7800, 7802],
      [7995, 7995],
    ],
  },
  TRAVEL: {
    label: "travel",
    // Airlines, car rental, hotels, rail, travel agencies.
    ranges: [
      [3000, 3999],
      [4112, 4112],
      [4511, 4511],
      [4722, 4722],
      [7011, 7011],
      [7512, 7512],
    ],
  },
  TRANSPORT: {
    label: "transport & parking",
    // Commuter transport, taxis and rideshare, buses, tolls, parking.
    ranges: [
      [4111, 4111],
      [4121, 4121],
      [4131, 4131],
      [4784, 4784],
      [7523, 7523],
    ],
  },
  ONLINE: {
    label: "digital goods & online",
    // Digital goods, direct marketing / online retail.
    ranges: [
      [5815, 5818],
      [5960, 5969],
    ],
  },
  ENTERTAINMENT: {
    label: "entertainment",
    // Cinemas, theatre, bands, sports clubs, amusement, recreation.
    ranges: [
      [7832, 7832],
      [7922, 7922],
      [7929, 7929],
      [7991, 7994],
      [7996, 7999],
    ],
  },
  CLOTHING: {
    label: "clothing",
    ranges: [[5611, 5699]],
  },
  HEALTH: {
    label: "health & pharmacy",
    // Pharmacies, doctors, dentists, hospitals, labs, other health services.
    ranges: [
      [5912, 5912],
      [8011, 8099],
    ],
  },
  CASH: {
    label: "cash withdrawals",
    // Manual and automated cash disbursements.
    ranges: [[6010, 6011]],
  },
} satisfies Record<string, MerchantGroup>;

export type MerchantGroupKey = keyof typeof merchantGroups;

export const merchantGroupOptions: [string, string][] = Object.entries(
  merchantGroups,
).map(([value, { label }]) => [label, value]);

/** e.g. "5172, 5541–5542" for tooltips. */
export function describeRanges(ranges: [number, number][]): string {
  return ranges
    .map(([from, to]) => (from === to ? `${from}` : `${from}–${to}`))
    .join(", ");
}
