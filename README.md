# Portfolio Project: Router Database Application

## Project Overview

This repository contains a full-stack web application that combines Python and ReactJS to create a basic but full-featured interactive web experience. It is deployed using Terraform and Ansible using AWS services - EC2 for a server deployment, and Lambda, DynamoDB, and S3 for a serverless deployment.

### Features

- [ ] Ability to create, read, update and delete "Router" enities with title and description, saved in database.
- [ ] Two separate deployments to AWS EC2 (Python Django and Postgres),  or AWS S3 (React) and AWS Lambda (Python Flask)

## Technologies Used

- **Frontend**: ReactJS
- **Backend Server**: Python (Django)
- **Backend Serverless**: Python (Flask)
- **Database Server**: PostgreSQL
- **Database Serverless**: DynamoDB (AWS)
- **Deployment Server**: Terraform, Ansible (Single EC2, AWS)
- **Deployment Serverless**: Terraform (Lambda/DynamoDB/S3, AWS)

## Project Structure

The project is organized into frontend, backend options (flask and django), and deployment option components (AWS server or serverless).

```bash
#Project Root
├── Pipfile
├── deploy_aws_terraform_lambda
│   ├── deploy.sh
│   └── terraform
│       ├── main.tf
├── deploy_aws_terraform_singleserver
│   ├── ansible
│   │   ├── ansible.cfg
│   │   ├── deploy.yml
│   │   └── templates
│   ├── deploy.sh
│   └── terraform
│       ├── main.tf
├── frontend_react_vite
│   ├── src
│   │   ├── App.jsx
├── routerdb_django
│   ├── manage.py
│   ├── pages
│   │   ├── urls.py
│   │   └── views.py
│   ├── requirements.txt
│   └── routerdb_django
├── routerdb_flask
│   ├── api.py
│   └── requirements.txt
```

## Getting Started

To deploy this project to your AWS account:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jamesmcclay/routerdb.git
   ```
2. **Export AWS secret variables**
   ```bash
   export AWS_ACCESS_KEY_ID=asuperawesomekeyid
   export AWS_SECRET_ACCESS_KEY=asupersecretkeysecret
   ```
   
4. **Choose a deployment and deploy**
   
   For EC2 server deployment:
   ```bash
   cd routerdb/deploy_aws_terraform_singleserver
   export SSH_KEY=anawesomeawssshkeyname
   ./deploy.sh
   ```
   > :warning: **Ansible requires SSH access to the deployed EC2**: Make sure to export `SSH_KEY` environment variable and that key is used by your SSH client and uploaded to AWS!

   For serverless deployment to lambda/DynamoDB:
   ```bash
   cd routerdb/deploy_aws_terraform_lambda
   ./deploy.sh
   ```
5. **Access react URL**
   Once finished, the `deploy.sh` script will print out a URL to access the project, click it. Enjoy!

