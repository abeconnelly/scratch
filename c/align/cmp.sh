#!/bin/bash

gcc -g -c asm_ukk.c
g++ -g asm_ukk_main.cpp asm_ukk.o -o asmukk

ar rcs asm_ukk.a asm_ukk.o
exit

gcc -O3 mktest.c -o mktest
gcc -O3 sbuf.c dpa_ukk.c -o dpa_ukk
gcc -O3 dp.c -o dp

gcc -O3 sbuf.c dpa_ukk_m.c -o dpa_ukk_m
#gcc -g sbuf.c dpa_ukk_m.c -o dpa_ukk_m

gcc sbuf.c check_seq.c -o check_seq

gcc -c asm_ukk.c
