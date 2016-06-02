#!/bin/bash

cgf="./bin/cgf"

cglf="/data-sde/data/sglf"

fjdir=$1

if [[ "$fjdir" == "" ]] ; then
  echo "provide fjdir"
  exit 1
fi

id=`basename "$fjdir"`

odir="data"
cgf_fn="$id.cgf"

mkdir -p $odir
rm -f $odir/$cgf_fn

mkdir -p log

echo ">>>> processing $fjdir, creating $odir/$cgf_fn"

ifn="$odir/$cgf_fn"
ofn="$odir/$cgf_fn"

$cgf -action header -i nop -o $odir/$cgf_fn
echo header created

for fjgz in `ls $fjdir/*.fj.gz` ; do
  tilepath=`basename $fjgz .fj.gz`
  echo $tilepath

  $cgf -action append -i <( zcat $fjdir/$tilepath.fj.gz ) -path $tilepath -S <( zcat $cglf/$tilepath.sglf.gz ) -cgf $ifn -o $ofn
  echo path $tilepath appended
done

exit

tilepath="0247"
#$cgf -action append -i <( zcat $fjdir/$tilepath.fj.gz ) -path $tilepath -S <( zcat $cglf/$tilepath.sglf.gz ) -cgf $ifn -o $ofn > log/z.$tilepath
$cgf -action append -i <( zcat $fjdir/$tilepath.fj.gz ) -path $tilepath -S <( zcat $cglf/$tilepath.sglf.gz ) -cgf $ifn -o $ofn
echo path $tilepath appended


tilepath="02c5"
$cgf -action append -i <( zcat $fjdir/$tilepath.fj.gz ) -path $tilepath -S <( zcat $cglf/$tilepath.sglf.gz ) -cgf $ifn -o $ofn > log/z.$tilepath
echo path $tilepath appended

#$cgf -action append -i <( zcat $fjdir/02c5.fj.gz ) -path 2c5 -S <( zcat $cglf/02c5.sglf.gz ) -cgf $ifn -o $ofn > z.2c5
#echo path 2c5 appended

