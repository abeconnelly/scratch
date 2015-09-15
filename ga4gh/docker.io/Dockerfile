FROM ubuntu:14.10

RUN apt-get update && apt-get install -y python-dev zlib1g-dev python-virtualenv \
  build-essential autoconf libtool pkg-config python-pyrex idle-python2.7 \
  apache2 libapache2-mod-wsgi && \
  a2enmod wsgi && \
  mkdir /var/cache/apache2/python-egg-cache && \
  chown www-data:www-data /var/cache/apache2/python-egg-cache/ && \
  mkdir /srv/ga4gh && \
  useradd -m ga4gh && echo 'ga4gh:ga4gh' | chpasswd && \
  chown ga4gh:ga4gh /srv/ga4gh

RUN apt-get install -y wget

RUN su --login ga4gh -c "cd /srv/ga4gh && \
  virtualenv ga4gh-server-env && \
  source ga4gh-server-env/bin/activate && \
  pip install --pre ga4gh && \
  deactivate && \
  wget 'http://www.well.ox.ac.uk/~jk/ga4gh-example-data.tar' && \
  tar -xf ga4gh-example-data.tar"

RUN apt-get install -y telnet daemontools

COPY ./config/application.wsgi /srv/ga4gh/application.wsgi
COPY ./config/config.py /srv/ga4gh/config.py
COPY ./config/000-default.conf /etc/apache2/sites-available/000-default.conf

COPY ./run /root/run

CMD [ "supervise", "/root" ]
