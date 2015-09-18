FROM debian:jessie

RUN apt-get update && \
    apt-get install -y python-dev zlib1g-dev python-virtualenv \
    build-essential autoconf libtool pkg-config python-pyrex idle-python2.7 \
    apache2 libapache2-mod-wsgi vim samtools \
    python-humanize git python-pip wget && \
    pip install pysam numpy && \
    a2enmod wsgi

RUN cd /root && \
    git clone https://github.com/ga4gh/server && \
    cd server && \
      git checkout graph && \
      pip install -U flask-cors && \
      wget http://apache.spinellicreations.com/avro/avro-1.7.7/py/avro-1.7.7.tar.gz && \
      tar xvfz avro-1.7.7.tar.gz && \
      cd avro-1.7.7 && \
        python setup.py install && \
      cd .. && \
      git clone https://github.com/brentp/pyfasta && \
    cd pyfasta && \
    python setup.py install && \
    cd ..

RUN mkdir /srv/ga4gh && \
    useradd -m ga4gh && \
    echo 'ga4gh:ga4gh' | chpasswd && \
    chown -R ga4gh:ga4gh /srv/ga4gh

COPY ./test-data.tar.gz /srv/ga4gh/test-data.tar.gz
COPY ./config/config.py /srv/ga4gh/config.py
COPY ./config/application.wsgi /srv/ga4gh/application.wsgi
COPY ./config/000-default.conf /etc/apache2/sites-available/000-default.conf



RUN cd /srv/ga4gh && \
    wget 'http://www.well.ox.ac.uk/~jk/ga4gh-example-data.tar' && \
    tar -xf ga4gh-example-data.tar


RUN mkdir /ga4gh-example-data/ && cd /ga4gh-example-data && \
    tar -xzf /srv/ga4gh/test-data.tar.gz


RUN ln -s /ga4gh-example-data/data/graphs /srv/ga4gh/ga4gh-example-data/

RUN apt-get install -y jq protobuf-compiler libprotoc-dev libjansson-dev automake libtool \
    curl unzip

RUN apt-get install -y cmake libbz2-dev libncurses5 libncurses5-dev

RUN cd /root && \
    git clone --recursive https://github.com/ekg/vg && \
    cd vg && \
    make

RUN apt-get install -y curl libcurl4-gnutls-dev libcurlpp-dev && \
    cd /root && \
    git clone --recursive https://github.com/glennhickey/sg2vg && \
    cd sg2vg && \
    make

RUN ln -s /root/sg2vg/sg2vg /bin/sg2vg && \
    ln -s /root/vg/vg /bin/vg

#RUN apt-get update && apt-get install -y python-dev zlib1g-dev python-virtualenv \
#  build-essential autoconf libtool pkg-config python-pyrex idle-python2.7 \
#  apache2 libapache2-mod-wsgi wget telnet daemontools && \
#  a2enmod wsgi && \
#  mkdir /var/cache/apache2/python-egg-cache && \
#  chown www-data:www-data /var/cache/apache2/python-egg-cache/ && \
#  mkdir /srv/ga4gh && \
#  useradd -m ga4gh && echo 'ga4gh:ga4gh' | chpasswd && \
#  chown -R ga4gh:ga4gh /srv/ga4gh

#RUN su --login ga4gh -c "cd /srv/ga4gh && \
#  virtualenv ga4gh-server-env && \
#  . /srv/ga4gh/ga4gh-server-env/bin/activate && \
#  pip install --pre ga4gh && \
#  deactivate && \
#  wget 'http://www.well.ox.ac.uk/~jk/ga4gh-example-data.tar' && \
#  tar -xf ga4gh-example-data.tar"

COPY ./run /root/run

#CMD [ "supervise", "/root" ]
