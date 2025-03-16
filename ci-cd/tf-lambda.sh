#!/bin/bash

if [ "$1" != "apply" ] && [ "$1" != "destroy" ];
    then echo "expected param 'apply' or 'destroy' but got: '$1'" && exit 1;
fi

echo "BEGIN: build node artifacts"
pushd node-weather/
npm run build
cp -r node_modules/ dist/src/
popd
echo "END: build node artifacts"

echo "BEGIN: terraform $1"
pushd tf-lambda/
terraform init # is it appropriate to have this here?
terraform $1 --auto-approve
popd
echo "END: terraform $1"
