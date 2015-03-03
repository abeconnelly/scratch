#!/bin/bash
#

# If you would like to bail out if any command in this file fails, uncomment the following line
#set -e

# This is only needed if we want to use programs from the 'crunch_src' directory (including
# arv-dax) without specifying the full path.
#
export PATH=$PATH:$CRUNCH_SRC:$CRUNCH_SRC/crunch_scripts:$CRUNCH_SRC/crunch_scripts/bin:.

# Our necessary initial setup step.  By default, this will dump us into an 'output'
# directory with no files in it.
#
. <( arv-dax setup )

# The variable 'jobparam' will hold the JSON string of the parameters passed into this
# pipeline.
#
# For example, to get the varaible 'MyVariable' from the 'script_parameters' section,
# you could do something along the lines of:
#
# myvar=`echo "$jobparam" | jq -r .MyVariable`
#
jobparam=`arv-dax script_parameters`

# Task sequence '0' is the parent sequence.
# If we're the parent, carm out other child tasks and exit with success.
#
taskseq=`arv-dax task sequence`
if [ "$taskseq" == "0" ]
then

  for i in {1..2}
  do
    arv-dax task create '{ "my_task_variable" : "value '$i'" }'
  done

  arv-dax task finish
  exit 0
fi

# We can get task parameters (passed in from the above 'create' command)
# via the following:
#
taskparam=`arv-dax task parameters`

# '$taskparam' is just a JSON string of the passed in parameters to the task.
#
myvar=`echo "$taskparam" | jq -r '.my_task_variable'`
echo "test output of task $myvar" > output.txt

# 'finish' will upload all files in the current directry (currently only 'output.txt')
# into keep and pass a 'success' message to the Arvados API service to indicate
# task success.
#
arv-dax task finish
exit 0
