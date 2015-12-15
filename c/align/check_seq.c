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

int MISMATCH=3;
int GAP=2;

int main(int argc, char **argv) {
  char *x, *y;
  sbuf_t *inpa, *inpb;
  int inp_counter=0;
  char ch;
  int i, j, k, n, m;
  int score;

  inpa = sbuf_alloc(16);
  inpb = sbuf_alloc(16);

  while ((ch=fgetc(stdin))!=EOF) {
    if (ch=='\n') {
      inp_counter++;
      if (inp_counter==2) { break; };
      continue;
    }
    if (inp_counter==0) {
      sbuf_add(inpa, ch);
    } else {
      sbuf_add(inpb, ch);
    }
  }

  x = inpa->s;
  y = inpb->s;


  if (strlen(x)!=strlen(y)) {
    fprintf(stderr, "length mismatch\n");
    exit(-1);
  }

  n = strlen(x);

  score = 0;
  for (i=0; i<n; i++) {
    if (x[i]=='-') {
      if (y[i]=='-') { fprintf(stderr, "invalid alignment string ('-' aligned with '-' at %d)\n", i); exit(-1); }
      score += GAP;
    }

    else if (y[i]=='-') {
      if (x[i]=='-') { fprintf(stderr, "invalid alignment string ('-' aligned with '-' at %d)\n", i); exit(-1); }
      score += GAP;
    }

    else if (x[i]!=y[i]) {
      score+=MISMATCH;
    }

  }

  printf("%d\n", score);


}
