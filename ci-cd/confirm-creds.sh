#!/bin/bash

if [ -z ${1+x} ];
  then
    echo "AKI is unset";
    SUCCESS=false;
  else
    echo "AKI is set";
    SUCCESS=true;
fi

if [ -z ${2+x} ];
  then
    echo "SAK is unset";
    SUCCESS=false;
  else
    echo "SAK is set";
    SUCCESS=true;
fi

if [ $SUCCESS = false ];
  then
    echo "missing a required secret - exiting";
    exit 1;
fi
