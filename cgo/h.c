#include "h.h"

void hello_friend(char *s) {
  printf("hello, %s\n", s);
}

char *emit_string() {
  char *q = "the quick brown fox jumps over the lazy yellow dog";
  char *s;
  s = strdup(q);
  return s;
}
