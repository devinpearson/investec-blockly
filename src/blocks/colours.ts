// Block colours by role. Saturated Tailwind 700 shades keep white block text
// readable and stand apart from Blockly's muted built-in categories (Logic,
// Math, Text, …), so Investec blocks are easy to tell from the rest.
export const colours = {
  /** before / after transaction, after decline */
  handler: "#4338CA", // indigo-700
  /** approve (green) and decline (red) */
  approve: "#047857", // emerald-700
  decline: "#B91C1C", // red-700
  /** values read from the card event: fields, amounts, code lists */
  data: "#0369A1", // sky-700
  /** yes/no checks on the card event */
  condition: "#A21CAF", // fuchsia-700
  /** date and time */
  time: "#B45309", // amber-700
  /** requests and notifications to other services */
  http: "#BE185D", // pink-700
  /** create object, key : value, get from object */
  object: "#0F766E", // teal-700
  /** environment variables */
  env: "#4D7C0F", // lime-700
  /** log */
  log: "#475569", // slate-600
} as const;

/** Toolbox category colours, matching the blocks they mostly hold. */
export const categoryColours = {
  card: colours.handler,
  templates: "#64748B", // slate-500: a mix of everything
  http: colours.http,
  time: colours.time,
} as const;
