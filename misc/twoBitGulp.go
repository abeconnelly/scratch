package main

/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero Public License for more details.

    You should have received a copy of the GNU Affero Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/*
    "Gulps" whole 2bit sequence (as string) into memory.
    Mostly a wrapper for aebruno/twobit
*/

import "fmt"
import "os"
import "io/ioutil"
import "log"
import "bytes"

import "runtime"
import "runtime/pprof"

import "github.com/abeconnelly/autoio"
import "github.com/codegangsta/cli"

import "github.com/aebruno/twobit"

const COLS = 50

var VERSION_STR string = "0.1.0"
var gVerboseFlag bool

var gProfileFlag bool
var gProfileFile string = "twoBitGulp.pprof"

var gMemProfileFlag bool
var gMemProfileFile string = "twoBitGulp.mprof"

var gHeaderFlag bool = true
var gFoldWidth int = COLS
var gTerseFlag bool = false

func _main(c *cli.Context) {


  aout,err := autoio.CreateWriter( c.String("output") ) ; _ = aout
  if err!=nil {
    fmt.Fprintf(os.Stderr, "%v", err)
    os.Exit(1)
  }
  defer func() { aout.Flush() ; aout.Close() }()

  gTerseFlag = c.Bool("terse")
  if c.Bool("no-header") { gHeaderFlag = false }
  gFoldWidth = c.Int("width")

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

  var dat []byte

  ifn := c.String("input")

  if len(ifn)==0 {
    stat, _ := os.Stdin.Stat()
    if (stat.Mode() & os.ModeCharDevice) != 0 {
      cli.ShowAppHelp(c)
      os.Exit(1)
    }
  }

  if (len(ifn)==0) || (ifn=="-") {
    dat,err = ioutil.ReadAll(os.Stdin)
    if err!=nil { log.Fatal(err)  }
  } else {
    dat,err = ioutil.ReadFile(ifn)
    if err!=nil { log.Fatal(err) }
  }

  dat_reader := bytes.NewReader(dat)
  twobit_reader,e := twobit.NewReader(dat_reader)
  if e!=nil {log.Fatal(e) }

  if c.String("name") == "" {

    for _,n := range twobit_reader.Names() {

      if gHeaderFlag {
        fmt.Fprintf(aout.Writer, ">%s\n", n)
      }

      seq,err := twobit_reader.Read(n)
      if err!=nil { log.Fatal(err) }

      l:=len(seq)

      if gFoldWidth <= 0 {
        fmt.Fprintf(aout.Writer, "%s\n", seq)
      } else {

        for r:=0; r<l; r+=gFoldWidth {
          en := r+gFoldWidth
          if en>l { en = l }
          fmt.Fprintf(aout.Writer, "%s\n", seq[r:en] )
        }

      }

      /*
      for r:=0; r<l; r+=COLS {
        en := r+COLS
        if en>l { en = l }
        fmt.Fprintf(aout.Writer, "%s\n", seq[r:en] )
      }
      */

      if !gTerseFlag {
        fmt.Fprintf(aout.Writer, "\n")
      }
    }

  } else {

    seq,err := twobit_reader.Read( c.String("name") )
    if err!=nil { return }

    if gHeaderFlag {
      fmt.Fprintf(aout.Writer, ">%s\n", c.String("name"))
    }

    l:=len(seq)

    if gFoldWidth <= 0 {
      fmt.Fprintf(aout.Writer, "%s", seq)

      if !gTerseFlag {
        fmt.Fprintf(aout.Writer, "\n")
      }
    } else {

      for r:=0; r<l; r+=gFoldWidth {
        en := r+gFoldWidth
        if en>l { en = l }
        fmt.Fprintf(aout.Writer, "%s\n", seq[r:en] )
      }

    }

    if !gTerseFlag {
      fmt.Fprintf(aout.Writer, "\n")
    }

  }

}

func main() {

  app := cli.NewApp()
  app.Name  = "twoBitGulp"
  app.Usage = "twoBitGulp"
  app.Version = VERSION_STR
  app.Author = "Curoverse, Inc."
  app.Email = "info@curoverse.com"
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

    cli.StringFlag{
      Name: "name, n",
      Value: "",
      Usage: "Two bit sequence name (defaults to all)",
    },

    cli.IntFlag{
      Name: "max-procs, N",
      Value: -1,
      Usage: "MAXPROCS",
    },

    cli.BoolFlag{
      Name: "no-header",
      Usage: "Do not print FASTA header",
    },

    cli.BoolFlag{
      Name: "terse",
      Usage: "Terse output",
    },

    cli.IntFlag{
      Name: "width, w",
      Value: COLS,
      Usage: "Width of output FASTA (default 50).  0 or below implies no folding\n",
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
