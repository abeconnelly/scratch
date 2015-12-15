#!/bin/bash

gcc -O3 mktest.c -o mktest
gcc -O3 sbuf.c dpa_ukk.c -o dpa_ukk
gcc -O3 dp.c -o dp
gcc sbuf.c check_seq.c -o check_seq
