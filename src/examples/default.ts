// The starting point: log everything the card sees, before and after.
import { eventObject, handler, log } from "../blockly/snippets";

export const defaultExample = {
  blocks: {
    languageVersion: 0,
    blocks: [
      handler("investec_card_before_transaction", log(eventObject), 40, 40),
      handler("investec_card_after_transaction", log(eventObject), 40, 180),
    ],
  },
};
