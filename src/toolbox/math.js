export const math = {
    "kind": "category",
    "name": "Math",
    "categorystyle":"math_category",
    "contents": [
      {
        "kind": "block",
        "type": "math_number",
        "fields": {
          "NUM": 123
        }
      },
      {
        "kind": "block",
        "type": "math_arithmetic"
      },
      {
        "kind": "block",
        "type": "math_single"
      },
      {
              "kind":"block",
              "type":"math_random_int",
              "inputs":{
                "FROM":{
                  "block":{
                    "type":"math_number",
                    "fields":{
                      "NUM":1
                    }
                  }
                },
                "TO":{
                  "block":{
                    "type":"math_number",
                    "fields":{
                      "NUM":100
                    }
                  }
                }
              }
          }
    ]
  }