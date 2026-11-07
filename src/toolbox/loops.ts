export const loops = {
  kind: "category",
  name: "Loops",
  categorystyle: "loop_category",
  contents: [
    {
      kind: "block",
      type: "controls_if",
    },
    {
      kind: "block",
      type: "controls_repeat_ext",
      inputs: {
        TIMES: {
          block: {
            type: "math_number",
            fields: {
              NUM: 10,
            },
          },
        },
      },
    },
    {
      kind: "block",
      type: "controls_whileUntil",
    },
    {
      kind: "block",
      type: "controls_for",
    },
    {
      kind: "block",
      type: "controls_forEach",
    },
    {
      kind: "block",
      type: "controls_flow_statements",
    },
  ],
};
