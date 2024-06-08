POST {{API_BASE}}/api/users
Content-Type: application/json
{
    "username": "04{{rn}}{{rs}}username1",
    "password": "04{{rn}}{{rs}}pass1",
    "name": "Test name",
    "birthday": "2024-02-23"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "04{{rn}}{{rs}}username1"
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
jsonpath "$.name" isString
jsonpath "$.birthday" exists
[Captures]
jwt: jsonpath "$.jwtAccess"
refreshToken: jsonpath "$.refreshToken"
userId: jsonpath "$.id"

POST {{API_BASE}}/api/users/refresh
Authorization: Bearer {{jwt}}
Content-Type: application/json
{
    "refreshToken": "{{refreshToken}}"
}

HTTP 200
[Asserts]
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
[Captures]
jwt1: jsonpath "$.jwtAccess"
refreshToken1: jsonpath "$.refreshToken"

PATCH {{API_BASE}}/api/users/{{userId}}
Authorization: Bearer {{jwt1}}
Content-Type: application/json
{
    "name": "Test"
}

HTTP 200
