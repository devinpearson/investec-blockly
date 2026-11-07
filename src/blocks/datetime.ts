import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import type { JavascriptGenerator } from "blockly/javascript";
import {
  HANDLER_TYPES,
  eventParamOf,
  requireHandler,
  type Generators,
  type ValueCode,
} from "./context";

// The card runtime preloads moment (moment-mini, no timezone database), so
// times are converted with a fixed UTC offset. dateTime is an ISO string in UTC.
const ZONES = [
  ["SAST", "120"],
  ["UTC", "0"],
];
const zoneArg = { type: "field_dropdown", name: "ZONE", options: ZONES };

type Part = { label: string; code: (moment: string) => string };

const PARTS: Record<string, Part> = {
  HOUR: { label: "hour (0–23)", code: (m) => `${m}.hour()` },
  MINUTE: { label: "minute", code: (m) => `${m}.minute()` },
  WEEKDAY: { label: "day of week (1 = Mon)", code: (m) => `${m}.isoWeekday()` },
  DAY: { label: "day of month", code: (m) => `${m}.date()` },
  MONTH: { label: "month (1–12)", code: (m) => `(${m}.month() + 1)` },
  YEAR: { label: "year", code: (m) => `${m}.year()` },
};

const PLACEMENT_WARNING =
  "Use this inside a before/after transaction or after decline block.";
const TIME_FORMAT = /^([01]?\d|2[0-3]):([0-5]\d)$/;

export const timePartBlock = {
  type: "investec_time_part",
  message0: "transaction %1 in %2",
  args0: [
    {
      type: "field_dropdown",
      name: "PART",
      options: Object.entries(PARTS).map(([value, { label }]) => [
        label,
        value,
      ]),
    },
    zoneArg,
  ],
  output: "Number",
  colour: 160,
  tooltip:
    "Part of the transaction's date and time, using moment. SAST is UTC+2.",
};

export const weekendBlock = {
  type: "investec_time_is_weekend",
  message0: "transaction is on a weekend in %1",
  args0: [zoneArg],
  output: "Boolean",
  colour: 160,
  tooltip: "True when the transaction happens on a Saturday or Sunday.",
};

export const timeBetweenBlock = {
  type: "investec_time_between",
  message0: "transaction time is between %1 and %2 in %3",
  args0: [
    { type: "field_input", name: "START", text: "22:00" },
    { type: "field_input", name: "END", text: "06:00" },
    zoneArg,
  ],
  output: "Boolean",
  colour: 160,
  extensions: ["investec_time_field_validators"],
  tooltip:
    "True when the transaction time (HH:MM, 24-hour) is from the start time " +
    "up to, but not including, the end time. Ranges may cross midnight, " +
    "e.g. 22:00 to 06:00.",
};

export const weekdayIsBlock = {
  type: "investec_time_weekday_is",
  message0: "transaction is on a %1 in %2",
  args0: [
    {
      type: "field_dropdown",
      name: "DAY",
      // Values are ISO weekdays (1 = Monday).
      options: [
        ["Monday", "1"],
        ["Tuesday", "2"],
        ["Wednesday", "3"],
        ["Thursday", "4"],
        ["Friday", "5"],
        ["Saturday", "6"],
        ["Sunday", "7"],
      ],
    },
    zoneArg,
  ],
  output: "Boolean",
  colour: 160,
  tooltip: "True when the transaction happens on the chosen day.",
};

const datetimeBlocks = [
  timePartBlock,
  weekendBlock,
  weekdayIsBlock,
  timeBetweenBlock,
];

function momentCode(block: Blockly.Block): string {
  const offset = Number(block.getFieldValue("ZONE"));
  return `moment(${eventParamOf(block)}.dateTime).utcOffset(${offset})`;
}

function toMinutes(time: string): number {
  // Fields are validated, but fall back to midnight for hand-edited saves.
  const [, hours = "0", minutes = "0"] = TIME_FORMAT.exec(time) ?? [];
  return Number(hours) * 60 + Number(minutes);
}

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => ValueCode
> = {
  investec_time_part(block) {
    const part = PARTS[block.getFieldValue("PART")] ?? PARTS.HOUR!;
    return [part.code(momentCode(block)), Order.FUNCTION_CALL];
  },
  investec_time_is_weekend(block) {
    return [`${momentCode(block)}.isoWeekday() >= 6`, Order.RELATIONAL];
  },
  investec_time_weekday_is(block) {
    const day = Number(block.getFieldValue("DAY"));
    return [`${momentCode(block)}.isoWeekday() === ${day}`, Order.EQUALITY];
  },
  investec_time_between(block, generator) {
    const minutesOfDay = generator.provideFunction_(
      "minutesOfDay",
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(m) {
  return m.hour() * 60 + m.minute();
}`,
    );
    const start = toMinutes(block.getFieldValue("START"));
    const end = toMinutes(block.getFieldValue("END"));
    const now = `${minutesOfDay}(${momentCode(block)})`;
    if (start <= end) {
      return [`${now} >= ${start} && ${now} < ${end}`, Order.LOGICAL_AND];
    }
    // The range crosses midnight.
    return [`${now} >= ${start} || ${now} < ${end}`, Order.LOGICAL_OR];
  },
};

export function installDateTimeBlocks(generatorsByLanguage: Generators = {}) {
  if (!Blockly.Extensions.isRegistered("investec_time_field_validators")) {
    Blockly.Extensions.register(
      "investec_time_field_validators",
      function (this: Blockly.Block) {
        // Reject anything that is not HH:MM; normalise to two-digit hours.
        const validator = (text: string) => {
          const match = TIME_FORMAT.exec(text.trim());
          return match ? `${match[1]!.padStart(2, "0")}:${match[2]}` : null;
        };
        this.getField("START")?.setValidator(validator);
        this.getField("END")?.setValidator(validator);
      },
    );
  }
  Blockly.defineBlocksWithJsonArray(datetimeBlocks);
  for (const { type } of datetimeBlocks) {
    requireHandler(type, HANDLER_TYPES, PLACEMENT_WARNING);
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
