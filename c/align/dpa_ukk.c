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

int g_debug=0;
int g_verbose=0;

int default_score(char x, char y) {
  if (x==y) { return 0; }
  return 3;
}

int default_gap(char x) {
  return 2;
}

#define MISMATCH 3
#define GAP 2

void debug_print_W3(int *W, int m_r, int w_len, char *a, char *b) {
  int r, w, n_c, c;

  n_c = strlen(a)+1;

  printf("     ");
  for (c=0; c<(w_len/2); c++) { printf("   "); printf("   "); }
  for (c=0; c<n_c; c++) {
    if (c==0) { printf("   "); printf("  -"); }
    else { printf("  %2d %c", c, a[c-1]); }
  }
  printf("\n");



  for (r=0; r<m_r; r++) {
    if (r==0) { printf("   "); printf(" -"); }
    else { printf(" %2d %c", r, b[r-1]); }

    for (c=0; c<r; c++) { printf("   "); printf("   "); }

    for (w=0; w<w_len; w++) {
      printf("   ");
      printf(" %2d", W[r*w_len + w]);
    }
    printf("\n");
  }
}

void debug_print_W2(int *W, int m_r, int w_len, char *a, char *b) {
  int r, w, n_c, c;

  n_c = strlen(a)+1;

  printf("  ");
  for (c=0; c<(w_len/2); c++) { printf("   "); }
  for (c=0; c<n_c; c++) {
    if (c==0) { printf("  -"); }
    else { printf("  %c", a[c-1]); }
  }
  printf("\n");



  for (r=0; r<m_r; r++) {
    if (r==0) { printf(" -"); }
    else { printf(" %c", b[r-1]); }

    for (c=0; c<r; c++) { printf("   "); }

    for (w=0; w<w_len; w++) {
      printf(" %2d", W[r*w_len + w]);
    }
    printf("\n");
  }
}

void debug_print_W(int *W, int m_r, int w_len) {
  int r, w;
  for (r=0; r<m_r; r++) {
    for (w=0; w<w_len; w++) {
      printf(" %3d", W[r*w_len + w]);
    }
    printf("\n");
  }
}

int align_W(char **X, char **Y, char *a, char *b, int *W, int m_r, int n_c, int w_len) {
  int i;
  int dr, dc;
  int r, c, w;
  int pos00, pos01, pos10, pos11;
  int w_offset;
  int mm;
  int xy_pos=0;
  char ch;

  char *tx, *ty;

  i = ((n_c>m_r)?n_c:m_r);

  tx = (char *)malloc(sizeof(char)*2*i);
  ty = (char *)malloc(sizeof(char)*2*i);

  tx[2*i-1] = '\0';
  ty[2*i-1] = '\0';

  w_offset = w_len/2;

  r = m_r-1;
  c = n_c-1;
  while ((r>0) || (c>0)) {
    dr = 0;
    dc = 0;

    w = c - (r-w_offset);
    pos11 = r*w_len + w;

    if ((r>0) && (c>0)) {
      w = (c-1) - ((r-1)-w_offset);
      if ((w>=0) && (w<w_len)) {
        pos00 = (r-1)*w_len + w;
        mm = ((a[c-1]==b[r-1])?0:MISMATCH);
        if ((W[pos00]+mm) == W[pos11]) { dr=-1; dc=-1; }
      }
    }

    if (r>0) {
      w = c - ((r-1)-w_offset);
      if ((w>=0) && (w<w_len)) {
        pos01 = (r-1)*w_len + w;
        if ((W[pos01]+GAP) == W[pos11]) { dr=-1; dc=0; }
      }
    }

    if (c>0) {
      w = (c-1) - (r-w_offset);
      if ((w>=0) && (w<w_len)) {
        pos10 = r*w_len + w;
        if ((W[pos10]+GAP) == W[pos11]) { dr=0; dc=-1; }
      }
    }

    if ((dr==-1) && (dc==-1)) {
      tx[xy_pos] = a[c-1];
      ty[xy_pos] = b[r-1];
    } else if ((dr==-1) && (dc==0)) {
      tx[xy_pos] = '-';
      ty[xy_pos] = b[r-1];
    } else if ((dr==0) && (dc==-1)) {
      tx[xy_pos] = a[c-1];
      ty[xy_pos] = '-';
    } else {
      free(tx);
      free(ty);
      return -1;
    }

    xy_pos++;
    r+=dr;
    c+=dc;
  }

  tx[xy_pos]='\0';
  ty[xy_pos]='\0';

  for (i=0; i<(xy_pos/2); i++) {
    ch = tx[i]; tx[i] = tx[xy_pos-i-1]; tx[xy_pos-i-1] = ch;
    ch = ty[i]; ty[i] = ty[xy_pos-i-1]; ty[xy_pos-i-1] = ch;
  }

  *X = tx;
  *Y = ty;

  return 0;
}

