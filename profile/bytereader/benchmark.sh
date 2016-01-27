#!/bin/bash

n=100000000

time ./spigot $n | ./go_bufio_readbyte $n
echo

time ./spigot $n | ./c_readbyte $n
echo

time ./spigot $n | ./c_readbyte_buf $n
echo
