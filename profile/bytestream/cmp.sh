#!/bin/bash

gcc -O3 c_printf.c -o c_printf
gcc -O3 c_buf.c -o c_buf
go build go_printf.go
go build go_bufio.go
go build go_bufio_writebyte.go
go build go_bufio_writebyte_b.go
