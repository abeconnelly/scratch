/*
   Test how slow encoding/binary is.
   This program proceeds as follows:
    * create 3 'input' buffers, one of uint16, uint32 and uint64
    * create 2 'output' buffers, one for holding the results of encoding/binary
      and the other for holding the results of doing bit shift manipulations
    * for each type, convert from the input buffer to the output buffers
      using encoding/binary for one and bit manipulations for the other
    * print out timing results (unix seconds) after comparing the resulting
      output buffers to make sure they match.

  As of this writing (2015-08-06), the following stats were generated:

  initializing byte arrays (16,32,64 bits) 500000000 entries each
  initializing done, starting conversions
  500000000 uint16 encoding/binary 4s
  500000000 uint16 bitmanip 3s
  500000000 uint32 encoding/binary 8s
  500000000 uint32 bitmanip 4s
  500000000 uint64 encoding/binary 37s
  500000000 uint64 bitmanip 8s

  I've seen 30s be the norm for uint64 encoding/binary whereas 8s seems to be typical
  for the bit maniuplation encoding.

*/

package main

import "fmt"
import "time"
import "encoding/binary"

func tobyte64_s(b []byte, u64 uint64) {
  b[0] = byte(u64&0xff)
  u64 = u64>>8
  b[1] = byte(u64&0xff)
  u64 = u64>>8
  b[2] = byte(u64&0xff)
  u64 = u64>>8
  b[3] = byte(u64&0xff)
  u64 = u64>>8
  b[4] = byte(u64&0xff)
  u64 = u64>>8
  b[5] = byte(u64&0xff)
  u64 = u64>>8
  b[6] = byte(u64&0xff)
  u64 = u64>>8
  b[7] = byte(u64&0xff)
}

func tobyte16(b []byte, u16 uint16) {
  b[0] = byte(u16&0xff)
  b[1] = byte((u16>>8)&0xff)
}

func tobyte32(b []byte, u32 uint32) {
  b[0] = byte(u32&0xff)
  b[1] = byte((u32>>8)&0xff)
  b[2] = byte((u32>>16)&0xff)
  b[3] = byte((u32>>24)&0xff)
}

func tobyte64(b []byte, u64 uint64) {
  b[0] = byte(u64&0xff)
  b[1] = byte((u64>>8)&0xff)
  b[2] = byte((u64>>16)&0xff)
  b[3] = byte((u64>>24)&0xff)
  b[4] = byte((u64>>32)&0xff)
  b[5] = byte((u64>>40)&0xff)
  b[6] = byte((u64>>48)&0xff)
  b[7] = byte((u64>>56)&0xff)
}

func main() {
  var p int
  N := 500000000

  rbuf16 := make([]uint16, N)
  rbuf32 := make([]uint32, N)
  rbuf64 := make([]uint64, N)

  ebuf := make([]byte, N*8)
  bbuf := make([]byte, N*8)

  fmt.Printf("initializing byte arrays (16,32,64 bits) %d entries each\n", N)

  for i:=0; i<N; i++ {
    rbuf16[i] = uint16(i)
    rbuf32[i] = uint32(i)
    rbuf64[i] = uint64(i)
  }

  for i:=0; i<8*N; i++ {
    ebuf[i] = byte(i&0xff)
    bbuf[i] = byte(i&0xff)
  }

  fmt.Printf("initializing done, starting conversions\n")

  st := time.Now()
  for i:=0; i<N; i++ {
    binary.LittleEndian.PutUint16(ebuf[2*i:2*i+2], rbuf16[i])
  }
  en := time.Now()
  del_enc_16 := en.Unix() - st.Unix()
  fmt.Printf("%d uint16 encoding/binary %ds\n", N, del_enc_16)

  st = time.Now()
  for i:=0; i<N; i++ {
    tobyte16(bbuf[2*i:2*i+2], rbuf16[i])
  }
  en = time.Now()
  del_bit_16 := en.Unix() - st.Unix()
  fmt.Printf("%d uint16 bitmanip %ds\n", N, del_bit_16)

  for p=0; p<2*N; p++ { if ebuf[p]!=bbuf[p] { break } }
  if p!=2*N { panic("nope") }


  st = time.Now()
  for i:=0; i<N; i++ {
    binary.LittleEndian.PutUint32(ebuf[4*i:4*i+4], rbuf32[i])
  }
  en = time.Now()
  del_enc_32 := en.Unix() - st.Unix()
  fmt.Printf("%d uint32 encoding/binary %ds\n", N, del_enc_32)

  st = time.Now()
  for i:=0; i<N; i++ {
    tobyte32(bbuf[4*i:4*(i+1)], rbuf32[i])
  }
  en = time.Now()
  del_bit_32 := en.Unix() - st.Unix()
  fmt.Printf("%d uint32 bitmanip %ds\n", N, del_bit_32)

  for p=0; p<4*N; p++ { if ebuf[p]!=bbuf[p] { break } }
  if p!=4*N { panic("nope") }


  st = time.Now()
  for i:=0; i<N; i++ {
    binary.LittleEndian.PutUint64(ebuf[8*i:8*i+8], rbuf64[i])
  }
  en = time.Now()
  del_enc_64 := en.Unix() - st.Unix()
  fmt.Printf("%d uint64 encoding/binary %ds\n", N, del_enc_64)

  st = time.Now()
  for i:=0; i<N; i++ {
    tobyte64(bbuf[8*i:8*(i+1)], rbuf64[i])
  }
  en = time.Now()
  del_bit_64 := en.Unix() - st.Unix()
  fmt.Printf("%d uint64 bitmanip %ds\n", N, del_bit_64)

  for p=0; p<8*N; p++ { if ebuf[p]!=bbuf[p] { break } }
  if p!=8*N { panic("nope") }

}
