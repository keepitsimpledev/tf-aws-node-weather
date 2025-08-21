#!/bin/bash
set -e # https://linuxconfig.org/bash-script-error-handling-try-catch-in-bash

echo "BEGIN: terraform destory"
mkdir -p node-weather/dist/src/ # dummy directory to appease terraform
touch node-weather/dist/src/fillerfile
pushd tf-lambda/
terraform init
terraform destroy --auto-approve
popd
echo "END: terraform destory"
