#!/bin/bash
#

truth="../dp"
candidate="../dpa_ukk"

for fn in `find . -name "*.seq"`
do
  echo $fn
  t=`cat $fn | $truth | tail -n3 | head -n1 | cut -f1 -d' '`
  c=`cat $fn | $candidate | tail -n1 | cut -f2 -d' '`

  if [ "$t" != "$c" ]
  then
    echo ERROR MISMATCH $fn "($t != $c)"
    exit 1

  fi

  echo $t $c
done
