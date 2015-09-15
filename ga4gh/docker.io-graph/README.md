README
===

Overview
---

Create a sandbox environment to play with GA4GH endpoints/servers in
isolation.

This build is to run the 'graph' branch of GA4GH reference server.

Quickstart (Pre-Built Docker Container)
---

There is a Docker container ready on the docker registry called [abeconnelly/ga4gh-server-graph](https://registry.hub.docker.com/u/abeconnelly/ga4gh-server-graph/)
that can be used:

```bash
$ docker pull abeconnelly/ga4gh-server-graph
$ docker run -d -p 8185:80 abeconnelly/ga4gh-server-graph
```

```bash
$ firefox localhost:8185/ga4gh
```

Quickstart (Locally Built Docker Container)
---

If, instead, you would like to create your own Docker file, there is a `Dockerfile` that can be built:

```bash
$ git checkout https://github.com/abeconnelly/scratch
$ cd scratch/ga4gh/docker.io-graph
$ docker build -t local-ga4gh-docker-server-graph .
$ docker run -d -p 8000:8000 local-ga4gh-docker-server-graph
```

Once the docker container is running, you can connect to it through port 8000:

```bash
$ firefox localhost:8000
```
