#!/bin/bash

echo "BEGIN: terraform destory"
mkdir -p node-weather/dist/src/ # dummy directory to appease terraform
pushd tf-lambda/
terraform init
terraform destroy --auto-approve
popd
echo "END: terraform destory"
