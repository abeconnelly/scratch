
Draft of schema for CGF v1:

```javascript
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "CGF v1 Schema",
  "type": "object",
  "properties": {

    "#!cgf": {
      "description": "Magic token for hints in what format the file is in",
      "type": "string"
     },

    "CGFVersion" : {
      "description": "CGF Version",
      "type": "string"
    },

    "Encoding" : {
      "type": "string"
    },

    "Notes" : {
      "type": "string"
    },

    "TileLibraryVersion" : {
      "description": "Version of the tile library used",
      "type": "string"
    },

    "ABV": {
      "type": "object",
      "additionalProperites" : "string"
    },

    "CharMap": {
      "type" : "object",
      "additionalProperites" : "string"
    },

    "PathCount" : {
      "description": "Number of paths",
      "type": "integer",
      "minimum": 0
    },

    "StepPerPath" : {
      "description": "Length of each path",
      "type": "array",
      "items" : { "type": "number" }
    },

    "TotalStep" : {
      "description": "Sum of StepPerPath",
      "type": "number",
      "minimum" : 0
    },

    "CanonicalCharMap": {
      "description": "Default character map to use",
      "type": "string"
    },

    "ReserveCharCount": {
      "description": "Number of reserved characters (at end)",
      "type": "integer",
      "minimum": 0
    },

    "EncodedTileMapMd5Sum": {
      "description": "Md5Sum of EncodedTileMap",
      "type": "string"
    },

    "EncodedTileMap" : {
      "description": "Tile map encoded as a string",
      "type": "string"
    },

    "OverflowMap" : {
      "description": "Map of path:step to tile map entry",
      "type": "object",
      "additionalProperites" : "int"
    },

    "FinalOverflowMap" : {
      "description": "Map of path:step to data of tile not found in tile map",
      "type": "object",
      "properties": {
        "Type" : { "type" : "string" },
        "Data" : { "type" : "string" }
      },
      "additionalProperites" : "string"
    }

  },

  "required": [ "#!cgf" ]

}
```

Example:

```javascript
{"#!cgf":"a",
      "CGFVersion" : "0.1",

      "Encoding" : "utf8",
      "Notes" : "ABV Version 0.3",

       "TileLibraryVersion" : "0.1.2",


      "PathCount" : 3,
      "StepPerPath" : [ 35, 32, 38 ],
      "TotalStep" : 108,

      "EncodedTileMap":"_.0:0;_*0:0;x.1:0;x.0:1;x*1:0;x*0:1;_.1:1;_.1:1;x.2,5:3;x*35:128",
      "EncodedTileMapMd5Sum":"1813f1d7d917cf520d3ad2a8b24231a4",

      "TileMap" : [
        { "Type" : "hom", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [0],[0] ] },
        { "Type" : "hom*", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [0],[0] ] },
        { "Type" : "het", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [1],[0] ] },
        { "Type" : "het", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [0],[1] ] },
        { "Type" : "het*", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [1],[0] ] },
        { "Type" : "het*", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [0],[1] ] },
        { "Type" : "hom", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [1],[1] ] },
        { "Type" : "hom", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [ [1],[1] ] },
        { "Type" : "het", "VariantLength" : [[1,1],[2]], "Ploidy":2, "Variant" : [[2,5],[3]] },
        { "Type" : "het*", "VariantLength" : [[1],[1]], "Ploidy":2, "Variant" : [[35],[128]] }
      ],

      "CharMap" : { "." :  0,
                    "A" :  0, "B" :  1, "C" :  2, "D" :  3, "E" :  4, "F" :  5, "G" :  6, "H" :  7, "I" :  8,
                    "J" :  9, "K" : 10, "L" : 11, "M" : 12, "N" : 13, "O" : 14, "P" : 15, "Q" : 16, "R" : 17,
                    "S" : 18, "T" : 19, "U" : 20, "V" : 21, "W" : 22, "X" : 23, "Y" : 24, "Z" : 25, "a" : 26,
                    "b" : 27, "c" : 28, "d" : 29, "e" : 30, "f" : 31, "g" : 32, "h" : 33, "i" : 34, "j" : 35,
                    "k" : 36, "l" : 37, "m" : 38, "n" : 39, "o" : 40, "p" : 41, "q" : 42, "r" : 43, "s" : 44,
                    "t" : 45, "u" : 46, "v" : 47, "w" : 48, "x" : 49, "y" : 50, "z" : 51, "0" : 52, "1" : 53,
                    "2" : 54, "3" : 55, "4" : 56, "5" : 57, "6" : 58, "7" : 59,

                    "^" : -4, "-" : -3, "*" : -2, "#" : -1,
                    "8" : 60, "9" : 61, "+" : 62, "/" : 63
                  },

      "ABV" : {
        "0" : "----------...----D--..#..DD-----",
        "1" : "--***G-....-A--#--..#....E---",
        "2" : "-...----***C-....-A--#--..#....F---"
      },
      "OverflowMap" : {
        "0:16" : 5,
        "1:f" : 3,
        "1:14" : 1,
        "2:15" : 7
      },

      "FinalOverflowMap" : {
        "2:1a" : {
          "Type" : "FastJ",
          "Data" : "> { \"tileID\" : \"002.00.001a.000\", \"md5sum\":\"674e7222996958b1a7f7f2d4fc2f3d3a\", \"locus\":[{\"build\":\"hg19 chr1 5406075 5406324\"}], \"n\":249, \"copy\":0, \"startSeq\":\"tttccaaaataaccactaagctca\", \"endSeq\":\"CCAATTGCCGAAATACCTAACAGC\", \"startTag\":\"TTTCCAAAATAACCACTAAGCTCA\", \"endTag\":\"CCAATTGCCGAAATACCTAACAGC\", \"notes\":[\"hg19 chr1 5406120 5406120 GAP 45 1\", \"Phase (RANDOM) A\"]}\nTTTCCAAAATAACCACTAAGCTCAtgggaaaactgggtgacttcatcccc\nacccccaactctggaaatgaaagccactcccactgctgatctctcccttc\ntcttggccatcaggcaatccagctggcccttgcctagatgatgtgacagg\ntgagagtcaggctccaatcccaggctctgcaaagtctggggcttcgatca\naatcctcccaagcactctgttaccaCCAATTGCCGAAATACCTAACAGC"
        }
      }
}
```
