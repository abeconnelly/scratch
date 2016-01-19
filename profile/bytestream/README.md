Single character bytestream test
===

These benchmarks try to print out a single character ('a'), `1<<28` (or
about 2.5 million)
with a carriage return after every 50 printed ('\n') as fast as possible.

Quick start
---

```
./cmp.sh
./benchmark.sh
```

Results
---

```
gcc (Ubuntu 4.9.1-16ubuntu6) 4.9.1
Copyright (C) 2014 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.


Python 2.7.8

go version go1.5 linux/amd64

c_printf:

real    0m3.646s
user    0m3.612s
sys     0m0.028s
---

c_buf:

real    0m0.857s
user    0m0.835s
sys     0m0.016s
---

py_print:

real    1m55.372s
user    1m50.342s
sys     0m4.530s
---

go_printf:

real    3m52.113s
user    2m41.346s
sys     1m22.476s
---

go_bufio:

real    1m11.876s
user    1m21.152s
sys     0m2.933s
---

go_bufio_writebyte:

real    0m2.662s
user    0m2.659s
sys     0m0.012s
---

go_bufio_writebyte_b:

real    0m1.163s
user    0m1.136s
sys     0m0.032s
```
