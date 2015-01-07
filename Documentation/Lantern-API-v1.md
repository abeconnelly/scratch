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

`Input` [SampleId](#SampleId), [TileVariant](#TileVariant)

`Output` [SampleTileVariant](#SampleTileVariant)

Example:

*request*
```javascript
{
  "Type" : "tile-sequence",
  "TileId" : [ "247.00.000f.0000","247.00.000f.0001" ]
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

`Input` [SampleId](#SampleId), [TileVariant](#TileVariant)

`Output` [SampleTileVariant](#SampleTileVariant)

#### Example

*request*
```javascript
{ "Type":"sample-position-variant", "SampleId": [], "Position":["247.00.0000+3","247.00.0009-f"] }
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

`Input` [SampleId](#SampleId), [TileVariant](#TileVariant)

`Output` [SampleTileVariant](#SampleTileVariant)


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

`Output` [SystemInfo](#SystemInfo)

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

`Input` [SampleId](#SampleId), [TileVariant](#TileVariant)

`Output` [SampleTileVariant](#SampleTileVariant)

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
