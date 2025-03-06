#!/bin/bash

echo "BEGIN: build node artifacts"
cd node-weather
npm run build
echo "END: build node artifacts"
echo "BEGIN: packaging lambda"
cp -r node_modules/ dist/src/
mkdir ../tf-lambda/build
cd dist/src/
zip -rq ../../../tf-lambda/build/lambda_weather_function.zip *
echo "END: packaging lambda"
cd ../../../tf-lambda
ls build/
terraform init # is it appropriate to have this here?
terraform apply --auto-approve
