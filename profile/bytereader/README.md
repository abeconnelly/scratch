Read benchmarks
===

Some simple programs to test how fast we can read a stream of bytes.

```bash
$ time ./spigot 100000000

real    0m0.234s
user    0m0.195s
sys     0m0.036s
```


```bash
$ ./benchmark.sh
go_bufio_readbyte (read 100000000 bytes)

real	0m1.239s
user	0m1.482s
sys	0m0.337s

c_readbyte (read 100000000 bytes)

real	0m1.735s
user	0m2.029s
sys	0m0.259s

c_readbyte_buf (read 100000000 bytes)

real	0m0.454s
user	0m0.366s
sys	0m0.477s
```
