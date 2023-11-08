#!/bin/bash
cd terraform
terraform apply -auto-approve
SERVER_IP="$(terraform show | grep 'public_ip ' | awk -F '=' '{print $2}' | sed 's/"//g' | sed 's/[[:space:]]*//g' | awk '{ printf "%s", $0 }')"
echo "VITE_API_URI=http://$SERVER_IP" > ../../frontend_react_vite/.env.production
cd ../../frontend_react_vite
npm run build
cd ../deploy_aws_terraform_singleserver/ansible
until ssh -o StrictHostKeyChecking=no -q ubuntu@$SERVER_IP exit; do
    sleep 5
done
ansible-playbook -i $SERVER_IP, deploy.yml --extra-vars "ansible_user=ubuntu" #--become-password-file=../../keys/sudo_password.txt

echo "Server available at http://$SERVER_IP"
