CGF Schema Draft
=====

Introduction
---

This document is a work in progress.

CGF is a binary format that encodes a representation of a genome relative to
a tile library.


Overview
---

From a high level perspective, CGF consists mainly of:

  - Vector arrays of tile variant ids for each tile position (the 'pointers' into library).
  - Overflow tile variant pointers that can't fit into the fixed width records above.
  - 'NOCALL' information that explicitly holds information of where the no-calls fall within tiles.
  - A 'NOCALL' bit vector interleaved with the Vector array above indicating whether a tile has at least one gap on it
  - The auxiliary structures to index into the overflow table, the gap table and anything else.

A big motivation is to use fixed width records as much as possible for efficient lookup and storage.
For elements that can't be contained within a fixed width record, overflow structures are provided
often with indexes into them.  These indexes are at a coarse level and point to the first record
every 'stride' records (for example, a 1000).


Binary CGF structure
---

We will talk about binary layout later but the basic structure is:

```go
Magic             8byte
CGFVersion        String
LibraryVersion    String
PathCount         8byte
TileMapLen        8byte
TileMap           []dlug
StepPerPath       []8byte
PathStructOffset  []8byte
PathStruct        []{

  Name string

  VectorLen 8byte
  Vector    []8byte

  Overflow {
    Length   8byte        // number of records in this structure
    Stride   8byte
    MapByteCount 8byte
    Offset   []8byte      // |Offset| = floor((Length + Stride-1)/Stride)
    Position []8byte      // tile position of k*stride overflow record in Map array
    Map      []dlug
  }

  FinalOverflowMap {
    DataRecordN
    DataRecordByteLen
    DataRecord {
      Code []byte
      Data []byte
    }
  }

  FinalOverflowMapOpt {
    Length    8byte       // should be negligible.  Number of final overflow records
    Stride    8byte
    Offset    []8byte     // offset in bytes of k*stride final overflow record element in map
                          //   If Length%Stride > 0, |Offset| = floor(Length/Stride) + 1
    TilePosition  []8byte // tile position of k*stride final overflow record in Data array.
    DataRecord {
      Code    []bytes     // fixed width single byte for code.
      Data    []bytes
    }
  }

  LowQualityInfo {
    Count       8byte    // Number of Low Quality records
    Code        8byte    // Code to future proof other low quality representations.
                         // Currently only this representation is allowed with the folowing
                         // structure.

    Stride        8byte    // e.g. 256
    Offset        []8byte  // Byte offset of k*stride element in LoqInfo
                           // |Offset| = floor( (Count + Stride - 1) / Stride )
    StepPosition  []8byte  // Tile step position of k*stride element in LoqInfo (for back lookup)
    HomFlag       []byte   // bit vector holding type of entry in list below, lsb first

    TileCount     8byte   // number of tiles
    LoqFlag       []byte  // Whole path flag indicator whether it's a low quality tile or not
                          // spanning tiles are not marked as low quailyt if the anchor tile
                          // is low quality.


    LoqInfoByteCount     //LoqInfo structure size in bytes

    LoqInfo[]{           // currently only 1 or two alleles supported.
                         // note: "het" and "hom" here only refer to the
                         // the low quality entry and not whether the tilemap
                         // entry is het or hom.  If both alleles have the same
                         // low quality information they're considered hom here,
                         // even if the actual tile entries aren't (i.e. they
                         // have different tile variant IDs).

      NTile   dlug       // number of tiles for this record
      LoqTile[]{         // One elment per tile
        Len     dlug     // Number of LoqEntries (can be 0)
        LoqEntry[]{      // Structure to hold position and length of nocalls
          DelPos  dlug   // 0-index start position of nocall run
          LoqLen  dlug   // length of no call run
        }
      }

    |

      NTileAlleleA  dlug  // A allele tile count
      NTileAlleleB  dlug  // B allele tile count

      LoqTile [2][]{      // Two arrays, one for each allele
        Len dlug          // Number of LoqEntries for this tile (can be 0)
        LoqEntry []{      // LoqEntry holding array of positions and nocall run lengths
          DelPos  dlug    // 0-index start position of nocall run
          LoqLen  dlug    // length of nocall run
        }
      }

    }
  }

}
```

Notes
---

