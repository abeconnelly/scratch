CGF v3 Schema Draft
=====

Introduction
---

This document is a work in progress.

CGF v3 is a binary format that encodes a representation of a genome relative to
a tile library.


Overview
---

From a high level perspective, CGF consists mainly of:

  - Vector arrays of tile variant ids for each tile position (the 'pointers' into library).
  - Overflow tile variant pointers that can't fit into the fixed width records above.
  - 'NOCALL' information that explicitly holds information of where the no-calls fall within tiles.
  - A 'NOCALL' bit vector indicating whether a tile has at least one gap on it
  - the auxiliary structures to index into the overflow table, the gap table and anything else.

A big motivation is to use fixed width records as much as possible for efficient lookup and storage.
For elements that can't be contained within a fixed widthe record, overflow structures are provided
often with indexes into them.  These indexes are at a coarse level and point to the first record
every 'stride' records (for example, a 1000).

Preliminaries
---

A hexit is a 4bit binary digit (a nibble).

Variable length schemes will be used.  Dlugosz variable length
integer encoding seems like a fine cadidate.  The basic idea
is to have a linear number of prefix bits encode the number of
bytes until a cutoff at which time it switches over to the prefix
bits describing the length of the VLE integer.  See http://www.dlugosz.com/ZIP2/VLI.html.

From the website, the following table gives a sense for how to encode:

    prefix      bits  bytes data bits unsigned range
    0           1     7     127
    10          2     14    16,383
    110         3     21    2,097,151
    111 00      4     27    134,217,727 (128K)
    111 01      5     35    34,359,738,368 (32G)
    111 10      8     59    holds the significant part of a Win32 FILETIME
    111 11 000  6     40    1,099,511,627,776 (1T)
    111 11 001  9     64    A full 64-bit value with one byte overhead
    111 11 010  17    128   A GUID/UUID
    111 11 111  n     any   Any multi-precision integer

This is a nice compromise between arbitrary length and efficient encoding
for small numbers.

The document is unclear about what happends in the 0xff case for the prefix byte.
This will be resolved here by considering the next 8 bytes to encode the length
of the subsequence bytes.  So

  0xff | 0xgh 0xij 0xkl 0xmn 0xop 0xqr 0xst 0xuv [ ... ]

where [g-v] hold the number of bytes in [...].  The value (2^64)-1 in the length
field is reserved for future use.


Another encoding of chaining hexits together will be used later.


Binary CGF structure
---

We will talk about binary layout later but the basic structure is:

```
Magic             4byte
CGFVersion        String
LibraryVersion    String
PathCount         2byte
StepPerPath[]     []2byte
TileMap           []dlugosz
TileVectorOffset  []8byte
PathStruct        []{

  Name string

  VectorLen 8byte
  Vector    []4byte

  LowQualityTileVector  []byte

  LowQualityHomLength   8byte
  LowQualityHomStride   8byte
  LowQualityHomOffets   []8byte
  LowQualityHomInfo     []{
    NRecord             dlugosz
    Record              []{
      Position          dlugosz
      Length            dlugosz
    }
  }

  LowQualityHetLength   8byte
  LowQualityHetStride   8byte
  LowQualityHetOffets   []8byte
  LowQualityHetInfo     []{
    NRecord             dlugosz
    Record              []{
      Allele            dlugosz
      Position          dlugosz
      Length            dlugosz
    }
  }

  NOverflowMap  8byte
  OverflowMap   []{ 8byte, 8byte }

  NFinalOverflowMap 8byte
  FinalOverflowMap  []{ 2byte, String }

}
```

Description
---

### Vector Data

The bulk of the information is stored in the PathStruct array.  PathStruct.Vector
should be around 2.5 Mb.  OverflowMap and FinalOverflowMap should be negligible.
LowQualityTileVector should be about 1.2Mb.  LowQualityOffets can be chosen
to be in the Kb region (assuming a stride of 1000 or so).  LowQualityInfo,
assuming 2 bytes for relative pos and length for about 10M gaps, should be
about 20Mb.  The LowQualityInfo is the one that is the least understood right
now.  I'm guessing that 20Mb is and overestimate but it might be in that range.

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


For concreteness, `s=16`, `h=4`, `H=16` with four 'hexits'.  This would give 16 tile positions
per 4 bytes (32bits) with the ability to represent 4 non-canonical tiles per 16 tiles.  A special
hexit value is reserved to indicate an overflow.

For conreteness, if we take `s=16`, `h=4` and `H=16`, this means that each 32 bits tries to represent
16 tiles.  The first 16 bits indicate which of the group of 16 under consideration are canonical (0 for
canonical, 1 for non-canonical).  If the tile is non-canonical the latter 16 bits are consulted.

Hexits are variable length with the most significant bit (MSB) indicating whether another hexit
should be used to reconstruct the number.  When all of hexits have their MSB set, the OverflowMap
should be consulted.  In the example above, when the four hexits in the latter 16 bits have their
MSB set, the OverflowMap should be consulted.

Hexits are read in most significant byte order first, adding 3 bits of variant ID information per
hexit.  The final value has `1` added to give the final variant ID.

Here are some examples. `[`, `]` and `.` are used just for formatting for the binary digits in the below examples:

All 16 tiles canonical (all four hexits are ignored):
    [ 0000 . 0000 . 0000 . 0000 ] [ 0000 . 0000 . 0000 . 0000 ]

