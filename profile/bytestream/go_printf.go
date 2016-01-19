package main

import "fmt"

func main() {
  n:=(1<<28)
  ch := 'a'

  for i:=0; i<n; i++ {
    fmt.Printf("%c", ch)
    if (i%50)==0 { fmt.Printf("\n") }
  }

  fmt.Printf("\n")
}


