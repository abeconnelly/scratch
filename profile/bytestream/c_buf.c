#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>

int main(int argc, char **argv) {
  int i,n=(1<<28);
  char s[] = "a";
  char ch='a';

  int m=1024, pos=0;
  char *buf;

  buf = malloc(sizeof(char)*m);

  for (i=0; i<n; i++) {

    buf[pos++] = ch;

    if (pos==m) {
      fwrite(buf, m, 1, stdout);
      pos=0;
    }

    if ((i%50)==0) {

      buf[pos++] = '\n';
      if (pos==m) {
        fwrite(buf, m, 1, stdout);
        pos=0;
      }

    }
  }

  fwrite("\n", 1, 1, stdout);

}
