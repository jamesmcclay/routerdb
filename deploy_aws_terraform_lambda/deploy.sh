#!/bin/bash
cd terraform
terraform apply -auto-approve
FUNCTION_URL="$(terraform show | grep function_url | awk -F '=' '{print $2}' | sed 's/[[:space:]]*//g' | awk '{ printf "%s", $0 }')"
echo "VITE_API_URI=$FUNCTION_URL" > ../../frontend_react_vite/.env.production
S3_URL="$(terraform show | grep 'website_endpoint =' | awk -F '=' '{print $2}' | sed 's/"//g' | sed 's/[[:space:]]*//g' | awk '{ printf "%s", $0 }')"
cd ../../frontend_react_vite
npm run build
cd dist
aws s3 cp . s3://jamesmcclay-react-routerdb/ --recursive
echo "Site available at http://$S3_URL"