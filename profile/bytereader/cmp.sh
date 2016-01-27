#!/bin/bash

gcc -O3 spigot.c -o spigot
gcc -O3 c_readbyte.c -o c_readbyte
gcc -O3 c_readbyte_buf.c -o c_readbyte_buf
go build go_bufio_readbyte.go
