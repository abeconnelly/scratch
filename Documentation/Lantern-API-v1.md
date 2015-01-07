Lantern API
===========

| Function | Input | Output | Description |
| --- | --- | --- | --- |
| [sample-tile-group-match](#sample-tile-group-match) | SampleId, TileVariant | SampleId | Returns a list of sample IDs that match the specified tile variants |
| [sample-position-variant](#sample-position-variant) | SampleId, TilePosition | SampleTileVariant | Returns the tile variants of the samples at the input tile positions |
| [sample-tile-neighborhood](#sample-tile-neighborhood) | SampleId, TileIdRange | SampleTileVariant | Returns tile IDs within the range of the matched criterea |
| [system-info](#system-info) | | Info | Returns information about the running Lantern server |
| [tile-sequence](#tile-sequence) | TileVariant | TileSequence | Returns the tile sequence |

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

Example:

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

`Input` SampleId [SampleId](#SampleId) Array, TileId [TileVariant](#TileVariant) Array

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
--------

Array of sample identifiers.  Most often, giving an array with no elements will default to the entire sample set (that is, specifying a `SampleId` of `[]`).  Specifying the samples directly will restrict the query to just those samples.

#### Example
```javascript
[ "sample0", "sample1" ]
```

TileVariant
-----------

This is a tile identification, fully qualified with path, version, step and variant ID.  Optionally you can choose to decorate the tile identification with enumeration identifiers (described below) for the path, step and variant.  The string is formatted to be a string representation of hex numbers, where each of the path, version, step and variant ID are separated by the 'period' token (`.`).

#### Example
```javascript
"247.00.000a.001e"
```

