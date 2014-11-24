
The JSON schema for the FastJ header is as follows:

```javascript
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "FastJ Schema",
  "type": "object",
  "properties": {

    "tileID": {
        "type": "string",
        "pattern" : "^(([0-9a-fA-F]+)\\.){3}([0-9a-fA-F]+)$"
    },

    "md5sum" : {
        "description": "The md5sum of the body block (excluding whitespace)",
        "type": "string"
    },

    "locus": {

        "type": "array",
        "items" : {
            "type": "object",
            "properties" : {
              "build" : {
                  "type" : "string"
                }
            }
        }

    },

    "n": {
        "description": "Length of the tile sequence",
        "type": "integer",
        "minimum": 0
    },

    "seedTileLength": {
        "description": "The number of seed tile lengths",
        "type": "integer",
        "minimum": 1
    },

    "nocallCount": {
        "description": "The number of no-call positions in the body",
        "type": "integer",
        "minimum": 0
    },

    "startSeq" : {
        "description": "Start sequence as it appears in the body",
        "type": "string"
    },

    "endSeq" : {
        "description": "End sequence as it appears in the body",
        "type": "string"
    },

    "startTag" : {
        "description": "Start tag",
        "type": "string"
    },

    "endTag" : {
        "description": "End tag",
        "type": "string"
    },

    "notes": {

        "type": "array",
        "items" : { "type": "string" }

    }

  },

  "required": [ "tileID" ]

}
```
