README
===

Overview
---

Create a sandbox environment to play with GA4GH endpoints/servers in
isolation.

This build is to run the 'graph' branch of GA4GH reference server.

Also included are:

* [vg](https://github.com/ekg/vg/)
* [sg2vg](https://github.com/glennhickey/sg2vg)

Along with a host of other supporting software.  The additional tools are provided in the hopes
of creating as self contained a system as possible.


Quickstart (Pre-Built Docker Container)
---

There is a Docker container ready on the docker registry called [abeconnelly/ga4gh-server-graph](https://registry.hub.docker.com/u/abeconnelly/ga4gh-server-graph/)
that can be used:

    docker pull abeconnelly/ga4gh-server-graph
    docker run -d -p 8000:8000 abeconnelly/ga4gh-server-graph

And connect to it through a web browser:

    firefox localhost:8185/ga4gh

Quickstart (Locally Built Docker Container)
---

If, instead, you would like to create your own Docker file, there is a `Dockerfile` that can be built:

    git checkout https://github.com/abeconnelly/scratch
    cd scratch/ga4gh/docker.io-graph
    docker build -t local-ga4gh-docker-server-graph .
    docker run -d -p 8000:8000 local-ga4gh-docker-server-graph

Once the docker container is running, you can connect to it through port 8000:

    firefox localhost:8000

File locations
---

This is still a work in progress and is subject to change.  Listed are some of the relevant
files and their locations:

* `/root/run` - Main Docker application (run on startup)
* `/srv/ga4gh/config.py` - Server config file
* `/root/server/server_dev.py` - Running GA4GH program file (run by `/root/run`)
* `/ga4gh-example-data` - Location of graph database files
* `/srv/ga4gh/ga4gh-example-data` - Location of data that server uses
* `/srv/ga4gh/ga4gh-example-data/graphs` - Symlink to graph data location (in `/ga4gh/example-data/data/graphs`)

Interactive shell
---

One can poke around the Docker image by running an interactive shell:

    docker run -t -i -p 8000:8000 abeconnelly/ga4gh-server-graph /bin/bash
