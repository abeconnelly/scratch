Commonly asked questions
=======================

What is SNP calling?
--------------------

https://www.biostars.org/p/944/

>SNP calling is a bit of a misnomer, as it implies finding "SNPs" in NGS data. Without information about population frequency or function, it is premature to call a single nucleotide change a "polymorphism". With that caveat in mind, "SNP calling" in the context of NGS data analysis might be defined as the process of finding bases in the NGS data that differ from the reference genome, typically including an associated confidence score or statistical evidence metric.


What are phased and unphased genotypes?
---------------------------------------

https://www.biostars.org/p/7846/

> A biallelic genotype comes from two chromosomes. Phased means I know not only the genotypes but which chromosome each genotype call came from.

And 'unphased' means which chromosome allele the variant falls on is unknown.


Forward And Reverse Strand Conventions?
---

https://www.biostars.org/p/3423/

> DNA is double-stranded. By convention, for a reference chromosome, one whole strand is designated the "forward strand" and the other the "reverse strand". This designation is arbitrary. Sometimes the terms "plus strand" and "minus strand" are used instead.
> Visually (I'm not talking about the transcription machinery yet), you would typically read the sequence of a strand in the 5-3 direction. For the forward strand, this means reading left-to-right, and for the reverse strand it means right-to-left.
> A gene can live on a DNA strand in one of two orientations. The gene is said to have a coding strand (also known as its sense strand), and a template strand (also known as its antisense strand). For 50% of genes, its coding strand will correspond to the chromosome's forward strand, and for the other 50% it will correspond to the reverse strand.
> The mRNA (and protein) sequence of a gene corresponds to the DNA sequence as read (again, visually) from the gene's coding strand. So the mRNA sequence always corresponds to the 5-3 coding sequence of a gene.
> Now, the RNA polymerase machinery moves along the DNA in the 5-3 orientation of the coding strand (e.g. left-to-right for a forward strand gene). It reads the bases from the template strand (so it is reading in the 3-5 direction from the point-of-view of the template strand), and builds the mRNA as it goes. This means that the mRNA matches the coding sequence of the gene, not the template sequence. (This diagram from Wikipedia illustrates).


Snp, Dip, Snv Notation
---

https://www.biostars.org/p/9397/ -> http://www.politigenomics.com/2009/07/snp-vs-snp.html

> SNP (single nucleotide polymorphism) vs. SNV (single nucleotide variant) As their name suggests, both are concerned with aberrations at a single nucleotide. However, a SNP is when an aberration is expected at the position for any member in the species – for example, a well characterized allele. A SNV on the other hand is when there is a variation at a position that hasn’t been well characterized – for example, when it is only seen in one individual. It is really all a question of frequency of occurrence.




Workflow or tutorial for SNP calling?
------------------------------------

https://www.biostars.org/p/8237/

> BWA using defaults it's probably OK.
  If you have a SAI file from the previous step, you need to convert it to SAM or BAM. Do something like (assuming your reference genome is hg37.fasta)
  bwa samse hg37.fasta s.sai s.fastq > s.sam
  Then, Create BAM file (we assume you installed SamTools)
  samtools view -S -b s.sam > s.bam
  Sort BAM file (will create s_sort.bam)
  samtools sort s.bam s_sort
  Call variants: I.e. Create VCF file (BcfTools is part of samtools distribution)
  samtools mpileup -uf hg37.fasta s_sort.bam | bcftools view -vcg - > s.vcf
  There is a lot more (like local realignment, etc.). But if this is your first time doing it, you should start with the basics.


See also "What Methods Do You Use For In/Del/Snp Calling?" https://www.biostars.org/p/613/


What is the difference between sequencing depth and coverage?
---

https://www.biostars.org/p/6571/

> There is no (well defined) difference, see here http://biostar.stackexchange.com/questions/638/what-is-the-sequencing-depth. My impression is that they are often used synonymously.


Synonymous And Non-Synonymous Snps?
---

https://www.biostars.org/p/4827/

> To be a synonymous or a non-synonymous SNP, the SNP must fall inside a protein-coding region of the DNA (otherwise it is a noncoding SNP). A synonymous SNP is a coding SNP that does not change the protein sequence.


What Are The Most Common Stupid Mistakes In Bioinformatics?
---

https://www.biostars.org/p/7126/



> Bed is 0 based
> GFF/GTF are 1-based
> Python and nearly every other modern language are 0-based indexing
> R is 1-based (as is Lua)





File formats and conversions
====

Converting Bam To Fastq
---

https://www.biostars.org/p/770/

> se SamToFastq : http://picard.sourceforge.net/command-line-overview.shtml#SamToFastq


Convert BAM file to FASTA file
---

https://www.biostars.org/p/6970/

```python
import os
import sys

import pysam
from Bio import SeqIO, Seq, SeqRecord

def main(in_file):
    out_file = "%s.fa" % os.path.splitext(in_file)[0]
    with open(out_file, "w") as out_handle:
        # Write records from the BAM file one at a time to the output file.
        # Works lazily as BAM sequences are read so will handle large files.
        SeqIO.write(bam_to_rec(in_file), out_handle, "fasta")

def bam_to_rec(in_file):
    """Generator to convert BAM files into Biopython SeqRecords.
    """
    bam_file = pysam.Samfile(in_file, "rb")
    for read in bam_file:
        seq = Seq.Seq(read.seq)
        if read.is_reverse:
            seq = seq.reverse_complement()
        rec = SeqRecord.SeqRecord(seq, read.qname, "", "")
        yield rec

if __name__ == "__main__":
    main(*sys.argv[1:])
```

```bash
% python bam_to_fasta.py your_file.bam
```


What is a FAI file?
---

https://www.biostars.org/p/1495/

> that is an index of your fasta file

```
samtools faidx some.fasta
```


Where Can I Download Human Reference Genome In Fasta Format? Hgref.Fa File
----

https://www.biostars.org/p/1796/

> http://hgdownload.cse.ucsc.edu/goldenPath/hg19/chromosomes


How can I convert BAM to SAM?
---

https://www.biostars.org/p/1701/

> $ samtools view -h -o out.sam in.bam

Bam And Indexed Bam Files
----

https://www.biostars.org/p/15847/

> A bai file isn't an indexed form of a bam - it's a companion to your bam that contains the index. 



Is My Bam File Sorted ?
---

https://www.biostars.org/p/5256/

> http://plindenbaum.blogspot.com/2011/02/testing-if-bam-file-is-sorted-using.html


Fastq Convert To Fasta
---

https://www.biostars.org/p/85929/

```
gunzip -c file.fq.gz | awk '{if(NR%4==1) {printf(">%s\n",substr($0,2));} else if(NR%4==2) print;}' > file.fa
```

```
seqtk seq -a in.fastq.gz > out.fasta
```

> http://hannonlab.cshl.edu/fastx_toolkit/commandline.html#fastq_to_fasta_usage







Bioinformatics tools
=======

Best Way For A Beginner To Get Up To Speed On Unix Quickly?
---

https://www.biostars.org/p/16315/

> http://bioinformatics.unc.edu/support/unix.htm


GNU Parallel
---

https://www.biostars.org/p/63816/

> http://www.gnu.org/software/parallel/


What Is The Difference Between Samtools Mpileup And Pileup?
---

https://www.biostars.org/p/6259/

> For single-sample SNP calling, they differ little. Pileup uses BAQ by default, too. The major difference comes from indel calling. Mpileup implements a more advanced method. For indel calling, do not use pileup any more.



Is Tophat The Only Mapper To Consider For Rna-Seq Data?
---

https://www.biostars.org/p/60478/

>  ... bwa/bwa-sw is NOT aware of splicing. If you want to perform typical RNA-seq analysis, bwa/bwa-sw is not the right choice.
> In addition to tophat, there are several other RNA-seq mappers that are supposed to have the same functionality as tophat. SOAP-splice, STAR and gsnap are among them and there are more. Some of them are claimed to be better than tophat, but I do not really know what is the best. Evaluating the performance of splice mapping on real data is very difficult.


How Can I Merge A Large Amount Of Vcf Files?
---

https://www.biostars.org/p/49730/

```
vcf-merge $(ls -1 *.vcf | perl -pe 's/\n/ /g') >merge.vcf
```




MISC
====


Cheat Sheet For One-Based Vs Zero-Based Coordinate Systems
---

https://www.biostars.org/p/84686/


Common software
--------

  - GATK
  - Platypus
  - HaploytypeCaller
  - FreeBayes
  - samtools
  
