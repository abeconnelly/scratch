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
For elements that can't be contained within a fixed width record, overflow structures are provided
often with indexes into them.  These indexes are at a coarse level and point to the first record
every 'stride' records (for example, a 1000).

Preliminaries
---

A hexit is a 4bit binary digit (a nibble).

Variable length schemes will be used.  Dlugosz variable length
integer encoding seems like a fine candidate.  The basic idea
is to have a linear number of prefix bits encode the number of
bytes until a cutoff at which time it switches over to the prefix
bits describing the length of the VLE integer.  See http://www.dlugosz.com/ZIP2/VLI.html.

From the website, the following table gives a sense for how to encode:

    prefix      bits  data bits  data bits unsigned range
    0           1     7          127
    10          2     14         16,383
    110         3     21         2,097,151
    111 00      4     27         134,217,727 (128K)
    111 01      5     35         34,359,738,368 (32G)
    111 10      8     59         holds the significant part of a Win32 FILETIME
    111 11 000  6     40         1,099,511,627,776 (1T)
    111 11 001  9     64         A full 64-bit value with one byte overhead
    111 11 010  17    128        A GUID/UUID
    111 11 111  n     any        Any multi-precision integer

This is a nice compromise between arbitrary length and efficient encoding
for small numbers.

The document is unclear about what happens in the 0xff case for the prefix byte.
This will be resolved here by considering the next 8 bytes to encode the length
of the subsequent bytes.  So

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

  NOverflowMap  8byte
  OverflowMap   []{ 8byte, 8byte }

  NFinalOverflowMap 8byte
  FinalOverflowMap  []{ 2byte, String }

  LowQualityHom {
    Vector  []byte
    Length  8byte
    Stride  8byte
    Offset  []8byte
    NTile   []8byte
    Info    []{
      NRecord     dlugosz
      Pos:Len     []dlugosz (odd bits given to Pos)
    }
  }

  LowQualityHet {
    Vector  []byte
    Length  8byte
    Stride  8byte
    Offset  []8byte
    NTile   []8byte
    Info    []{
      NAllele     dlugosz
      Allele      []{
        NRecord     dlugosz
        Pos:len     []dlugosz (odd bits given to Pos)
      }
    }
  }

}
```

Description
---

### Vector Data

The bulk of the information is stored in the PathStruct array.  PathStruct.Vector
should be around 2.5 Mb.  OverflowMap and FinalOverflowMap should be negligible.
LowQuality(Het|Hom).Vector should be about 1.2Mb each.  LowQuality(Het|Hom).Offset can be chosen
to be in the Kb region (assuming a stride of 1000 or so).  LowQuality(Het|Hom).Info,
assuming 2 bytes for relative pos and length for about 10M gaps, should be
about 20Mb.  The LowQuality(Het|Hom).Info is the one that is the least understood right
now.  I'm guessing that 20Mb is and overestimate but it might be in that range.


The basic unit stored in the PathStruct.Vector array is a b-bit word.  Initially we'll
probably choose `b` to be 32 bits long but this could change depending.

Tiles are grouped to be represented by a word.  The first bits in the word are 'synopsis'
bits, indicating whether the tile is canonical or not.  If it's not canonical, the latter
bits are to be consulted.  The latter bits hold 'hexits' which are h-bit 'nibbles' holding
information to reconstruct the tile variant ID.


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


For concreteness, if we take `s=16`, `h=4` and `H=16`, this means that each 32 bits tries to represent
16 tiles.  The first 16 bits indicate which of the group of 16 under consideration are canonical (0 for
canonical, 1 for non-canonical).  If the tile is non-canonical the latter 16 bits are consulted.

Hexits are variable length with the most significant bit (MSB) indicating whether another hexit
should be used to reconstruct the number.  When all of hexits have their MSB set, the OverflowMap
should be consulted.  In the example above, when the four hexits in the latter 16 bits have their
MSB set, the OverflowMap should be consulted.

Hexits are read in most significant byte order first, adding 3 bits of variant ID information per
hexit.  The final value has `1` added to give the final variant ID.

#### examples

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

Five of the tiles of the 16 (the 3rd, 5th, 11th, 13th and 15th) are all non-canonical.  Since these can't be represented in four hexits, the overflow condition is set and the OverflowMap or the FinalOverflowMap should be consulted to find the variant IDs:

    [ 0010 . 1000 . 0010 . 1010 ] [ 1000 . 1000 . 1000 . 1000 ]


---

If a tile or a tile group can't be represented in the hexit region, the OverflowMap
or the FinalOverflowMap should be consulted.

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

### Low Quality Information

From some preliminary statistics, it looks like 85% of gaps are hom, so
separating out the different nocall types might prove useful. LowQualityHom.Info
holds path:len as variable length integers.  LowQualityHet.Info holds two pairs of path:len
per tile position.  It might be the case that gap lengths are less than 16
which means there are even more savings to be had by considering paths
as hexits instead of full bytes.

Both of the low quality portions group 'stride' number of tiles (for example, a 1000 say) and bin
them.  The `LowQuality(Hom|Het).Offset` provide indexes into the starts of each bin.  The
`LowQuality(Hom|Het).NTile` provide the number of low quality tiles in each bin.

The `LowQuality(Hom|Het).Vector` must be used to determine the relative record offset in each
bin.

### Hom Low Quality

`LowQualityHom.Length` holds the number of bytes held in the `LowQualityHom.Info` array.
The `LowQualityHom.Offset` holds the byte offset position in `LowQualityHom.Info` for the
first low quality tile at the index position divided by `LowQualityHom.Stride` rounded down.

To lookup a tile's Homozygous low quality information, the following pseudo code is illustrative :

```
function LookupLowQualityHomRecord( TilePosition int )

  // Determine if there is a low quality tile at the TilePosition
  //
  bitpos_q = floor( TilePosition / 8 )
  bitpos_r = TilePosition % 8
  if ( LowQualityHom.Vector[ bitpos_q ] & (1<<bitpos_r) ) == 0
    return NOT_FOUND

  TileOffset_r    = TilePosition % LowQualityHom.Stride

  // Find the record offset
  //
  BeginIndex      = floor( TilePosition / LowQualityHom.Stride )
  RecordOffset    = 0
  for ind = 0 ; ind < TileOffset_r ; ind ++
    bitpos_q = floor( (BeginIndex + ind) / 8 )
    bitpos_r = (BeginIndex + ind) % 8
    if LowQualityHom.Vector[ bitpos_q ] & (1 << bitpos_r)
      RecordOffset ++

  BeginByteOffset = LowQualityHom.Offset[ BeginIndex ]

  // Find the starting byte location of the low quality record for
  // the tile.
  //
  CurRecordOffset = 0
  ByteOffset = BeginByteOffset
  while ( CurRecordOffset < RecordOffset ) and ( CurRecordOffset < LowQualityHom.NTile[ BeginIndex ] )
    ByteOffset += FindLowQualityHomRecordByteLength( &LowQualityHom.Info[ ByteOffset ] )
    CurRecordOffset++

  // Return byte address of low quality record for tile
  //
  return &LowQualityHom.Info[ ByteOffset ]
