from flask import Flask
from flask_restful import reqparse, abort, Api, Resource
import boto3
import serverless_wsgi
import os
from uuid import uuid4
from pathlib import Path
from werkzeug.exceptions import HTTPException
import traceback
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, send_wildcard=True, methods= ['GET', 'HEAD', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'])
api = Api(app)

ENVIRONMENT = os.environ.get('ENVIRONMENT','local')
DB_ENDPOINT=os.environ.get('DYNAMO', 'local')
DB_TABLE=os.environ.get('DYNAMO_TABLE', 'routers')

if ENVIRONMENT == 'local':
    from dotenv import load_dotenv
    dotenv_path = Path(__file__).parent.parent / 'keys' / 'aws'
    load_dotenv(dotenv_path=dotenv_path)

if DB_ENDPOINT == 'aws':
    DB_ENDPOINT='https://dynamodb.ap-northeast-1.amazonaws.com'
else:
    DB_ENDPOINT='http://localhost:8001'

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

@app.errorhandler(HTTPException)
def handle_exception(e):
    """Return JSON instead of HTML for HTTP errors."""
    # start with the correct headers and status code from the error
    response = e.get_response()
    # replace the body with JSON
    error = {
        "success": False,
        "message": "Server error.",
        "code": e.code,
        "name": e.name,
        "description": e.description,
    }
    #if ENVIRONMENT == '':
    error['traceback'] = traceback.format_exc()
    response.data = json.dumps(error)
    response.content_type = "application/json"
    return response

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
    response = serverless_wsgi.handle_request(app, event, context)
    print(response)
    return response


if __name__ == '__main__':
    app.run(debug=True,port=8000)