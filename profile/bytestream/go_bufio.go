package main

import "fmt"
import "os"
import "bufio"

func main() {
  n := (1<<28)
  ch := 'a'

  b := bufio.NewWriter(os.Stdout)

  for i:=0; i<n; i++ {
    fmt.Fprintf(b, "%c", ch)
    if (i%50)==0 { fmt.Fprintf(b, "\n") }
  }

  fmt.Fprintf(b, "\n")
}
