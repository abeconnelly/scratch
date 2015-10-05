Go Gotchas
==========

These are some common errors I've found when programming in Go.

Unused packages cause compile errors
------------------------------------

For example:

```go
include "fmt"
```

will throw an error

    imported and not used: "fmt"

The standard fix I use is to put an underscore in front of it:


```go
include _ "fmt"
```

Note that the underscore still compiles the library.


Unused variables cause compile errors
-------------------------------------

Similar to the above.  For example:

```go
x := 1
```

if `x` is unused, then the following error will be reported:

    x declared and not used

The standard fix I use is to assign the variable to the blank identifier.
For example:


```go
x := 1 ; _ = x
```

Curly bracket must be on the same line as the conditional
---------------------------------------------------------


The following generates an error:


```go
if (true)
{
  fmt.Printf("true\n")
}
```

    missing condition in if statement

Put the curly on the same line:

```go
if (true) {
  fmt.Printf("true\n")
}
```

Multiline strings
-----------------

```go
  s := "a multiline
  string"
```

```
./gotcha.go:6: newline in string
./gotcha.go:7: syntax error: unexpected name, expecting semicolon or newline or }
./gotcha.go:7: newline in string
```

Use backticks ('`') instead

```go
  s := `a multiline
  string`
```



Initializing structs without having curly on the same line as the last element
------------------------------------------------------------------------------

The following code:

```go
package main

type og struct{
  A int
  B int
}

func main() {

  G := og{
    A : 1,
    B : 3
  }

  _ = G
}
```

Will generate this error:

    syntax error: need trailing comma before newline in composite literal

To fix, either put the curly on the same line as the last struct entry or
put a comma at the end:

```go
package main

type og struct{
  A int
  B int
}

func main() {

  G := og{
    A : 1,
    B : 3,
  }

  _ = G
}
```

Cannot access struct members with lower case first letter
---------------------------------------------------------

```go
type MyStruct struct {
  Afield int
  bfield int
}
```

```go
...
  z := MyStruct{ Afield:1, bfield:3 }
...
```

yields:

    unknown z.MyStruct field 'bfield' in struct literal

Make the first character of the structure element capitalized:


```go
type MyStruct struct {
  Afield int
  Bfield int
}
```



Cannot access structs in packages with lower case first letter
---------------------------------------------------------

```go
package mypackage

...

type myStruct struct {
  Afield int
  Bfield int
}

...
```

From another file:

```go
import "mypackage"

...

  z := mypackage.MyStruct{ Afield:1, bfield:3 }

...
```

yields:

    cannot refer to unexported name z.myStruct
    undefined: z.myStruct

Make the first character of the structure capitalized:

```go
type MyStruct struct {
  Afield int
  Bfield int
}
```

Cannot directly assign to mapped structure
---------------------------------

Doing the following:

```go
package main

type MyStruct struct { X int }

func main() {
  m := make( map[int]MyStruct )
  m[0] = MyStruct{2}
  m[0].X++
}
```
gives the error

```bash
./gotcha.go:8: cannot assign to m[0].X
```

Instead, you have to do something like this:

```go
package main

type MyStruct struct { X int }

func main() {
  m := make( map[int]MyStruct )
  m[0] = MyStruct{2}

  tStruct := m[0]
  tStruct.X++
  m[0] = tStruct

}
```

Maybe later versions of Go will allow for this.  See issue [#3117](https://github.com/golang/go/issues/3117).


Go does not parallize by default
--------------------------------

The following code will only use one core on your machine:

```go
package main

import "fmt"
import "sync"

var N_IT int = 1000000000
var wg sync.WaitGroup

func rng_it(n int) {
  m_w := n+1
  m_z := n+2

  rng := 0

  fmt.Printf(">>>> rng_it(%d): %d %d\n", n, m_w, m_z)

  for it:=0; it<N_IT; it++ {
    m_z = 36969 * (m_z & 65535) + (m_z >> 16);
    m_w = 18000 * (m_w & 65535) + (m_w >> 16);
    rng = (m_z << 16) + m_w;  /* 32-bit result */
  }

  fmt.Printf(">>>> rng_it(%d) done %d\n", n, rng)

  wg.Done()

}

func main() {
  for i:=0; i<2; i++ {
    wg.Add(1)
    go rng_it(i)
  }
  wg.Wait()
  fmt.Printf("DONE\n")
}
```

To give access to two full cores, call the `runtime.GOMAXPROCS`
function.

```go
package main

import "fmt"
import "runtime"
import "sync"

var N_IT int = 1000000000
var wg sync.WaitGroup

func rng_it(n int) {
  m_w := n+1
  m_z := n+2

  rng := 0

  fmt.Printf(">>>> rng_it(%d): %d %d\n", n, m_w, m_z)

  for it:=0; it<N_IT; it++ {
    m_z = 36969 * (m_z & 65535) + (m_z >> 16);
    m_w = 18000 * (m_w & 65535) + (m_w >> 16);
    rng = (m_z << 16) + m_w;  /* 32-bit result */
  }

  fmt.Printf(">>>> rng_it(%d) done %d\n", n, rng)

  wg.Done()

}

func main() {

  runtime.GOMAXPROCS(2)

  for i:=0; i<2; i++ {
    wg.Add(1)
    go rng_it(i)
  }

  wg.Wait()

  fmt.Printf("DONE\n")
}
```


GOBs are maximum 1Gb
--------------------

Writing Go GOBs will work for greater than 1Gb but reading them
back in will fail.

The variable `tooBig` in [gob/decoder.go](https://golang.org/src/encoding/gob/decoder.go#81) is
set to 1Gb.



"go get ..." multiple times doesn't update library
--------------------------------------------------

When issuing a "go get ...", behind the scenes, Go will clone the
repository asked for and put it in the $GOPATH/src directory.  Subsequent
"go get ..." calls will not update the repository.  Worse still, if
you own the repository and are working on it actively and want
other portions of your code to point to the current version you're
working on, it becomes dificult to co-ordinate.

As a make-shift solution, having a symbolic link to the repository
you're working on seems to be a good solution.

```bash
$ ln -s  path/to/my-go-repository $GOPATH/src
```

Issues With Go's Garbage Collection
-----------------------------------

  - [SE: go-1-3-garbage-collector-not-releasing-server-memory-back-to-system](http://stackoverflow.com/questions/24376817/go-1-3-garbage-collector-not-releasing-server-memory-back-to-system)
  - [Forum: Go 1.3 Garbage collector not releasing server memory back to system](https://groups.google.com/forum/#!topic/golang-nuts/0WSOKnHGBZE/discussion)

1.5 might be better about this

Packaging a binary with your library
------------------------------------

See http://stackoverflow.com/questions/14284375/can-i-have-a-library-and-binary-with-the-same-name

```
mylib/
  mylib.go    # package mylib
  mylib/
    main.go   # package main
```

Will produce a 'main' file in the $GOPATH/bin of name `mylib`.
