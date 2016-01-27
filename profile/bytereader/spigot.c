#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int i, j, k;
  int n, m, rem;
  ssize_t sz;

  char buf[1024];

  m = 1024;
  n=1000000;
  if (argc>1) { n = atoi(argv[1]); }

  rem = (n%m);

  for (i=0; i<n; i++) {
    buf[i%m] = 'a'+(i%4);
    if ((i>0)&&((i%m)==0)) {
      sz=write(1,buf, m);
      if (sz!=m) {
        fprintf(stderr, "error\n");
        exit(1);
      }
    }
  }

  if (rem>0) {
    sz=write(1,buf,rem);
    if (sz!=rem) {
      fprintf(stderr, "error\n");
      exit(1);
    }
  }

}
