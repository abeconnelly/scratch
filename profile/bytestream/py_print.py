#!/usr/bin/env python

import sys

n = (1<<28)

for i in range(n):
  sys.stdout.write('a')
  if (i%50)==0:
    sys.stdout.write('\n')

sys.stdout.write('\n')
