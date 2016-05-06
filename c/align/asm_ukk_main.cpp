#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>

#include <string>

extern "C" {
#include "asm_ukk.h"
}

void show_help(void) {
  printf("usage:\n");
  printf("  [-m mismatch_cost]    Cost of mismatched character (must be positive, default %d)\n", ASM_UKK_MISMATCH);
  printf("  [-g gap_cost]         Cost of gap (must be positive, default %d)\n", ASM_UKK_GAP);
  printf("  [-c gap_char]         Gap character (default '-')\n");
  printf("  [-S]                  Do not print aligned sequence\n");
  printf("  [-h]                  Help (this screen)\n");
}

int read_string(FILE *fp, std::string &s) {
  char ch;

  while ((ch=fgetc(fp))!=EOF) {
    if (ch=='\n') { break; }
    s += ch;
  }
  if ((ch==EOF) && (errno!=0)) { return -1; }

  return s.length();
}

int main(int argc, char **argv) {
  int k;
  char ch;

  std::string a, b;
  char *X, *Y;
  char *a_s, *b_s;
  char gap_char = '-';

  int print_align_sequence=1;
  int mismatch_cost=ASM_UKK_MISMATCH, gap_cost=ASM_UKK_GAP;
  int score=-1;

  while ((ch=getopt(argc, argv, "m:g:hS"))!=-1) switch(ch) {
    case 'm':
      mismatch_cost = atoi(optarg);
      break;
    case 'g':
      gap_cost = atoi(optarg);
      break;
    case 'c':
      gap_char = optarg[0];
      break;
    case 'S':
      print_align_sequence=0;
      break;
    case 'h':
    default:
      show_help();
      exit(0);
  }

  if ((mismatch_cost<0) || (gap_cost<0)) {
    fprintf(stderr, "Mismatch cost (-m) and gap cost (-g) must both be non-zero\n");
    show_help();
    exit(1);
  }

  k = read_string(stdin, a);
  if (k<0) { perror("error reading first string"); exit(1); }
  k = read_string(stdin, b);
  if (k<0) { perror("error reading second string"); exit(1); }

  a_s = (char *)(a.c_str());
  b_s = (char *)(b.c_str());

  if (print_align_sequence) {
    score = asm_ukk_align2(&X, &Y, a_s, b_s, mismatch_cost, gap_cost, gap_char);
    if (score>=0) {
      printf("%d\n%s\n%s\n", score, X, Y);
    } else {
      printf("%d\n", score);
    }
  } else {
    score = asm_ukk_align2(NULL, NULL, a_s, b_s, mismatch_cost, gap_cost, gap_char);
    printf("%d\n", score);
  }

  return 0;
}
