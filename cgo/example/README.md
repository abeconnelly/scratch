Simple C Go Example
===

For concreteness, here is a simple example of how to use C functions
in Go.

There are three files used, `h.c`, `h.h` and `ex.go`.

`h.c` has a funciton (`hello_friend`) that accepts a c-style string and prints out to stdout and a function (`emit_string`) that returns a c-style string that is the callers responsibility to free:
```c
#include "h.h"

void hello_friend(char *s) {
  printf("hello, %s\n", s);
}

char *emit_string() {
  char *q = "the quick brown fox jumps over the lazy yellow dog";
  char *s;
  s = strdup(q);
  return s;
}
```

`ex.go` calls both of these functions.  The C compilation directives are given in the comments above the `import "C"` line:
```go
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

  fmt.Printf("%s\n", Z);

  C.free(unsafe.Pointer(z))
}

```

To compile (also listed in `cmp.sh`):
```bash
go build -o ex_c
```
