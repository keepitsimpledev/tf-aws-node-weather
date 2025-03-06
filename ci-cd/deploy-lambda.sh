#!/bin/bash

# TODO: check for AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
if [ -z ${AKI+x} ]; then echo "AKI is unset"; else echo "AKI is set to '$AKI'"; fi
if [ -z ${SAK+x} ]; then echo "SAK is unset"; else echo "SAK is set to '$SAK'"; fi

echo '$0:'
echo $0
echo '$1:'
echo $1
echo '$2:'
echo $2

if [ -z ${0+x} ]; then echo "0 is unset"; else echo "0 is set to '$0'"; fi
if [ -z ${1+x} ]; then echo "1 is unset"; else echo "1 is set to '$1'"; fi

# echo "BEGIN: build node artifacts"
# cd node-weather
# npm run build
# echo "END: build node artifacts"
# echo "BEGIN: packaging lambda"
# cp -r node_modules/ dist/src/
# cd dist/src/
# mkdir ../../../tf-lambda/build
# zip -r ../../../tf-lambda/build/lambda_weather_function.zip *
# echo "END: packaging lambda"
# cd ../../../tf-lambda
# ls build/
#        terraform apply --auto-approve
# TODO: figure out how to keep tf.state in AWS