int sa_align_ukk_test1(char **X, char **Y, char *a, char *b, int T) {
  int r,c, n_c, m_r, len_ovf;
  int *W, w, w_offset, w_len;
  int p, del, m;

  n_c = strlen(a)+1;
  m_r = strlen(b)+1;

  del = ((MISMATCH<GAP)?MISMATCH:GAP);

  // t/del < |n-m| -> reject
  //
  len_ovf = ((n_c>m_r) ? (n_c-m_r) : (m_r-n_c));
  if ((T/del) < len_ovf) { return -1; }

  p = (T/del) - len_ovf;
  p /= 2;

  w_offset = ((n_c>m_r) ? (n_c-m_r+p) : p);
  w_len = 2*w_offset+1;

  // our window isn't big enough to hold calculated values
  //
  w = (n_c-1) - ((m_r-1)-w_offset);
  if ((w<0) || (w>=w_len)) { return -1; }

  W = (int *)malloc(sizeof(int)*m_r*w_len);

  for (w=0; w<w_len; w++) {
    if (w<w_offset) { W[w] = -1; }
    else { W[w] = GAP*(w-w_offset); }
  }

  for (r=1; r<m_r; r++) {

    // For conceptual simplicity, enumerate columns
    //
    for (c=(r-w_offset); c<=(r+w_offset); c++) {


      // Window position
      //
      w = c - (r-w_offset);

      if (c<0) { W[r*w_len + w] = -1; }
      else if (c==0) { W[r*w_len + w] = r*GAP; }
      else if (c>=n_c) { W[r*w_len + w] = -1; }
      else {

        // diagonal value
        //
        m = W[(r-1)*w_len + w] + ((a[c-1]==b[r-1]) ? 0 : MISMATCH);


        // left to right transition
        //
        if ((w>0) && ((W[r*w_len+w-1] + GAP) < m)) { m = W[r*w_len+w-1] + GAP; }


        // top to bottom transition
        //
        if ((w+1)!=w_len) {
          if ((W[(r-1)*w_len+w+1] + GAP) < m) { m = W[(r-1)*w_len+w+1] + GAP; }
        }

        W[r*w_len+w] = m;
      }

    }
  }

  w = (n_c-1) - ((m_r-1)-w_offset);
  m = W[(m_r-1)*w_len + w];

  align_W(X, Y, a, b, W, m_r, n_c, w_len);

  free(W);

  if (m>T) { return -1; }
  return m;
}

