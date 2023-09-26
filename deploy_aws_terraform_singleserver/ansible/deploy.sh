#!/bin/bash
ansible-playbook -i 18.183.229.172, deploy.yml --extra-vars "ansible_user=ubuntu ansible_password=james" #--become-password-file=../../keys/sudo_password.txt
