#!/bin/bash

echo "BEGIN: build node artifacts"
cd node-weather
npm run build
echo "END: build node artifacts"
echo "BEGIN: packaging lambda"
cp -r node_modules/ dist/src/
mkdir ../tf-lambda/build
cd dist/src/
zip -r ../../../tf-lambda/build/lambda_weather_function.zip *
echo "END: packaging lambda"
cd ../../../tf-lambda
ls build/
terraform init
terraform apply --auto-approve