int sa_score_ukk_test1(char *a, char *b, int T) {
  int r,c, n_c, m_r, len_ovf;
  int *W, w, w_offset, w_len;
  int p, del, m;

  n_c = strlen(a)+1;
  m_r = strlen(b)+1;

  del = ((MISMATCH<GAP)?MISMATCH:GAP);

  // t/del < |n-m| -> reject
  //
  len_ovf = ((n_c>m_r) ? (n_c-m_r) : (m_r-n_c));
  if ((T/del) < len_ovf) { return -1; }

  //DEBUG
  if (g_debug) { printf("T %d, del %d, T/del %d, len_ovf %d\n", T, del, T/del, len_ovf); }

  p = (T/del) - len_ovf;
  p /= 2;

  w_offset = ((n_c>m_r) ? (n_c-m_r+p) : p);
  w_len = 2*w_offset+1;

  // our window isn't big enough to hold calculated values
  //
  w = (n_c-1) - ((m_r-1)-w_offset);
  if ((w<0) || (w>=w_len)) { return -1; }


  W = (int *)malloc(sizeof(int)*m_r*w_len);

  //DEBUG
  if (g_debug) { printf("w_len: %d\n", w_len); }

  for (w=0; w<w_len; w++) {
    if (w<w_offset) { W[w] = -1; }
    else { W[w] = GAP*(w-w_offset); }
  }

  // Go through row by row
  //
  for (r=1; r<m_r; r++) {

    // For conceptual reasons, enumerate columns
    //
    for (c=(r-w_offset); c<=(r+w_offset); c++) {


      // Window position
      //
      w = c - (r-w_offset);

      if (c<0) { W[r*w_len + w] = -1; }
      else if (c==0) { W[r*w_len + w] = r*GAP; }
      else if (c>=n_c) { W[r*w_len + w] = -1; }
      else {

        //DEBUG
        if (g_debug) {
          printf("\n\n--\nr%d, c%d, w%d\n", r, c, w);
        }

        /*
        if (w==0) {
          W[r*w_len + w] = W[(r-1)*w_len + w+1] + GAP;
          continue;
        }
        */

        // diagonal value
        //
        m = W[(r-1)*w_len + w] + ((a[c-1]==b[r-1]) ? 0 : MISMATCH);

        //DEBUG
        if (g_debug) { printf("r %d, c %d, w %d --> m.a %d\n", r, c, w, m); }
        if (g_debug) { printf("  W[%d,%d] = %d (m now %d)\n", r, w-1, W[r*w_len+w-1], m); }


        // left to right transition
        //
        if ((w>0) && ((W[r*w_len+w-1] + GAP) < m)) {
          m = W[r*w_len+w-1] + GAP;

          //DEBUG
          if (g_debug) { printf("r %d, c %d, w %d --> m.b %d\n", r, c, w, m); }


        }


        // top to bottom transition
        //
        if ((w+1)!=w_len) {

          //DEBUG
          if (g_debug) { printf("  W[%d,%d] = %d (m now %d)\n", r-1, w+1, W[(r-1)*w_len+w+1], m); }

          if ((W[(r-1)*w_len+w+1] + GAP) < m) {
            m = W[(r-1)*w_len+w+1] + GAP;

            if (g_debug) { printf("r %d, c %d w %d -> m.c %d\n", r, c, w, m); }
          }
        }

        W[r*w_len+w] = m;
      }

    }
  }


  if (g_debug) {
  //debug_print_W(W, m_r, w_len);
  //debug_print_W2(W, m_r, w_len, a, b);
  debug_print_W3(W, m_r, w_len, a, b);
  }

  w = (n_c-1) - ((m_r-1)-w_offset);
  if ((w<0) || (w>=w_len)) {
    free(W);
    return -1;
  }

  //int pos = (m_r-1)*w_len + (n_c-1) - ((m_r-1)-w_offset);
  int pos = (m_r-1)*w_len + w;

  if (g_debug)  {
    //DEBUG
    printf(">>>> %d %d [%d] -> %d\n",
        m_r-1, n_c-1,
        pos,
        W[pos]);
    printf(">>>> m_r %d, n_c %d, w_offset %d, |W| = %d\n", m_r, n_c, w_offset, m_r*w_len);
  }

  m = W[pos];

  free(W);

  if (m>T) { return -1; }
  return m;

}

int main(int argc, char **argv) {
  int sc=-2;
  char ch;
  int inp_counter=0;
  int T=4;

  sbuf_t *inpa, *inpb;

  char *a = "fizzy";
  char *b = "fuzz";
  int it=0, max_it=32;

  char *X, *Y;

  if (argc>=2) {
    T = atoi(argv[1]);
  }

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

  a = inpa->s;
  b = inpb->s;

  //printf(">>>> %d\n'%s' '%s'\n", T, a, b);

  //sc = sa_score_ukk_test1(a, b, 6);
  //sc = sa_score_ukk_test1(a, b, 20000);
  //sc = sa_score_ukk_test1(a, b, 1000);

  for (it=0; (it<max_it) && (sc<0); it++) {
    //printf(">>>>>>> T %d\n", T);
    //sc = sa_score_ukk_test1(a, b, T);
    sc = sa_align_ukk_test1(&X, &Y, a, b, T);
    T *= 2;
  }

  if (g_debug) {
    printf("%s\n%s\n", a, b);
  }

  if (g_verbose) { printf("score: "); }
  printf("%d\n", sc);

  if (g_verbose) { printf("X: "); }
  printf("%s\n", X);

  if (g_verbose) { printf("Y: "); }
  printf("%s\n", Y);

}
