#!/bin/bash
if [ -z ${0+x} ]; then echo "0 is unset"; else echo "0 is set to '$0'"; fi
if [ -z ${1+x} ]; then echo "1 is unset"; else echo "1 is set to '$1'"; fi
if [ -z ${2+x} ]; then echo "2 is unset"; else echo "2 is set to '$2'"; fi
