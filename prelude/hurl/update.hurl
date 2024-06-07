POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "05{{rn}}{{rs}}login1",
    "password": "05{{rn}}{{rs}}pass1",
    "jwtPayload": {}
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "05{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
[Captures]
accessId: jsonpath "$.id"

POST {{API_BASE}}/accesses/{{accessId}}
Content-Type: application/json
{
    "login": "05{{rn}}{{rs}}login2",
    "password": "05{{rn}}{{rs}}pass2"
}

HTTP 200
[Asserts]
jsonpath "$.login" == "05{{rn}}{{rs}}login2"

POST {{API_BASE}}/accesses/login
Content-Type: application/json
{
    "login": "05{{rn}}{{rs}}login2",
    "password": "05{{rn}}{{rs}}pass2"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "05{{rn}}{{rs}}login2"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
