to test locally, first locally authenticate with AWS with
```
$ export AWS_ACCESS_KEY_ID=<insert key ID>
$ export AWS_SECRET_ACCESS_KEY=<insert key>
```

then terraform commands:
```
# to deploy
$ terraform init
$ terraform validate
$ terraform plan
$ terraform apply

# to teardown
$ terraform plan -destroy
$ terraform destroy
```

can also consider trying
https://docs.aws.amazon.com/lambda/latest/dg/typescript-package.html
