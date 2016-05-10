#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <getopt.h>

#include <string>
#include <vector>
#include <map>

#include <openssl/md5.h>

#define A2FJ_VERSION "0.1.0"

//extern "C" {
//#include "asm_ukk.h"
//}

typedef struct tag_info_type {
  int ref_pos, ref_prev, ref_next;
  int tile_step;
  bool first, last;
} tag_info_t;

int read_seq(FILE *fp, std::string &s) {
  char ch;
  while (!feof(fp)) {
    ch = fgetc(fp);
    if (ch==EOF) { continue; }
    if ((ch==' ') || (ch=='\n') || (ch=='\r')) { continue; }
    s.push_back(ch);
  }
}

int construct_tag_map(std::map<std::string, tag_info_t> &m, std::string &tags, std::string &ref) {
  int i, prev=0;
  std::string tag, candidate;
  std::map<std::string, tag_info_t>::iterator map_it;
  tag_info_t ti;

  for (i=0; i<tags.length(); i+=24) {
    tag = tags.substr(i,24);

    ti.ref_pos = -1;
    ti.first = ((i==0) ? true : false);
    ti.last = ((i==(tags.length()-24)) ? true : false );
    ti.tile_step = i/24;
    m[tag] = ti;
  }

  for (i=0; i<(ref.length()-24); i++) {
    candidate = ref.substr(i,24);

    map_it = m.find(candidate);
    if (map_it == m.end()) { continue; }

    ti = m[candidate];

    if (ti.ref_pos>=0) {
      fprintf(stderr, "WARNING: multiple tag positions: (tag %s, previously %d, now %d)\n",
          candidate.c_str(), m[candidate].ref_pos, i);
    }

    ti.ref_pos = i;
    ti.ref_prev = prev;
    m[candidate] = ti;

    prev = i;
  }

}

/*
int align(const char *ref, const char *seq) {
  int score;
  char *X=NULL, *Y=NULL;

  score = asm_ukk_align2(&X, &Y, (char *)ref, (char *)seq, 3, 2, '-');
  if (X && Y) {
    printf("score: %d\nr*: %s\ns*: %s\n", score, X, Y);
    free(X);
    free(Y);
  }

  return 0;
}
*/

int emit_fastj(FILE *ofp, int path, int libver, int step, int varid,
    int seed_tile_len, bool start_tile, bool end_tile,
    std::string &build_name, std::string &build_chrom,
    int build_start, int build_n,
    std::string &ref_seq, std::string &seq) {

  char tbuf[16];
  std::string md5str, md5str_tagmask;
  unsigned char md5res[MD5_DIGEST_LENGTH];
  std::string tag;

  std::string mask_seq;

  int i, mod_line=50;
  int noc=0;
  int pos=0;

  if (!start_tile) {
    for (pos=0; pos<24; pos++) {
      if ((seq[pos]=='n') || (seq[pos]=='N')) {
        mask_seq += ref_seq[pos];
      } else {
        mask_seq += seq[pos];
      }
    }
  }

  for ( ; pos<(seq.length()-24); pos++) {
    mask_seq += seq[pos];
  }

  if (!end_tile) {
    for ( ; pos<seq.length(); pos++) {
      if ((seq[pos]=='n') || (seq[pos]=='N')) {
        mask_seq += ref_seq[pos];
      } else {
        mask_seq += seq[pos];
      }
    }
  } else {
    for ( ; pos<seq.length(); pos++) {
      mask_seq += seq[pos];
    }
  }
  MD5((unsigned char *)(seq.c_str()), seq.length(), md5res);
  for (i=0; i<MD5_DIGEST_LENGTH; i++) {
    snprintf(tbuf, 16, "%02x", md5res[i]);
    md5str_tagmask.push_back(tbuf[0]);
    md5str_tagmask.push_back(tbuf[1]);
  }


  MD5((unsigned char *)(seq.c_str()), seq.length(), md5res);
  for (i=0; i<MD5_DIGEST_LENGTH; i++) {
    snprintf(tbuf, 16, "%02x", md5res[i]);
    md5str.push_back(tbuf[0]);
    md5str.push_back(tbuf[1]);
  }

  fprintf(ofp, ">{\"tileID\":\"%04x.%02x.%04x.%03x\",\"md5sum\":\"%s\"",
      path, libver, step, varid,
      md5str.c_str());

  fprintf(ofp, ",\"tagmask_md5sum\":\"%s\"", md5str_tagmask.c_str());
  fprintf(ofp, ",\"locus\":[{\"build\":\"%s %s %i %i\"}]",
      build_name.c_str(), build_chrom.c_str(), build_start, build_start+build_n);
  fprintf(ofp, ",\"n\":%i", (int)seq.length());
  fprintf(ofp, ",\"seedTileLength\":%i", seed_tile_len);
  fprintf(ofp, ",\"startTile\":%s", start_tile ? "true" : "false");
  fprintf(ofp, ",\"endTile\":%s", end_tile ? "true" : "false");

  if (start_tile) {
    fprintf(ofp, ",\"startSeq\":\"\"");
  } else {
    tag = seq.substr(0,24);
    fprintf(ofp, ",\"startSeq\":\"%s\"", tag.c_str());

    tag = ref_seq.substr(0,24);
    fprintf(ofp, ",\"startTag\":\"%s\"", tag.c_str());
  }

  if (end_tile) {
    fprintf(ofp, ",\"endSeq\":\"\"");
  } else {
    tag = seq.substr(seq.length()-24,24);
    fprintf(ofp, ",\"endSeq\":\"%s\"", tag.c_str());

    tag = ref_seq.substr(ref_seq.length()-24,24);
    fprintf(ofp, ",\"endTag\":\"%s\"", tag.c_str());
  }

  for (i=0; i<seq.length(); i++) {
    if ((seq[i]=='n') || (seq[i]=='N')) { noc++; }
  }

  fprintf(ofp, ",\"nocallCount\":%i", noc);
  fprintf(ofp, ",\"notes\":[]");
  fprintf(ofp, "}");

  for (i=0; i<seq.length(); i++) {
    if ((i%mod_line)==0) { fprintf(ofp,"\n"); }
    fprintf(ofp, "%c", seq[i]);
  }
  fprintf(ofp, "\n\n");

}

