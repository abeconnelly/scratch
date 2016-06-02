#!/usr/bin/python

import sys
import json
import hashlib

fn=sys.argv[1]

cur_j = {}
seq = ""

def noc_cmp(a, b):
  if len(a) != len(b) : return False
  for i in range(len(a)):
    if a[i].lower() == 'n' or b[i].lower() == 'n': continue
    if a[i].lower() != b[i].lower(): return False
  return True


def err(msg, j, s):
  print msg, j, s
  sys.exit(1)

def check(j, s):
  if not j["startTile"]:
    start_seq = s[0:24].lower()
    if not noc_cmp(start_seq, j["startTag"]):
      err("start tag mismatch", j, s)
    if start_seq != j["startSeq"]:
      err("start seq mismatch", j, s)

  if not j["endTile"]:
    n = len(s)
    end_seq = s[n-24:]
    if not noc_cmp(end_seq, j["endTag"]):
      err("end tag mismatch", j, s)
    if end_seq != j["endSeq"]:
      err("end seq mismatch", j, s)

  if j["n"] != len(seq):
    err("length mismatch (n and length of sequence)", j, s)

  noc_count=0
  for i in range(len(seq)):
    if seq[i]=='n' or seq[i]=='N': noc_count+=1
  if noc_count != j["nocallCount"]:
    err("nocall count mismatch", j, s)

  h = hashlib.md5()
  h.update(s)

  if h.hexdigest() != j["md5sum"]:
    err("md5sum mismatch: " + h.hexdigest(), j, s)

  tagmask_seq = ""
  if not j["startTile"]:
    for i in range(24):
      if seq[i] == 'n' or seq[i] == 'N':
        tagmask_seq += j["startTag"][i].upper()
      else:
        tagmask_seq += seq[i]
  z = 0
  if not j["endTile"]:
    z=24
  n = len(seq)
  tagmask_seq += seq[len(tagmask_seq):n-z]
  for i in range(z):
    if seq[n-z+i] == 'n' or seq[n-z+i] == 'N':
      tagmask_seq += j["endTag"][i].upper()
    else:
      tagmask_seq += seq[n-z+i]

  h = hashlib.md5()
  h.update(tagmask_seq)
  if h.hexdigest() != j["tagmask_md5sum"]:
    err("tagmask_md5sums do not match: " + h.hexdigest(), j, s)


first = True

with open(fn) as fp:
  for line in fp:
    if len(line)==0: continue
    if line[0]=='>':
      jj = json.loads(line[1:])


      if not first:
        check(cur_j, seq)
      first = False
      cur_j = jj
      seq = ""

      continue

    seq += line.strip()

  check(cur_j, seq)


print "ok"
