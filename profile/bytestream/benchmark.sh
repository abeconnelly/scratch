#!/bin/bash

gcc --version >&2
echo

python --version >&2
echo

go version >&2
echo

echo "c_printf:" >&2
time ./c_printf > /dev/null

echo -e '---\n'

echo "c_buf:" >&2
time ./c_buf > /dev/null

echo -e '---\n'

echo "py_print:" >&2
time ./py_print.py > /dev/null

echo -e '---\n'

echo "go_printf:" >&2
time ./go_printf > /dev/null

echo -e '---\n'

echo "go_bufio:" >&2
time ./go_bufio > /dev/null

echo -e '---\n'

echo "go_bufio_writebyte:" >&2
time ./go_bufio_writebyte > /dev/null

echo -e '---\n'

echo "go_bufio_writebyte_b:" >&2
time ./go_bufio_writebyte_b > /dev/null
