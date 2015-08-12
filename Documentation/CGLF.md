Compact Genome Library Format
===

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


```go
CompactTileLibrary {

  Magic         16byte
  Version       8byte
  NTileSequence 8byte
  AltStride     8byte
  TagStride     8byte

  TileSequenceOffset []8byte

  TileSequence[] {

    Path          8byte

    // NStep = (Tag2BitLenBP / TagStride) + 1
    TagSeqLenBP       8byte
    TagSeqTwoBit      []byte  // ~60Mb

    BodySeqLenBP      8byte
    BodySeqOffsetBp   []8byte // ~80Mb
    BodySeqTwoBit     []byte  // ~650Mb

    Span              []byte  // ~10Mb
    SpanOverflowLen   8byte
    SpanLenOverflow   []{
      Index             8byte
      Length            8byte
    }

    AltCache          [][AltStride]byte   // ~240Mb

    AltOverflowOffset []8byte             // ~80Mb
    AltOverflow []{                       // ?
      OverflowVariantNum dlug   // number of overflow variants
      []{
        VariantId dlug
        Span      dlug
        AltNum    dlug
        Alt []{
          StartBP     dlug
          CanonLenBP  dlug
          AltLenBP    dlug
          SeqTwoBit   []byte
        }
      }
    }

  }

}
```

Magic is `{"cglf":"bin"\0\0\0`

The `*Offset*` arrays give position information into their respective variable
length structures.


There are `AltStride` bytes reserved per Alt entry.  Each of the `AltStride` bytes
(for example, 24) is allocated as follows:

```go
AltEntry {
  AltNum          dlug    // number of alt entries
  []{
    Start           dlug    // start of alt (0-ref, 0=start of tag)
    CanonLen        dlug    // CanonLen=length of canon seq being replaced (0==ins). In BP.
    AltLen          dlug    // AltLen=alt seq (0==del). In BP.
    AltSeq          []byte  // 2bit representation of alt sequence, of len AltLen
  }
}
```

Notes
---

  * assumes variant in AtlCache appear in order.  This could mean a common variant appears that overflows while
    the others would not but this would still be wholly represented in the overflow table.
  * Start will be in the range of 250 which will probably overflow the dlug with prob. 1/2
  * CanonLen and AltLen are going to usually be small.  Devoting a whole dlug to it is excessive.
    Originally this was supposed to be compressed into a single dlug but discarded in lieu of simplicity.
  * AltSeq is wasteful as most alts will probably be a single base pair substitution.  Maybe it would
    be better to have a single AltSeq that consolodates all Alts in the cache record.

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


