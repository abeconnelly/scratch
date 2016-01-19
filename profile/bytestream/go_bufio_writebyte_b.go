package main

//import "fmt"
import "os"
import "bufio"

func main() {
  m := 1024
  n := (1<<28)
  ch := byte('a')

  pos := 0
  buf := make([]byte, m)

  b := bufio.NewWriter(os.Stdout)

  for i:=0; i<n; i++ {
    buf[pos] = ch
    pos++
    if pos==m { b.Write(buf); pos=0 }

    if (i%50)==0 {
      buf[pos] = '\n'
      pos++
      if pos==m { b.Write(buf); pos=0 }
    }
  }

  b.WriteByte('\n')
}
