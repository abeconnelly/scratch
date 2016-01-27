package main

import "os"
import "fmt"
import "bufio"
import "strconv"

func main() {
  var e error

  n := 1000000
  if len(os.Args)>1 {
    n,e = strconv.Atoi(os.Args[1])
    if e!=nil || n<0 {
      n = 1000000
    }
  }

  b := bufio.NewReader(os.Stdin)

  i:=0
  for i=0; i<n; i++ {
    ch,e := b.ReadByte()
    if e!=nil { break }
    _ = ch
  }

  fmt.Printf("go_bufio_readbyte (read %d bytes)\n", i)

}