* The first 32 bits of each entry in Vector hold a bit to indicate whether
  it's 'canonical' or whether the overflow table should be consulted.
* Each hexit has 4 values reserved:
  - 0xf - high quality overflow
  - 0xe - low quality overflow
  - 0xd - complex
  - 0x0 - spanning (stepped over)
  - 0x1-0xc - lookup in the tilemap
* If there are more than 32/4 = 8 overflow entries, the overflow map should be
  consulted.
* Overflow entries have two dlugs, one code and one value.  The codes can be:
  - Spanning tiles (stepped over)  (code 00)
  - Tile map entry.  The value is the entry in the tile map (code 01)
  - Final overflow entry.  The value has overflowed and the FinalOverflowMap should be consulted (code 02)
* FinalOverflowMap holds everything else.  The DataRecord.Code is as follows:
  - 00 - Explicit Tile information.  This holds an encoded FinalOverflowTileMapEntry entry (see below)
  - 01 - Encoded FastJ tile.  See below for the structure of FinalOverflowEncodedFastJ

```go
  FinalOverflowTileMapEntry {
    TileStep dlug
    NAllele dlug
    []Allele {
      Len       dlug
      VariantId dlug
      Span      dlug
    }
  }
```

```go
  FinalOverflowEncodedFastJ {
    Len   dlug
    Data  []byte
  }
```


Additional Notes
---

* loq codes are stored in the vector to take advantage of byte locality.
* TileMap should hold enough entries to capture most of the common tiles.
* One hexit overflow will overlfow the entire 16 tile region.


Description
---

### Vector Data

The bulk of the information is stored in the PathStruct array.  PathStruct.Vector
should be around 5 MiB (10M tiles, 64 bits per 16 tiles).  OverflowMap is hopefully negligible
in size.  FinalOverflowMap should be negligible.
LowQuality(Het|Hom).Offset can be chosen
to be in the Kb region (assuming a stride of 1000 or so).  LowQuality(Het|Hom).Info,
assuming 2 bytes for relative pos and length for about 10M gaps, should be
about 20Mb.  The LowQuality(Het|Hom).Info is the one that is the least understood right
now.  I'm guessing that 20Mb is an overestimate but it might be in that range.


Though this might change in the future, a Vector element is chosen to be 64 bits with
the first 32 bits allocated for 'synopsis' bits and the last 32 bits to allocated
for the 'cache'.

The first 32 bits in a Vector element are 'synopsis'
bits, giving 16 two bit codes inidcating wether it's a canonical tile (0b00), a non-canonical tile (0b01),
a low quality tile (0b10) or a 'complex' tile (0b11).  If it's a non-canonical tile, a low quality tile or
a complex tile, the last 32 bits int the Vector element are to be consulted.  The latter bits hold 'hexits'
which are h-bit 'nibbles' holding information to reconstruct the tile variant ID or a code depending
on the two bit code in the synopsis bits.

The hexits should be interpreted as follows:

* For a non-canonical tile, the implied value from the hexit group is one less than the TileMap ID.
* For a low quality tile, the implied value from the hexit group is the TileMap ID.
* For a complex tile, the implied value from the hexit group should be interpreted as:
  - 0 - The tile is 'spanned'
  - 1 - reserved for future use

Hexits have the most significant bit (MSB) reserved for a hexit overflow condition.  A contiguous chain of
hexits with their MSB set represents a single number, taking 3 bits from each hexit.

Hexits are read in most significant byte order first, adding 3 bits of variant ID information per
hexit.  The final value has `1` added to give the final variant ID.

A cache overflow condition (as opposed to a hexit overflow condition) is indicated by all hexits in the
last 32 bits of a Vector element being set.  The OverflowMap and FinalOverflowMap (described below)
should be consulted under a cache overflow condition.


A diagram is illustrative:

    /--------- s ----------\/----------------------------- H ------------------------------\
    |    synopsis bits     |                       hexit region                            |
    ----------------------------------------------------------------------------------------
    |                      |                                                               |
    |                      | [ hexit_0 ] [ hexit_1 ] ... [ hexit_{k-1} ]  <    unused   >  |
    |                      |                                                               |
    ----------------------------------------------------------------------------------------
                             \___ h ___/ \___ h ___/     \_____ h _____/  \__ H - k*h __/
    \______________________________________ b _____________________________________________/

