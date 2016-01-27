#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char **argv) {
  int n=-1, i;
  int x;


  if (argc>1) {
    n = atoi(argv[1]);
  }
  if (n<0) { n=1000000; }

  for (i=0; i<n; i++) { x = fgetc(stdin); }
  printf("c_readbyte (read %d bytes)\n", i);
}
