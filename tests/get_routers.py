import requests

#resp = requests.get('https://pxm4vszexuxk3oavlphcfwmbz40jtldl.lambda-url.ap-northeast-1.on.aws/api/routers')
resp = requests.get('https://bbgcql4s677vylr4svmsp3xf6u0wibjg.lambda-url.ap-northeast-1.on.aws/api/routers')

print(resp.text)