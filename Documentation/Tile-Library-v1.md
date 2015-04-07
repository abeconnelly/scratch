Tile Library v1
====

This document describes a binary encoding of a tile library
for efficient storage and transport.

From a high level view, the tile library storage file has
the canonical tile sequence represented as a 2bit vector.
Tiles are represented as offsets into the canonical sequence
with tile variants represented in their own structure
as variants from the canonical tile sequence.

Much of the design is inspired by the genomic 2bit
file representation.

This library is meant to be the companion to the compact
genome format (CGF) that encodes individual genomes.

Binary tile library structure:
----

```
Magic         8byte
Version       8byte
NSequences    8byte

TileSequenceOffset  []8byte

TileSequence []{
  SequeunceLen  8byte
  Sequence      []byte

  TileRepresentation  8byte
  TileOffset    []RByte
  SpanLen       []byte

  SequenceAlt                 []{ 24byte }
  SequenceAltOverflowStride   8byte

  NSequenceAltOverflow           8byte
  SequenceAltOverflowOffset   []8byte
  SequenceAltOverflow         []{
    SpanLen dluygosz
    MAlt    dluygosz
    Alt     []{
      Len:SeqLen  dlugosz (odd bits given to Len)
      AltSequence []byte (as 2bit)
    }
  }

  NSpanLenOverflow  dlugosz
  SpanLenOverflow   []{
    Index             dlugosz
    Length            dlugosz
  }

}
```

SequenceLen is the number of 2bit bases in the Sequence.
TileRepresentation gives the TileOffset byte number (4 should be fine for now).
TileOffset give the start of each tile step in base pair co-ordinates (0 reference).
TileOffset need to be shifted accordingly to find the proper start of the genomic sequence tile.
SequenceAlt is chosen to be fixed width so that the most common queries can be answered quickly.
Any alt sequences not able to fit in the SequenceAlt element are put into the SequenceAltOverflow
array.

The SpanLen array holds the "Seed Tile Length" of the canonical tile.  If the SpanLen at a tile position exceeds 254,
the value 255 will be used to indicate that the span length should be determined by looking
up the index in the SpanOverflow table.

The SequenceAltOverflow.SpanLen holds the "Seed Tile Length" of the alternate tile.

The 24byte SequenceAlt representation is as follows

```
NAlt  1byte
Alt   []{
  MAlt        1byte
  Len:SeqLen  dlugosz (odd bits given to Len)
  AltSequence []byte  (as 2bit)
}
```

NAlt -1 (255) for overflow into SequenceAltOverflow.

SequenceAltOverflowStride should be chosen to keep SequenceAltOverflowOffsets manageable.  A reasonable
value is 1000 but 100 might be warranted if lookup efficiency is desired.


Comments
---

Alt sequences whose spanning length differ from the canonical sequence should be placed in the
OverflowSequenceAlt structure.

Since these are variations reminiscent of VCF, they have the same problems with ambiguity and
non-unique sequence coding.  Since different alt encodings code for the same sequence and they're
localized to tiles, this ambiguity shouldn't make a large difference as they're just used as
a representation and not meant to be used for analysis.  Even so, it is encouraged to normalize
representation and store the normalized alt variations.

Also note that 'nocall' information is present.  All low quality information is stored at the
CGF level outside of the tile library.


References
---


  - [2bit encoding in closure](http://eigenhombre.com/2013/07/06/a-two-bit-decoder/)
  - [Dlugosz Variable Length Integer](http://www.dlugosz.com/ZIP2/VLI.html)

A hexit is a 4bit binary digit (a nibble).

Variable length schemes will be used.  Dlugosz variable length
integer encoding seems like a fine candidate.  The basic idea
is to have a linear number of prefix bits encode the number of
bytes until a cutoff at which time it switches over to the prefix
bits describing the length of the VLE integer.

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

The document is unclear about what happens in the 0xff case for the prefix byte.
This will be resolved here by considering the next 8 bytes to encode the length
of the subsequent bytes.  So

    0xff | 0xgh 0xij 0xkl 0xmn 0xop 0xqr 0xst 0xuv [ ... ]

where [g-v] hold the number of bytes in [...].  The value (2^64)-1 in the length
field is reserved for future use.


Another encoding of chaining hexits together will be used later.



