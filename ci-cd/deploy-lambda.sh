#!/bin/bash

echo "BEGIN: build node artifacts"
pushd node-weather/
npm run build
cp -r node_modules/ dist/src/
popd
echo "END: build node artifacts"

echo "BEGIN: terraform deploy"
pushd tf-lambda/
terraform init # is it appropriate to have this here?
terraform apply --auto-approve
popd
echo "END: terraform deploy"
