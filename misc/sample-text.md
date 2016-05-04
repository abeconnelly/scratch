## I'm unable to download a VCF/BAM/GFF/etc. file in my browser, what do I do?

Downloading large files from the browser sometimes has problems and third party tools can be used to download these large files.

### Windows and Mac Users

One alternative is to use install tool called [Free Download Manager](http://www.freedownloadmanager.org/download.htm).
Follow the instructions on how to download the appropriate file for your operating system and
install the software.  When Free Download Manager is installed, provide it with download link of the file you're trying
to download.

### Linux Users

If you're comfortable with the shell, you can use either `wget` or `curl` to download.
For example, if you wanted to download `https://my.pgp-hms.org/user_file/download/41` the following commands would work:

```
wget 'https://my.pgp-hms.org/user_file/download/41' -O hu43860C-23andMe.txt.gz
```

or

```
curl  'https://my.pgp-hms.org/user_file/download/41' -o hu43860C-23andMe.txt.gz
```
