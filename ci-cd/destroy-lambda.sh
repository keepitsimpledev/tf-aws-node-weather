#!/bin/bash

echo "BEGIN: terraform destory"
mkdir node-weather/dist/src/ # dummy directory to appease terraform
pushd tf-lambda/
terraform init
terraform destory --auto-approve
popd
echo "END: terraform destory"