int fastj_align(int path, int libver, int n_var, int start_step, int start_ref,
    std::string &build, std::string &build_chrom,
    std::string &seq, std::string &ref, std::map<std::string, tag_info_t> &tag_pos) {
  int i, j, k, v;
  std::string tag;
  std::map<std::string, tag_info_t>::iterator it;
  tag_info_t ti;

  //std::string build = "unk", build_chrom = "unk";

  FILE *ofp=stdout;

  std::string t0, t1;

  int prev_pos = 0;
  int ref_prev = 0;
  int e;
  int prev_step = -1;

  int n_ref = -1;

  for (i=0; i<(seq.length()-24); i++) {
    tag = seq.substr(i,24);

    it = tag_pos.find(tag);
    if (it == tag_pos.end()) { continue; }

    ti = tag_pos[tag];

    e = ti.ref_pos+24;
    if (e>=ref.length()) { e = ref.length(); }
    t0 = ref.substr(ref_prev, e-ref_prev);

    n_ref = e-ref_prev;

    e = i+24;
    if (e>=seq.length()) { e = seq.length(); }
    t1 = seq.substr(prev_pos, e-prev_pos);

    for (v=0; v<n_var; v++) {
      emit_fastj(ofp,
          path, libver, start_step+prev_step+1, v,         // tile id
          ti.tile_step - (prev_step+1) + 1,     // seed tile
          ti.first, false,                      // start/end tile
          build, build_chrom, start_ref+ref_prev, n_ref,  // build info
          t0,                                   // ref seq
          t1);                                  // seq actual
    }

    prev_pos = i;
    ref_prev = ti.ref_pos;
    prev_step = ti.tile_step;

    if (ti.last) { break; }

  }

  t0 = ref.substr(ref_prev, ref.length()-ref_prev);
  t1 = seq.substr(prev_pos, seq.length()-prev_pos);

  for (v=0; v<n_var; v++) {
    emit_fastj(ofp,
        path, libver, start_step+prev_step+1, v,         // tile id
        ti.tile_step - prev_step + 1,         // seed tile
        ti.first, true,                       // start/end tile
        build, build_chrom, start_ref+ref_prev, n_ref,  // build info
        t0,                                   // ref seq
        t1);                                  // seq actual
  }

  return 0;
}


int verbose_flag, help_flag;

