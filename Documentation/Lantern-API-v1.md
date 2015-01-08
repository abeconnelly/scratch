Lantern API
===========

| Function | Input | Output | Description |
| --- | --- | --- | --- |
| [sample-tile-group-match](#sample-tile-group-match) | []SampleId, [][]TileVariant | []SampleId | Returns a list of sample IDs that match the specified tile variants |
| [sample-position-variant](#sample-position-variant) | []SampleId, []TilePosition | SampleTileVariantMap | Returns the tile variants of the samples at the input tile positions |
| [sample-tile-neighborhood](#sample-tile-neighborhood) | []SampleId, [][]TileVariantRange | SampleTileVariantMap | Returns tile IDs within the range of the matched criterea |
| [system-info](#system-info) | | Info | Returns information about the running Lantern server |
| [tile-sequence](#tile-sequence) | []TileVariant | TileSequenceMap | Returns the tile sequence |

Overview
========

Lantern accepts JSON queries in the form of a POST request.  All requests have a `Type` field which indicates which API funciton is being called.
The rest of the data is specific to the function.

For example, here is an API request for `system-info`:
```javascript
{
  "Type" : "system-info"
}
```

API Functions
=============

sample-tile-group-match
---

`Input` SampleId [SampleId](#SampleId) Array, TileGroupVariantId [TileVariant](#TileVariant) Array of Arrays

`Output` Result [SampleId](#SampleId) Array

The `SampleId` array holds the samples to query against.  The entire sample set is used if no `SampleId` parameter is passed in or if the empty array is specified.


The `TileVariant` array of arrays represents a conjunctive normal form query to match against the
sample set.
Each `TileVariant` element is grouped into an array, or clause,
and clauses are grouped together in the larger array to create the formula.
A match against the sample set is performed finding all tiles that simultaneously
match any of the tile variants in each clause.  That is, for a sample match to occur, the
sample's tile variants must match at least one element in each of the clauses.

If the first character in the `TileVariant` element is a tilde (`~`), then that element will match everything
but the tile variant specified.  For example, `"~247.00.00a.0003"` would match everything but tile variant
`0003`.

An array of sample identifiers is returned.

#### Example:

*request*
```javascript
{
  "Type":"sample-tile-group-match",
  "TileGroupVariantId":[
    [ "247.00.0000.0000","247.00.0002.0001" ]
  ]
}
```

*response*
```javascript
{
  "Type":"success",
  "Message":"sample-tile-group-match",
  "Result":["sample0","sample1","sample2"]
}
```

sample-position-variant
----

`Input` SampleId [SampleId](#SampleId) Array, Position [TilePosition](#TilePosition) Array

`Output` Result [SampleTileVariantMap](#SampleTileVariantMap)


The `SampleId` array holds the samples to query against.  The entire sample set is used if no `SampleId` parameter is passed in or if the empty array is specified.

The `TilePosition` array holds a list of the tile positions, without the trailing variant IDs.

The result is the samples tile variants returned as a map.  The map key is the sample ID.
Each map entry is an array of arrays holding the resulting tile IDs for each allele present.
For tile IDs spanning multiple seed tiles, a `+` suffix is attached followed by the
length of the tile in hex.

#### Example

*request*
```javascript
{
  "Type":"sample-position-variant",
  "SampleId": [],
  "Position":["247.00.0000+3","247.00.0009-f"]
}
```

*response*
```javascript
{
  "Type":"success",
  "Message":"sample_position_variant",
  "Result": {
    "sample0":[
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0000","247.00.000a.0002","247.00.000b.0000","247.00.000c.0000","247.00.000d.0004","247.00.000e.0000"],
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0001","247.00.0009.0002+2","247.00.000b.0004","247.00.000c.0001","247.00.000d.0004","247.00.000e.0000"]
    ],
    "sample1":[
      ["247.00.0000.0001","247.00.0001.0000","247.00.0002.0000","247.00.0009.0033","247.00.000a.0001","247.00.000b.0000","247.00.000c.0000","247.00.000d.0000","247.00.000e.0001"],
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0001","247.00.0009.0033","247.00.000a.0000","247.00.000b.0001","247.00.000c.0001","247.00.000d.0000","247.00.000e.0000"]
    ],
    "sample2":[
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0001+2","247.00.000b.0016","247.00.000c.0000","247.00.000d.0000","247.00.000e.0000"],
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0001+2","247.00.000b.0016","247.00.000c.0000","247.00.000d.0000","247.00.000e.0000"]
    ]
  }
}
```

sample-tile-neighborhood
----

`Input` SampleId [SampleId](#SampleId) Array, TileGroupVariantIdRange [TileVariantRange](#TileVariantRange) Array of Arrays

`Output` Result [SampleTileVariant](#SampleTileVariant) Map

The `SampleId` array holds the samples to query against.  The entire sample set is used if no `SampleId` parameter is passed in or if the empty array is specified.

The `TileVariantRange` array of arrays represents a conjunctive normal form query to match against the
sample set.
Each `TileVariantRange` element is grouped into an array, or clause,
and clauses are grouped together in the larger array to create the formula.
A match against the sample set is performed finding all tiles that simultaneously
match any of the tile variants in each clause.  That is, for a sample match to occur, the
sample's tile variants must match at least one element in each of the clauses.

If the first character in the `TileVariantRange` element is a tilde (`~`), then that element will match everything
but the tile variant specified.  For example, `"~247.00.00a.0003"` would match everything but tile variant
`0003`.

The range portion of the `TileVariantRange` element specifies which neighborhood of tiles to return should a match occur.

The output is the samples tile variants returned as a map.  The map key is the sample ID.
Each map entry is an array of arrays holding the resulting tile IDs for each allele present.
For tile IDs spanning multiple seed tiles, a `+` suffix is attached followed by the
length of the tile in hex.


#### Example

*request*
```javascript
{
  "Type":"sample-tile-neighborhood",
  "SampleId": [],
  "TileGroupVariantIdRange": [
    [ { "247.00.0000.0000+3" : [0,5] } ],
    [ { "247.00.0009-f.0003+3" : [-3,2] } ]
  ]
}
```

*response*
```javascript
{
  "Type":"success",
  "Message":"sample-tile-neighborhood",
  "Result": {
    "sample0": [
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0003.0000","247.00.0004.0000","247.00.0008.0000","247.00.0009.0000","247.00.000a.0002","247.00.000b.0000","247.00.000c.0000","247.00.000d.0004","247.00.000e.0000"],
      ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0001","247.00.0003.0000","247.00.0004.0000","247.00.0008.0000","247.00.0009.0002+2","247.00.000b.0004","247.00.000c.0001","247.00.000d.0004","247.00.000e.0000"]
    ]
  }
}
```


system-info
----

`Input` 

`Output` SampleId [SampleId](#SampleId) Array, ...

No other input is specified.

The output lists system stats along with the samples the Lantern server is holding in memory.

#### Example:

*request*
```javascript
{ "Type":"system-info" }
```
*response*
```javascript
{ "Type":"success",
  "Message":"system-info",
  "LanternVersion":"0.0.3",
  "LibraryVersion":"",
  "TileMapVersion":"23797fa880c85e484cfcfcce421347f5",
  "CGFVersion":"0.4",
  "Stats":{"Total":8,"CacheHit":8,"CacheMiss":0,"DBHit":0,"DBMiss":0},
  "SampleId":["sample0", "sample1"]
}
```


tile-sequence
----

`Input` TileId [TileVariant](#TileVariant) Array

`Output` Result [TileIdSequenceMap](#TileIdSequenceMap)


The `SampleId` array holds the samples to query against.  The entire sample set is used if no `SampleId` parameter is passed in or if the empty array is specified.

The `TileIdSequenceMap` holds a map where the key is the `TileId` and the entry is the genomic sequence for that tile.

#### Example:

*request*
```javascript
{
  "Type":"tile-sequence",
  "TileId":[ "247.00.000f.0000","247.00.000f.0001" ]
}
```

*response*
```javascript
{
  "Type":"success",
  "Message":"tile-sequence",
  "Result":{
    "247.00.000f.0000":"CACTTTAGGGCACTGGAGTCCCCTctggtccagggcaggtccagaaaagctgttccagagtcaagtcctggaatcagggaccccaagaaccctcttgatgctctaccccaccatggcagtgttggtacctaaggtgcaagacaacgtctccttcgtctcaagcagaaggagttttgccccataaccaccacagctggtaatatgctgagtctcacctgaaaccagCAAGGCTTAGAGGCTCATCAAGAC",
    "247.00.000f.0001":"CACTTTAGGGCACTGGAGTCCCCTctggtccagggcaggtccagaaaagctgttccagagtcaagtcctggaatcagggaccccaagaaccctcttgatgctctacaccaccatggcagtgttggtacctaaggtgcaagacaacgtctccttcgtctcaagcagaaggagttttgccccataaccaccacagctggtaatatgctgagtctcacctgaaaccagCAAGGCTTAGAGGCTCATCAAGAC"
  }
}
```

Returned Objects
================

SampleId
---

A sample identifier.  If the input calls for an array of sample identifiers (that is, `SampleId Array`), then most often either not specifying a sample identifier array or giving an empty array will result in matching the whole population of samples.


#### Example
```javascript
"sample0"
```

TileVariant
---

This is a tile identification, fully qualified with path, version, step and variant ID.  Optionally you can choose to decorate the tile identification with enumeration identifiers (described below) for the path, step and variant.  The `TileVariant` strings are formatted path, version, step and variant hexadecimal numbers separated by the 'period' token (`.`).

#### Example
```javascript
"247.00.000a.001e"
```

TilePosition
---

This is a tile position constructed from the path, version and step.  It is very similar to the `TileVariant` above but the variant ID is dropped.  Like the `TileVariant`, `TilePosition` can be decorated with enumeration identifiers (described below).  The `TilePosition` strings are formatted path, version and step hexadecimal numbers separated by the 'period' token (`.`).

#### Example
```javascript
"247.00.000a"
```

SampleTileVariantMap
---

An object whose keys are `SampleId`s and whose entries are `TileVariant` array of arrays.  Each array of `TileVariant` represents the appropriate allele.

#### Example
```javascript
{
  "sample0":[
    ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0000","247.00.000a.0002","247.00.000b.0000","247.00.000c.0000","247.00.000d.0004","247.00.000e.0000"],
    ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0001","247.00.0009.0002+2","247.00.000b.0004","247.00.000c.0001","247.00.000d.0004","247.00.000e.0000"]
  ],
    "sample1":[
    ["247.00.0000.0001","247.00.0001.0000","247.00.0002.0000","247.00.0009.0033","247.00.000a.0001","247.00.000b.0000","247.00.000c.0000","247.00.000d.0000","247.00.000e.0001"],
    ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0001","247.00.0009.0033","247.00.000a.0000","247.00.000b.0001","247.00.000c.0001","247.00.000d.0000","247.00.000e.0000"]
  ],
    "sample2":[
    ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0001+2","247.00.000b.0016","247.00.000c.0000","247.00.000d.0000","247.00.000e.0000"],
    ["247.00.0000.0000","247.00.0001.0000","247.00.0002.0000","247.00.0009.0001+2","247.00.000b.0016","247.00.000c.0000","247.00.000d.0000","247.00.000e.0000"]
  ]
}
```

TileIdSequenceMap
-----------------

An object whose keys are `TileId`s and values are genomic sequences.


#### Example
```javascript
{
  "247.00.000f.0000":"CACTTTAGGGCACTGGAGTCCCCTctggtccagggcaggtccagaaaagctgttccagagtcaagtcctggaatcagggaccccaagaaccctcttgatgctctaccccaccatggcagtgttggtacctaaggtgcaagacaacgtctccttcgtctcaagcagaaggagttttgccccataaccaccacagctggtaatatgctgagtctcacctgaaaccagCAAGGCTTAGAGGCTCATCAAGAC",
  "247.00.000f.0001":"CACTTTAGGGCACTGGAGTCCCCTctggtccagggcaggtccagaaaagctgttccagagtcaagtcctggaatcagggaccccaagaaccctcttgatgctctacaccaccatggcagtgttggtacctaaggtgcaagacaacgtctccttcgtctcaagcagaaggagttttgccccataaccaccacagctggtaatatgctgagtctcacctgaaaccagCAAGGCTTAGAGGCTCATCAAGAC"
}
```

Enumeration Identifiers
=======================

As a short hand, instead of listing out each `TileVariant` or `TilePosition`, enumeration identifiers can be used.  Either tile type can be specified with comma as a delimeter and each numeric entry can be specified as an absolute or relative range.

Comma enumeration
-----------------

Each entry is separated by a a comma.

#### Example
```javascript
"247.00.000f.0001,247.00.000f.0002"
```

indicates variant `0001` and `0002` at position `247.00.000f`.

Abosulte Range
--------------

Numeric entries are separated by a `-`.  The entry to the left represents the start (inclusive) and the entry to the right represents the end (non-inclusive).

#### Example
```javascript
"247.00.000f.0001-0003"
```
indicates variant `0001` through `0002` (not including `0003`) at position `247.00.000f`.


Relative Range
--------------

Numeric entries are separated by a `+`.  The entry to the left represents the (absolute) start (inclusive) and the entry to the right is the number to enumerate, including the start value.

#### Example
```javascript
"247.00.000f.0001+2"
```
indicates variant `0001` through `0002` at position `247.00.000f`.

---

Each of the path, version, step or variants can be specified independently.  Commas can be included as well.  Relative and absolute ranges can be mixed within a `TileVariant` or `TilePosition` but not for the same entry in the tile identifier.

Here is a more complicated example:

```javascript
"247.00.000f.0001+2,248+2.00.000f+3.000f-11,24f+1.00.000a+1.0001+1"
```

is equivalent to the list:

```javascript
[
  "247.00.000f.0001", "247.00.000f.0001",
  
  "248.00.000f.000f", "248.00.000f.0010", "248.00.0010.000f", "248.00.0010.0010", "248.00.0011.000f", "248.00.0011.0010",
  "249.00.000f.000f", "249.00.000f.0010", "249.00.0010.000f", "249.00.0010.0010", "249.00.0011.000f", "249.00.0011.0010",

  "24f.00.000a.0001"
]
```

