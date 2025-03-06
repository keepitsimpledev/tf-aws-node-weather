#!/bin/bash

echo "BEGIN: build node artifacts"
pushd node-weather
npm run build
popd
echo "END: build node artifacts"
# echo "BEGIN: packaging lambda"
cp -r node_modules/ dist/src/
# mkdir ../tf-lambda/build
# cd dist/src/
# zip -rq ../../../tf-lambda/build/lambda_weather_function.zip *
# echo "END: packaging lambda"
# cd ../../../tf-lambda
# ls build/
echo "BEGIN: terraform deploy"
pushd tf-lambda
terraform init # is it appropriate to have this here?
terraform apply --auto-approve
popd
echo "END: terraform deploy"
