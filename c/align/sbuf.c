/*
    Copyright (C) 2015 Curoverse, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/




#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "sbuf.h"

sbuf_t *sbuf_alloc(int sz) {
  sbuf_t *sb;
  sb = (sbuf_t *)malloc(sizeof(sbuf_t));
  sb->n =0;
  sb->sz = sz;
  sb->s = (char *)malloc(sizeof(char)*sz);
  sb->s[0] ='\0';
  return sb;
}

void sbuf_free(sbuf_t *sb) {
  free(sb->s);
  free(sb);
}

void sbuf_resize(sbuf_t *sb, int sz) {
  char *new_s;
  new_s = (char *)malloc(sizeof(char)*sz);
  memcpy(new_s, sb->s, sb->n);
  new_s[sb->n] = '\0';
  free(sb->s);
  sb->s = new_s;
  sb->sz = sz;
}

void sbuf_add(sbuf_t *sb, char ch) {
  if ((sb->n+1) >= sb->sz) { sbuf_resize(sb, 2*sb->sz); }
  sb->s[sb->n++] = ch;
  sb->s[sb->n] = '\0';
}

/*
int main(int argc, char **argv) {
  int i;
  sbuf_t *sb;

  sb = sbuf_alloc(3);

  for (i=0; i<100; i++) {
    printf("%d %s\n", i, sb->s);

    sbuf_add(sb, 'x');
  }

  sbuf_free(sb);
}
*/

