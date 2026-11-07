import { categoryColours } from "../blocks/colours";
export const datetime = {
  kind: "category",
  name: "Date & Time",
  colour: categoryColours.time,
  contents: [
    { kind: "block", type: "investec_time_part" },
    { kind: "block", type: "investec_time_is_weekend" },
    { kind: "block", type: "investec_time_weekday_is" },
    { kind: "block", type: "investec_time_between" },
    { kind: "block", type: "investec_time_text" },
  ],
};
