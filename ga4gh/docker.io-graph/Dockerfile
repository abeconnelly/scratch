FROM debian:jessie

RUN apt-get update && apt-get install -y python-dev zlib1g-dev python-virtualenv \
  build-essential autoconf libtool pkg-config python-pyrex idle-python2.7 \
  apache2 libapache2-mod-wsgi \
  python-humanize && \
  a2enmod wsgi

RUN apt-get install -y git python-pip wget telnet daemontools

RUN cd /root ; git clone https://github.com/ga4gh/server && \
  cd server && git checkout origin/graph && \
  pip install -U flask-cors && \
  wget http://apache.spinellicreations.com/avro/avro-1.7.7/py/avro-1.7.7.tar.gz && \
  tar xvfz avro-1.7.7.tar.gz && cd avro-1.7.7 && python setup.py install && cd .. && \
  git clone https://github.com/brentp/pyfasta && cd pyfasta && python setup.py install && cd ..

COPY config.py /root/config/config.py

RUN cd /root/server/ga4gh && ln -s /root/config/config.py . && cd ..

RUN pip install pysam numpy && apt-get install -y samtools

COPY ./config/application.wsgi /srv/ga4gh/application.wsgi
COPY ./config/config.py /srv/ga4gh/config.py
COPY ./config/000-default.conf /etc/apache2/sites-available/000-default.conf

COPY ./run /root/run

COPY ./test-data.tar.gz /root/
RUN cd /root && tar xvfz test-data.tar.gz

EXPOSE 8000
#EXPOSE 80

CMD [ "supervise", "/root" ]
