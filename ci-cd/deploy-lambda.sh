#!/bin/bash

echo "BEGIN: build node artifacts"
cd node-weather
npm run build
echo "END: build node artifacts"
echo "BEGIN: packaging lambda"
cp -r node_modules/ dist/src/
cd dist/src/
mkdir ../../../tf-lambda/build
zip -r ../../../tf-lambda/build/lambda_weather_function.zip *
echo "END: packaging lambda"
cd ../../../tf-lambda
ls build/
#        terraform apply --auto-approve
# TODO: figure out how to keep tf.state in AWS
