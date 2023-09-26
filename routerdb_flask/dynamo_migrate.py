import boto3
from api import DB_ENDPOINT, DB_TABLE

def create_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource('dynamodb', 'ap-northeast-1', endpoint_url=DB_ENDPOINT)

    table = dynamodb.Table(DB_TABLE)
    try:
        table.table_status
        print(f"Table exists: {table.table_status}")
        return table
    except:
        pass

    table = dynamodb.create_table(
        TableName=DB_TABLE,
        AttributeDefinitions=[
            {
            "AttributeName": "id",
            "AttributeType": "S"
            },
        ],
        KeySchema=[
            {
            "AttributeName": "id",
            "KeyType": "HASH"
            },
        ],
        BillingMode='PAY_PER_REQUEST'
    )
    return table


if __name__ == '__main__':
    my_table = create_table()
    my_table.meta.client.get_waiter('table_exists').wait(TableName=DB_TABLE)
    print("Table status:", my_table.table_status)
    print(my_table.item_count)