```


The `LowQualityHom.Info` holds records that apply to all alleles of a tile.  Each group of
nocalls for a tile has a `NRecord` field indicating how many nocalls are in this tile.
Following the `NRecord` field, an array of variable length sequence position and length elements
indicates where the nocall region starts relative to the beginning of the tile and how long it is.

The `NRecord` field holds the number of array elements in the `Pos:Len` array.  The
`Pos:Len` array holds a variable length integer where the first half of the effective bits are
used for position and the second half are used for the length.  Any remainder bits are given
to the position portion of the record.


All sequence positions should be taken from the beginning of the tile group start.

### Het Low Quality

The het low quality information is similar to the hom low quality information but with an
allele field added to indicate which allele the nocall region falls on.

```
function LookupLowQualityHetRecord( TilePosition int, Allele int )

  // Determine if there is a low quality heterozygous tile at the TilePosition
  //
  bitpos_q = floor( TilePosition / 8 )
  bitpos_r = TilePosition % 8
  if ( LowQualityHet.Vector[ bitpos_q ] & (1<<bitpos_r) ) == 0
    return NOT_FOUND

  TileOffset_r    = TilePosition % LowQualityHet.Stride

  // Find the record offset
  //
  BeginIndex      = floor( TilePosition / LowQualityHet.Stride )
  RecordOffset    = 0
  for ind = 0 ; ind < TileOffset_r ; ind ++
    bitpos_q = floor( (BeginIndex + ind) / 8 )
    bitpos_r = (BeginIndex + ind) % 8
    if LowQualityHet.Vector[ bitpos_q ] & (1 << bitpos_r)
      RecordOffset ++

  BeginByteOffset = LowQualityHet.Offset[ BeginIndex ]

  // Find the starting byte location of the low quality record for
  // the tile.
  //
  CurRecordOffset = 0
  ByteOffset = BeginByteOffset
  while ( CurRecordOffset < RecordOffset ) and ( CurRecordOffset < LowQualityHet.NTile[ BeginIndex ] )
    ByteOffset += FindLowQualityHetRecordByteLength( &LowQualityHet.Info[ ByteOffset ] )
    CurRecordOffset++

  // Skip to Allele record in question
  //
  for a = 0 ; a < Allele ; a ++
    ByteOffset += FindLowQualityRecordByteLength( &LowQualityHet.Info[ ByteOffset ] )

  // Return byte address of low quality record for tile
  //
  return &LowQualityHet.Info[ ByteOffset ]
```



`LowQualityHet.Length` holds the number of bytes held in the `LowQualityHet.Info` array.
The `LowQualityHet.Offset` holds the byte offset position in `LowQualityHet.Info` for the
first low quality tile at the index position divided by `LowQualityHet.Stride` rounded down.

The `LowQualityHet.Info` holds records that apply to all alleles of a tile.  Each tile record
has an array of `Allele` records.  Each `Allele` record is identical to the `LowQualityHom.Info`
record.

The `NRecord` field holds the number of array elements in the `Pos:Len` array.  The
`Pos:Len` array holds a variable length integer where the first half of the effective bits are
used for position and the second half are used for the length.  Any remainder bits are given
to the position portion of the record.

All sequence positions should be taken from the beginning of the tile group start.  If there
is an allele that has multiple tiles because of a spanning tile on another allele, the
sequence position should be taken from the beginning of the tile group and should be thought
of as referencing the position in the implied sequence of that allele.

### Overflow Maps

The OverflowMap is only used to point to tiles that are present in the TileMap.
The first 8byte portion holds the position in the Vector, the second holds the
position in the TileMap.  Keys in the OverflowMap are sorted in ascending
order.

FinalOverflowMap holds arbitrary (string) data to include any information not
able to be captured by the other portions of the data structure.
