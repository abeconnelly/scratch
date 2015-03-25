Bioinformatics Best Practices
====

This is a short document trying to encapsulate some of the
best practices while writing command line tools for
bioinformatics applications.
The hope is to provide a clear consistent list
of practices that can be followed to create command
line tools in a clear and consistent way.

This is mostly for myself representing my own opinion
on how to write these tools.  This is an evolving
document as I learn more.


Common Pitfalls
---

### Stupid algorithms fail fast

The size of the data sometimes requires smart
algorithms up front.

### Multiple large data sets

Bioinformatic tools sits in the middle ground of
wanting to try to be as isolated and self contained
as possible but required multiple massive data sets
to operate on.

This puts bioinformatics tools somewhere in the middle
of programs like `mysqld` and `wc`.  One extreme
is to have a huge server that takes care of all the data,
has a DSL to access the data.  The other extreme is where
the tool can operate on one input stream line by line
without needing to save state or consider other sources of
input.


### Heterogenous data

Bioinformatics has many different files formats of varying
degrees of complexity.  Often times these file formats are
'data salad' and don't conform to common standards.


### Difficulty of reproducing build environment

Tools are brittle and break when transported to other systems.
Bit rot can also set in and tools will break with newer
operating system or newer data.

Driving Principles
---

The ["Small Tools Manifesto for Bioinformatics"](https://github.com/pjotrp/bioinformatics)
is a good starting place.

Here is my opinion on what the high level principles should be:

### Loose coupling between tools

Tools should be self contained and as independant from each other as possible.
Tools should be self describing.

### Data centric as opposed to code centric

Tools should produce data that is decoupled from the code that generated it.
Data should be able to be used by other tools as easily as possible.  Use standard
tools where possible.

The ultimate goal is to provide data in a transportable form.  The code should
be thought of as transformations on data.  Clean data structures used by bad code
will beat out bad data structures by good code.


Practical Advice
---

  - Run in userland.  Don't assume root access.
  - Don't assume internet access.
  - Running the tools with no options should print the help screen.
  - Printing the help screen should exit with an error code.
  - The `-h` option should print the help screen.
  - Provide a version number, preferably with the `-v` option.
  - Use stderr for errors.
  - Don't hard code paths.
  - Use a unique name for you CLI tool.
  - If you have a suite of tools, have a parent tool that calls other tools
    to perserve namespace.  For example `mytool list`, `mytool cp` etc.
  - Exit with a non-zero error code if something went wrong.
  - Accept pipes where possible.
  - Accept a config file with options and input file locations
    if command line length becomes too long.

This I'm not so sure about:

  - Favor human readable streaming input, preferably line based.  This has the disadvantage of becoming cumbersome at scale.
  - Use a small rolling window for input if need be.  This has the disadvantage of blowing up for badly behaving input.
  - Favor human readable streaming line by line output.  Sometimes making data streaming comes at too high of a cost.

Issues
---

### Multiple input streams, potentially with different formats and compressed.

I've been solving this by providing an 'autoio' tool that will automatically detect whether the input
file is compressed and provide the appropriate conversion.  I'm thinking this might be too much
load on the program and it might be better to assume the a text stream as input.  For example, intead
of:

```
mytool --input-0 input-file-0.gz --input-1 input-file-1.bz2
```

It might be better to do:

```
mytool --input-0 <( gzip -c input-file-0.gz ) --input-1 <( bunzip2 -c input-file-1.bz2 )
```

This offloads the work onto the tools specialized in decompressing.  Presumably the decompression
tool is better at decompression than some random library, can use the system resources as it sees
fit and reduces code complexity by assuming standard input.

Most of the time, data needs to be stored at run-time in some unpacked format, so this might be a
reasonable approach.


References
----

  - [Small Tools Manifesto for Bioinformatics](https://github.com/pjotrp/bioinformatics)
  - [Minimum Standards for Bioinformatics Command Line Tools](http://thegenomefactory.blogspot.com/2013/08/minimum-standards-for-bioinformatics.html)
  - [Quick Guide to Making Your Software Installable](https://biomickwatson.wordpress.com/2013/05/27/a-quick-guide-to-making-your-software-installable/)
  - [Biostars: Tutorial: Minimum Standards For Bioinformatics Command Line Tools](https://www.biostars.org/p/78785/)




