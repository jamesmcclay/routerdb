from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import boto3
import awsgi
import os
from uuid import uuid4

app = Flask(__name__)
api = Api(app)

DB_ENDPOINT=os.environ.get('DYNAMO_ENDPOINT', 'http://localhost:8001')
DB_TABLE=os.environ.get('DYNAMO_TABLE', 'routers')

dynamodb = boto3.resource('dynamodb', 'ap-northeast-1', endpoint_url=DB_ENDPOINT)
ROUTERS = dynamodb.Table(DB_TABLE)

def validate(item,string='Item'):
    item = item.get(string)
    if item == None:
        abort(404, message=f"Not found.")
    return item

def get_content(args,id=None):
        myid = id if id else str(uuid4())
        if id == None: 
            return {'id': myid, 'title': args.get('title',''), 'description': args.get('description','')}
        content = {'id': myid}
        title = args.get('title')
        description = args.get('description')
        if title: content.update({'title': title})
        if description: content.update({'description': description})
        return content
    

parser = reqparse.RequestParser()
parser.add_argument('title')
parser.add_argument('description')

class Router(Resource):
    def get(self, id):
        result = ROUTERS.get_item(Key={'id': id})
        item = validate(result)
        return item

    def delete(self, id):
        result = ROUTERS.delete_item(Key={'id': id}, ReturnValues='ALL_OLD')
        item = validate(result, string='Attributes')
        return item, 204

    def put(self, id):
        args = parser.parse_args()
        item = get_content(args,id)
        result = ROUTERS.put_item(Item=item, ReturnValues='ALL_OLD')
        item = validate(result, string='Attributes')
        return item, 201

class RouterList(Resource):
    def get(self):
        result = ROUTERS.scan()
        items = validate(result,string='Items')
        return items, 200

    def post(self):
        args = parser.parse_args()
        item = get_content(args)
        result = ROUTERS.put_item(Item=item)
        return item, 201

api.add_resource(RouterList, '/api/routers/')
api.add_resource(Router, '/api/routers/<id>/')

def lambda_handler(event, context):
    return awsgi.response(app, event, context)


if __name__ == '__main__':
    app.run(debug=True,port=8000)