Here, `b=64`, `s=32`, `h=4` and `H=32`.

### Low Quality Information

From some preliminary statistics, it looks like 85% of gaps are hom, so
separating out the different nocall types might prove useful. LowQualityHom.Info
holds position and length as variable length integers.
It might be the case that gap lengths are less than 16
which means there are even more savings to be had by considering paths
as hexits instead of full bytes.

Both of the low quality portions group 'stride' number of tiles (for example, a 1000 say) and bin
them.  The `LowQuality(Hom|Het).Offset` provide indexes into the starts of each bin.  The
`LowQuality(Hom|Het).NTile` provide the number of low quality tiles in each bin.

The `LowQuality(Hom|Het).Vector` must be used to determine the relative record offset in each
bin.

The `LowQualityHom.Info` holds records that apply to all alleles of a tile.  Each group of
nocalls for a tile has a `NRecord` field indicating how many nocalls are in this tile.
Following the `NRecord` field, an array of variable length sequence position and length elements
indicates where the nocall region starts relative to the beginning of the tile and how long it is.

All sequence positions should be taken from the beginning of the tile group start, tags included.

### Het Low Quality

The het low quality information is similar to the hom low quality information but with an
allele field added to indicate which allele the nocall region falls on.

`LowQualityHet.Length` holds the number of bytes held in the `LowQualityHet.Info` array.
The `LowQualityHet.Offset` holds the byte offset position in `LowQualityHet.Info` for the
first low quality tile at the index position divided by `LowQualityHet.Stride` rounded down.

The `LowQualityHet.Info` holds records that apply to all alleles of a tile.  Each tile record
has an array of `Allele` records.  Each `Allele` record is identical to the `LowQualityHom.Info`
record.

All sequence positions should be taken from the beginning of the tile group start.  If there
is an allele that has multiple tiles because of a spanning tile on another allele, the
sequence position should be taken from the beginning of the tile group and should be thought
of as referencing the position in the implied sequence of that allele.

### Overflow Maps

The OverflowMap is only used to point to tiles that are present in the TileMap.
The first 8byte portion holds the position in the Vector, the second holds the
position in the TileMap.  Keys in the OverflowMap are sorted in ascending
order.

FinalOverflowMap can hold arbitrary (string) data to include any information not
able to be captured by the other portions of the data structure.


References
---


  - [2bit encoding in closure](http://eigenhombre.com/2013/07/06/a-two-bit-decoder/)
  - [Dlugosz Variable Length Integer](http://www.dlugosz.com/ZIP2/VLI.html)

Variable length schemes will be used.  Dlugosz variable length
integer encoding seems like a fine candidate.  The basic idea
is to have a linear number of prefix bits encode the number of
bytes until a cutoff at which time it switches over to the prefix
bits describing the length of the VLE integer.  The VLE integer encoding
is slightly modified from the one presented in the Dlugosz VLI post.

The following table gives a sense for how to encode:

| prefix | bytes | header bits | data bits | unsigned range |
|---|---|---|---|---|
| 0 | 1 | 1 | 7 | 127 |
| 10 | 2 | 2 | 14 | 16,383 |
| 110 | 3 | 3 | 21 | 2,097,151 |
| 111 00 | 4 | 5 | 27 | 134,217,727 |
| 111 01 | 5 | 5 | 35 | 34,359,738,367 |
| 111 10 | 6 | 5 | 43 | 8,796,093,022,207 |
| 111 11 000 | 8 | 8 | 56 | 72,057,594,037,927,935 |
| 111 11 001 |  9 | 8 | 64 | A full 64-bit value with one byte overhead |
| 111 11 010 | 17 | 8 | 128 | A GUID/UUID |
| 111 11 111 |  n | 8 | any | Any multi-precision integer |

This is a nice compromise between arbitrary length and efficient encoding
for small numbers.

The document is unclear about what happens in the 0xff case for the prefix byte.
This will be resolved here by considering the next 8 bytes to encode the length
of the subsequent bytes.  So

    0xff | 0xgh 0xij 0xkl 0xmn 0xop 0xqr 0xst 0xuv [ ... ]

where [g-v] hold the number of bytes in [...].  The value (2^64)-1 in the length
field is reserved for future use.