static struct option long_option[] = {
  {"verbose",   no_argument,       &verbose_flag, 1},
  {"help",      no_argument,       &help_flag, 1},
  {"input",     required_argument, 0, 'i'},
  {"refstream", required_argument, 0, 'r'},
  {"tag",       required_argument, 0, 'T'},
  {"tilepath",  required_argument, 0, 0},
  {"build",     required_argument, 0, 0},
  {"chrom",     required_argument, 0, 0},
  {"startstep", required_argument, 0, 0},
  {"startref",  required_argument, 0, 0},
  {0,0,0,0}
};

static char option_descr[][1024] = {
  "verbose",
  "help",
  "input",
  "refstream",
  "tag",
  "tilepath",
  "build",
  "chrom",
  "startstep",
  "startref",
};


void show_help(void)
{
  int i, j, k;
  int len;

  printf("\na2fj: ...\n");
  printf("Version %s\n", A2FJ_VERSION);

  for (i=0; long_option[i].name; i++)
  {
    len = strlen(long_option[i].name);

    if (long_option[i].flag != 0) {
      printf("  --%s", long_option[i].name);
      len -= 4;
    } else if (long_option[i].val>0) {
      printf("  -%c, --%s", long_option[i].val, long_option[i].name);
    } else {
      printf("  --%s", long_option[i].name);
    }

    if (long_option[i].has_arg)
    {
      printf(" %s", long_option[i].name);
      if (long_option[i].val>0) {
        len = 2*len + 3;
      } else {
        len = 2*len -1;
      }
    }
    else
    {
      len = len + 2;
    }
    for (j=0; j<(32-len); j++) printf(" ");

    printf("%s\n", option_descr[i]);
  }
  printf("\n");

}


int main(int argc, char **argv) {
  //char seq_fn[] = "data/seq";
  //char ref_fn[] = "data/ref";
  //char tag_fn[] = "data/tag";
  char *seq_fn=NULL;
  char *ref_fn=NULL;
  char *tag_fn=NULL;
  FILE *ref_fp, *tag_fp, *seq_fp;

  std::string build, build_chrom;

  std::string tag, ref, seq;
  std::map<std::string, tag_info_t> tag_pos;
  std::map<std::string, tag_info_t>::iterator map_it;

  //int path = 0x35e;
  int path = 0;
  int start_step = 0;
  int start_ref = 0;

  char ch;
  int option_index;

  while ((ch=getopt_long(argc, argv, "i:r:T:h", long_option, &option_index))>=0) switch (ch) {
    case 0:
      if (long_option[option_index].flag != 0) break;
      if (strncmp(long_option[option_index].name, "tilepath", strlen("tilepath"))==0) {
        path = atoi(optarg);
      }
      else if (strncmp(long_option[option_index].name, "build", strlen("build"))==0) {
        build = optarg;
      }
      else if (strncmp(long_option[option_index].name, "chrom", strlen("chrom"))==0) {
        build_chrom = optarg;
      }
      else if (strncmp(long_option[option_index].name, "startstep", strlen("startstep"))==0) {
        start_step = atoi(optarg);
      }
      else if (strncmp(long_option[option_index].name, "startref", strlen("startref"))==0) {
        start_ref = atoi(optarg);
      }

      break;
    case 'i':
      seq_fn = strdup(optarg);
      break;
    case 'r':
      ref_fn = strdup(optarg);
      break;
    case 'T':
      tag_fn = strdup(optarg);
      break;
    case 'h':
    default:
      show_help();
      exit(0);
      break;
  }

  if ((!seq_fn) || (!ref_fn) || (!tag_fn)) {
    show_help();
    exit(1);
  }

  if ((seq_fp = fopen(seq_fn, "r"))==NULL) {
    perror(seq_fn);
    exit(1);
  }

  if ((ref_fp = fopen(ref_fn, "r"))==NULL) {
    perror(ref_fn);
    exit(1);
  }

  if ((tag_fp = fopen(tag_fn, "r"))==NULL) {
    perror(tag_fn);
    exit(1);
  }

  free(seq_fn);
  free(ref_fn);
  free(tag_fn);

  read_seq(tag_fp, tag);
  read_seq(ref_fp, ref);
  read_seq(seq_fp, seq);

  construct_tag_map(tag_pos, tag, ref);

  //build = "hg19";
  //build_chrom = "MT";

  fastj_align(path, 0, 2, start_step, start_ref, build, build_chrom, seq, ref, tag_pos);

  fclose(seq_fp);
  fclose(ref_fp);
  fclose(tag_fp);

}
