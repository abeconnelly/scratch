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