One tile of the 16 (the 5th) is non-canonical and has tile variant 1 (the last three hexits are ignored):
    [ 0000 . 1000 . 0000 . 0000 ] [ 0000 . 0000 . 0000 . 0000 ]

One tile of the 16 (the 5th) is non-canonical and has tile variant 3 (the last three hexits are ignored):
    [ 0000 . 1000 . 0000 . 0000 ] [ 0010 . 0000 . 0000 . 0000 ]

One tile of the 16 (the 10th) is non-canonical and has tile variant 10 (the last two hexits are ignored):
    [ 0000 . 0000 . 0100 . 0000 ] [ 1001 . 0001 . 0000 . 0000 ]

Two tiles of the 16 (the 10th and 12th) are non-canonical and have tile variant 1 and 3 respectively (the last two hexits are ignored):
    [ 0000 . 0000 . 0101 . 0000 ] [ 0000 . 0010 . 0000 . 0000 ]

One tiles of the 16 (the 11th) is non-canonical and needs to have it's variant ID be looked up in the OverflowMap or FinalOverflowMap:
    [ 0000 . 0000 . 0010 . 0000 ] [ 1000 . 1000 . 1000 . 1000 ]

Five of the tiles of the 16 (the 3rd, 5th, 11th, 13th and 15th) are all non-canonical.  Since these can't be represented
in four hexits, the overflow condition is set and the OverflowMap or the FinalOverflowMap should be consulted to find the
variant IDs:
    [ 0010 . 1000 . 0010 . 1010 ] [ 1000 . 1000 . 1000 . 1000 ]


Vector has the first 16 bits to store whether it's a canonical tile or not.
If it's a non-conanical tile, that is, the bit is set for that position, there
will be a hexit in the latter 16 bits.  Each hexit has the first bit to indicate
whether it's part of a longer chain.  A special code is used to indicate the
tile variant has overflowed and the OverlfowMap should be consulted.

From a high level perspective, mapping to a tile variant can be thought of as a sort of 'cascade',
where first the synopsis bits are consulted, then the hexit region is consulted and finally
the spillover tables if need be.  The logic is roughly as follows:

```
if ( synopsis bit is 0 ) -> use default tile variant
else { // consult hexit region
  if ( hexit encoding maps to a tile variant ) --> use that tile variant
  else { // consult OverflowMap
    if ( path and step are in the OverflowMap table ) --> use the tile variant reported by the OverflowMap
    else { // consult FinalOverflowMap
      if ( path and step are in the FinalOverflowMap ) --> use the tile variant reported by the FinalOverflowMap
      else ERROR
    }
  }
}
```

From some preliminary statistics, it looks like 85% of gaps are hom, so
seperating out the different nocall types might prove useful. LowQualityHomInfo
holds path:len as variable length integers.  LowQualityHetInfo holds two pairs of path:len
per tile position.  It might be the case that gap lengths are less than 16
which means there are even more savings to be had by considering paths
as hexits instead of full bytes.

### Hom Low Quality

`LowQualityHomLength` holds the number of bytes held in the `LowQualityHomInfo` array.
The `LowQualityHomOffets` holds the byte offset position in `LowQualityHomInfo` for the
first low quality tile at the index position divided by `LowQualityHomStride` rounded down.
The value in `LowQaulityHomOffsets` is 0 if there are no low quality tiles in the range
of `floor( index*stride )` to `floor( (index+1)*stride )`.  Index position 0 should consult
the next `LowQualityHomOffset` position to determine if the '0' entry indicates no low quality
tiles found in range.

The `LowQualityHomInfo` holds records that apply to all alleles of a tile.  Each group of
nocalls for a tile has a `NRecord` field indicating how many nocalls are in this tile.
Following the `NRecord` field, an array of variable length sequence position and length elements
indicates where the nocall region lies on the tile and how long it is.

All sequence positions should be taken from the beginning of the tile group start.

### Het Low Quality

The het low quality information is similar to the hom low quality information but with an
allele field added to indicate which allele the nocall region falls on.

`LowQualityHetLength` holds the number of bytes held in the `LowQualityHomInfo` array.
The `LowQualityHetOffets` holds the byte offset position in `LowQualityHomInfo` for the
first low quality tile at the index position divided by `LowQualityHetStride` rounded down.
The value in `LowQaulityHetOffsets` is 0 if there are no low quality tiles in the range
of `floor( index*stride )` to `floor( (index+1)*stride )`.  Index position 0 should consult
the next `LowQualityHetOffset` position to determine if the '0' entry indicates no low quality
tiles found in range.

The `LowQualityHetInfo` holds records that apply to all alleles of a tile.  Each group of
nocalls for a tile has a `NRecord` field indicating how many nocalls are in this tile.
Following the `NRecord` field, an array of variable length allele position, sequence position
and length elements indicates where the nocall region lies on the tile and how long it is.

All sequence positions should be taken from the beginning of the tile group start.  If there
is an allele that has multiple tiles because of a spanning tile on another allele, the
sequence position should be taken from the beginning of the tile group and should be though
of as referencing the position in the implied sequence of that allele.

### Overflow Maps

The OverflowMap is only used to point to tiles that are present in the TileMap.
The first 8byte portion holds the position in the Vector, the second holds the
position in the TileMap.  Keys in the OverflowMap are sorted in ascending
order.

FinalOverflowMap holds arbitrary (string) data to include any information not
able to be captured by the other portions of the data structure.


