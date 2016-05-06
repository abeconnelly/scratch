package main

/* A simple example of using C and GO together.

   The 'hello_friend' function takes in a (C-style) string and
   prints to stdout.

   The 'emit_string' function allocates a string in C (using malloc)
   and it's the callers responsibility to free it.
*/

import "fmt"

/*
#cgo CFLAGS: -I.
#cgo LDFLAGS: -lm -L.
#include "h.h"
*/
import "C"

import "unsafe"

func main() {
  cstr := C.CString("friend")
  C.hello_friend(cstr)

  z := C.emit_string()
  Z := C.GoString(z)

  fmt.Printf("%s\n", Z)

  C.free(unsafe.Pointer(z))
}
