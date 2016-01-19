#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  int i, n=(1<<28);
  char ch='a';

  for (i=0; i<n; i++) {
    printf("%c", ch);
    if ((i%50)==0) {
      printf("\n");
    }
  }
  printf("\n");
}
