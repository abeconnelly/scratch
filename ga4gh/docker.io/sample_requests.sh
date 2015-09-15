#!/bin/bash

# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchCallSetsRequest
#
curl --data '{"variantSetIds":["1kg-phase1"], "name":null}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/callsets/search | jq .

# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchReadGroupSetsRequest
#
curl --data '{"datasetIds":[], "name":null}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/readgroupsets/search | jq .


# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchReadsRequest
#
#curl --data '{"readGroupIds":[], "referenceNname":null, "referenceId":null, "start":0}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/reads/search | jq .
curl --data '{"readGroupIds":["low-coverage:HG00533.mapped.ILLUMINA.bwa.CHS.low_coverage.20120522"], "referenceNname":null, "referenceId":null, "start":0}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/reads/search | jq .

# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchReferenceSetsRequest
#
curl --data '{"md5checksums":[], "accessions":[], "assemblyById":null }' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/referencesets/search | jq .


# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchVariantsRequest
#
#curl --data '{"variantSetIds":[], "variantName":null, "callSetIds":[], "start":0, "end":10000}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/variants/search | jq .
curl --data '{"variantSetIds":["1kg-phase1"], "callSetIds":[], "referenceName":"???", "start":1, "end":10000}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/variants/search | jq .


# http://ga4gh.org/documentation/api/v0.5.1/ga4gh_api.html#/schema/org.ga4gh.GASearchVariantSetsRequest
#
curl --data '{"datasetIds":[]}' --header 'Content-Type: application/json' http://localhost:8185/ga4gh/v0.5.1/variantsets/search | jq .





