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


#ifndef INPBUF_
#define INPBUF_

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct sbuf_type {
  int n, sz;
  char *s;
} sbuf_t;

sbuf_t *sbuf_alloc(int);
void sbuf_free(sbuf_t *);

void sbuf_add(sbuf_t *, char);

#endif
