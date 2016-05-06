#!/bin/bash

n=1000
n_it=100
p="0.5"
#p="0.01"


for seed in {100..200} ; do
  score_dp=`./dp < <( ./mktest $n $seed $p ) | head -n1 | cut -f1 -d ' '`
  score_ukk=`./dpa_ukk < <( ./mktest $n $seed $p ) | head -n1 | cut -f1 -d' '`

  time ./dp < <( ./mktest $n $seed $p )
  time ./dpa_ukk < <( ./mktest $n $seed $p )

  echo $score_dp $score_ukk

  if [ "$score_dp" != "$score_ukk" ] ; then
    echo ERROR "scores do not match"
    exit 1
  fi

done

echo ok
