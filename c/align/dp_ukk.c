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

/*
 *
example usage:

echo -e "cute\ncat" | ./dpa_ukk

*/


#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MISMATCH 3
#define GAP 2
#define MIN(x,y) (((x)<(y))?(x):(y))

int ukk_test(char *a, char *b, int T) {
  int i, j, k, kp;
  int del, m;
  int p;
  int n_c, m_r;
  int s_ovf;
  int *r, len_r, retval;
  int a_pos, b_pos;

  int ii;

  n_c = strlen(a)+1;
  m_r = strlen(b)+1;

  s_ovf = ((n_c>m_r)?(n_c-m_r):(m_r-n_c));
  del = MIN(MISMATCH, GAP);

  p = (T/del);
  if (p < s_ovf) { return -1; }

  p -= s_ovf;
  p /= 2;

  kp = ( (n_c>=m_r) ? (-p) : (-p + (n_c-m_r)) );
  k = kp;

  len_r = s_ovf+2*p+1;
  r = (int *)malloc(sizeof(int)*len_r);

  for (i=0; i<len_r; i++) {
    if (i<(len_r/2)) { r[i] = -1; }
    else { r[i] = (i-(len_r/2))*GAP; }
  }

  for (i=1; i<m_r; i++) {
    for (j=0; j<len_r; j++) {

      b_pos = j+k;
      m = -1;

      if (b_pos>=0) {
        if (r[j]>=0) {
          if (a[i-1]==b[b_pos]) { m = r[j]; }
          else { m = r[j] + MISMATCH; }
        }
      }

      if (j<(len_r-1)) {
        if (r[j+1]>=0) {
          if (m<0) { m = r[j+1] + GAP; }
          else if (m > (r[j+1] + GAP)) { m = r[j+1] + GAP; }
        }
      }

      if (j>0) {
        if (r[j-1]>=0) {
          if (m<0) { m = r[j-1] + GAP; }
          else if (m > (r[j-1] + GAP)) { m = r[j-1] + GAP; }
        }
      }

      r[j] = m;

    }
    k++;

  }

  retval = r[n_c-m_r + 2*p + kp];

  free(r);

  if (retval <= T) { return retval; }
  return -1;
}

int main(int argc, char **argv) {
  int i, j, k;

  //char *a = "cute";
  //char *b = "cats";

  //char *a = "zig";
  //char *b = "zag";

  //char *a = "fizzy";
  //char *b = "fuzzy";

  //char *a = "fizzy";
  //char *b = "fuzz";

  char *a = "fizz";
  char *b = "fuzzy";

  k = ukk_test(a,b, 8);

  printf(">>> %d\n",k);
}
