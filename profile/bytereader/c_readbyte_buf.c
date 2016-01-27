#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int n=-1, i;
  int x;
  char buf[1024];
  int pos, nbuf;
  ssize_t s;

  pos = 0;
  nbuf = 1024;

  if (argc>1) {
    n = atoi(argv[1]);
  }
  if (n<0) { n=1000000; }

  for (i=0; i<n; i++) {

    if (pos==nbuf) {
      s=read(0,buf,nbuf);
      pos=0;
    }

    x = buf[pos];
    pos++;
  }

  printf("c_readbyte_buf (read %d bytes)\n", i);
}
