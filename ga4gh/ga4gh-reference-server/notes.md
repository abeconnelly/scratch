Installing GA4GH Reference Server From Source
---

```bash
$ git clone https://github.com/ga4gh/server
$ cd server
$ git checkout origin/graph
$ sudo pip install -U flask-cors
$ wget http://apache.spinellicreations.com/avro/avro-1.7.7/py/avro-1.7.7.tar.gz
$ pushd . ; tar xvfz avro-1.7.7.tar.gz ; cd avro-1.7.7 ; sudo python setup.py install ; popd
$ sudo apt-get install python-humanize # might need to add 'deb http://us.archive.ubuntu.com/ubuntu utopic main universe' to /etc/apt/sources.list
$ git clone https://github.com/brentp/pyfasta ; pushd pyfasta ; sudo python setup.py install ; popd
$ cat <<EOF > config.py
# This file needs to be copied to /app/ga4gh/config.py by default
import os

#TODO this logic could move to frontend.configure() or BaseConfig
# For docker, if/when a default is set in serverconfig.py, run -v /localdata:/default-path
# If the env variable GA4GH_DATA_SOURCE is set, use that path. Otherwise, use the default path
DATA_SOURCE = os.getenv('GA4GH_DATA_SOURCE', "/ga4gh-example-data")

# If the env variable GA4GH_DEBUG is set, use that. Otherwise, use the empty string (False)
# Enable with True
DEBUG = os.getenv('GA4GH_DEBUG', "")
EOF
$ export GA4GH_DATA_SOURCE=`pwd`'/tests/data'
$ push ga4gh ; ln -s ../config.py . ; popd
$ python server_dev.py -f config.py
```

You should now have a running test reference server on port 8000.

```bash
$ firefox localhost:8000
```

As of this writing, the following commands look to be implemented:

```
POST  /v0.6.g/allelecalls/search
GET   /v0.6.g/alleles/<id>
POST  /v0.6.g/alleles/search
POST  /v0.6.g/callsets/search
POST  /v0.6.g/joins/search
GET   /v0.6.g/mode/<mode>
POST  /v0.6.g/readgroupsets/search
POST  /v0.6.g/reads/search
GET   /v0.6.g/references/<id>
GET   /v0.6.g/references/<id>/bases
POST  /v0.6.g/references/search
GET   /v0.6.g/referencesets/<id>
POST  /v0.6.g/referencesets/search
GET   /v0.6.g/sequences/<id>/bases
POST  /v0.6.g/sequences/search
POST  /v0.6.g/subgraph/extract
POST  /v0.6.g/variants/search
POST  /v0.6.g/variantsets/search
```




