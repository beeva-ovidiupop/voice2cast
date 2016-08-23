#!/bin/bash
rm src.zip
echo 'Zipping folders for save function'
zip -r src.zip node_modules *.js
echo 'Zipped... uploading to AWS'
aws lambda update-function-code --function-name voice2castFunction --zip-file fileb://src.zip --profile innovacion-dev-developer --region us-east-1
