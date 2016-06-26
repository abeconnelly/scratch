package main

import "fmt"

/*
#cgo CFLAGS: -I.
#cgo LDFLAGS: -lm -L. ./asm_ukk.a
#include "asm_ukk.h"
*/
import "C"

import "unsafe"

func align2(x,y string, mismatch, gap int, gap_char byte) (X,Y string, score int) {
  x_cstr := C.CString(x)
  y_cstr := C.CString(y)

  res_X_cstr := C.CString("")
  res_Y_cstr := C.CString("")

  C.free(unsafe.Pointer(res_X_cstr))
  C.free(unsafe.Pointer(res_Y_cstr))

  //i_mm := C.int(mismatch)
  //i_ga := C.int(gap)
  //c_gc := C.char(gap_char)

  i_score := C.asm_ukk_align2(&res_X_cstr, &res_Y_cstr,
    x_cstr, y_cstr,
    //i_mm, i_ga, c_gc)
    C.int(mismatch), C.int(gap),
    C.char(gap_char))

  score = int(i_score)

  if (res_X_cstr!=nil) {
    X = C.GoString(res_X_cstr)
    C.free(unsafe.Pointer(res_X_cstr))
  }

  if (res_Y_cstr!=nil) {
    Y = C.GoString(res_Y_cstr)
    C.free(unsafe.Pointer(res_Y_cstr))
  }

  return
}

func align(x,y string) (X,Y string, score int) {
  return align2(x,y,3,2,'-')
}

func score2(x,y string, mismatch,gap int) (score int) {
  x_cstr := C.CString(x)
  y_cstr := C.CString(y)

  i_score := C.asm_ukk_score2(x_cstr, y_cstr, C.int(mismatch), C.int(gap))
  score = int(i_score)

  return
}

func score(x,y string) (score int) {
  return score2(x,y,3,2)
}

func main() {

  t0 := []string{"pretty", "putty"}

  x,y,s := align2(t0[0], t0[1], 3, 2, '-')

  fmt.Printf("%d\n%s\n%s\n", s, x, y)

  fmt.Printf(">>> %d\n", score2(t0[0], t0[1], 3,2))
}
