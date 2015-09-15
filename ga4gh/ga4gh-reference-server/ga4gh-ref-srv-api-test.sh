#!/bin/bash
#
# 'X's aren't tested here
#
#   POST  /v0.6.g/allelecalls/search
#   POST  /v0.6.g/alleles/search
#   POST  /v0.6.g/callsets/search
#   POST  /v0.6.g/joins/search
# X POST  /v0.6.g/readgroupsets/search
# X POST  /v0.6.g/reads/search
#   POST  /v0.6.g/references/search
#   POST  /v0.6.g/referencesets/search
#   POST  /v0.6.g/sequences/search
# X POST  /v0.6.g/variants/search
#   POST  /v0.6.g/variantsets/search
#
#   GET   /v0.6.g/alleles/<id>
#   GET   /v0.6.g/mode/<mode>
#   GET   /v0.6.g/references/<id>
#   GET   /v0.6.g/references/<id>/bases
#   GET   /v0.6.g/referencesets/<id>
#   GET   /v0.6.g/sequences/<id>/bases
#
#   POST  /v0.6.g/subgraph/extract

host="http://localhost:8000/v0.6.g"
ctype='Content-Type: application/json'

#curl --data '{"md5checksums":[], "accessions":[], "assemblyById":null }' --header "$ctype" $host/variants/search | jq .

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/allelecalls/search | jq .
echo ""

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/alleles/search | jq .
echo ""

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/callsets/search | jq .
echo ""

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/joins/search | jq .
echo ""

# skipping reads and readgroupsets

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/references/search | jq .
echo ""

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/referencesets/search | jq .
echo ""

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/sequences/search | jq .
echo ""

# skipping variants

curl -s --data '{ "start":0, "end":10 }' --header "$ctype" $host/variantsets/search | jq .
echo ""

####

curl -s $host/alleles/1 | jq .
echo ""

# ??
curl -s $host/mode/idontknowwhatgoeshere| jq .
echo ""

# references not implemented?
#curl -s $host/references/1 | jq .
#curl -s $host/references/1/bases | jq .

# referencesets not implemented?
#curl -s $host/referencesets/1 | jq .


curl -s $host/sequences/1/bases | jq .
echo ""

# method not allowed?
#curl -s $host/subgraph/extract | jq .


