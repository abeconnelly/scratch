package main

//import "fmt"
import "os"
import "bufio"

func main() {
  n := (1<<28)
  ch := byte('a')

  b := bufio.NewWriter(os.Stdout)

  for i:=0; i<n; i++ {
    b.WriteByte(ch)
    if (i%50)==0 { b.WriteByte('\n') }
  }

  b.WriteByte('\n')
}
