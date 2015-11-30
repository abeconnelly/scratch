package main

/*

  This is a sample template for a command line Go(lang) application.
  In keeping with the "Small Tools Manifesto for Bioinformatics"
  (https://github.com/pjotrp/bioinformatics), this template is
  an attempt to address at least some of those points.

  This is mostly just an experimentation and not meant
  to be anything profound, just a laundry list of
  practical 'best practices' for small command
  line Go programs.

  Some 'features' it has are:

    - nice help by default (courtesy of codegangsta/cli)
    - input from stdin or file (uncompressed, gz or bz2)
    - output to stdout or file (uncompressed only)
    - command line options for performance monitoring
    - command line options for concurrency

*/

import "fmt"
import "os"
import "runtime"
import "runtime/pprof"

import "github.com/abeconnelly/autoio"
import "github.com/codegangsta/cli"

var AUTHOR_STR string = "{{AUTHOR_STR}}"
var EMAIL_STR string = "{{EMAIL_STR}}"

var APP_NAME_STR string = "{{APP_NAME_STR}}"
var APP_DESCRIPTION_STR string = "{{APP_DESCRIPTION_STR}}"

var VERSION_STR string = "{{VERSION_STR}}"
var gVerboseFlag bool

var gProfileFlag bool
var gProfileFile string = APP_NAME_STR + ".pprof"

var gMemProfileFlag bool
var gMemProfileFile string = APP_NAME_STR + ".mprof"


func _main( c *cli.Context ) {

  if c.String("input") == "" {
    fmt.Fprintf( os.Stderr, "Input required, exiting\n" )
    cli.ShowAppHelp( c )
    os.Exit(1)
  }

  ain,err := autoio.OpenScanner( c.String("input") ) ; _ = ain
  if err!=nil {
    fmt.Fprintf(os.Stderr, "%v", err)
    os.Exit(1)
  }
  defer ain.Close()


  aout,err := autoio.CreateWriter( c.String("output") ) ; _ = aout
  if err!=nil {
    fmt.Fprintf(os.Stderr, "%v", err)
    os.Exit(1)
  }
  defer func() { aout.Flush() ; aout.Close() }()

  if c.Bool( "pprof" ) {
    gProfileFlag = true
    gProfileFile = c.String("pprof-file")
  }

  if c.Bool( "mprof" ) {
    gMemProfileFlag = true
    gMemProfileFile = c.String("mprof-file")
  }

  gVerboseFlag = c.Bool("Verbose")

  if c.Int("max-procs") > 0 {
    runtime.GOMAXPROCS( c.Int("max-procs") )
  }

  if gProfileFlag {
    prof_f,err := os.Create( gProfileFile )
    if err != nil {
      fmt.Fprintf( os.Stderr, "Could not open profile file %s: %v\n", gProfileFile, err )
      os.Exit(2)
    }

    pprof.StartCPUProfile( prof_f )
    defer pprof.StopCPUProfile()
  }

}

func main() {

  app := cli.NewApp()
  app.Name  = APP_NAME_STR
  app.Usage = APP_DESCRIPTION_STR
  app.Version = VERSION_STR
  app.Author = AUTHOR_STR
  app.Email = EMAIL_STR
  app.Action = func( c *cli.Context ) { _main(c) }

  app.Flags = []cli.Flag{
    cli.StringFlag{
      Name: "input, i",
      Usage: "INPUT",
    },

    cli.StringFlag{
      Name: "output, o",
      Value: "-",
      Usage: "OUTPUT",
    },

    cli.IntFlag{
      Name: "max-procs, N",
      Value: -1,
      Usage: "MAXPROCS",
    },

    cli.BoolFlag{
      Name: "Verbose, V",
      Usage: "Verbose flag",
    },

    cli.BoolFlag{
      Name: "pprof",
      Usage: "Profile usage",
    },

    cli.StringFlag{
      Name: "pprof-file",
      Value: gProfileFile,
      Usage: "Profile File",
    },

    cli.BoolFlag{
      Name: "mprof",
      Usage: "Profile memory usage",
    },

    cli.StringFlag{
      Name: "mprof-file",
      Value: gMemProfileFile,
      Usage: "Profile Memory File",
    },

  }

  app.Run( os.Args )

  if gMemProfileFlag {
    fmem,err := os.Create( gMemProfileFile )
    if err!=nil { panic(fmem) }
    pprof.WriteHeapProfile(fmem)
    fmem.Close()
  }

}
