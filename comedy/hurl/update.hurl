POST {{API_BASE}}/api/users
Content-Type: application/json
{
    "username": "03{{rn}}{{rs}}username1",
    "password": "03{{rn}}{{rs}}pass1",
    "name": "Test name",
    "birthday": "2024-02-23"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "03{{rn}}{{rs}}username1"
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
jsonpath "$.name" isString
jsonpath "$.birthday" exists
[Captures]
jwt: jsonpath "$.jwtAccess"
userId: jsonpath "$.id"

PATCH {{API_BASE}}/api/users/{{userId}}
Authorization: Bearer {{jwt}}
Content-Type: application/json
{
    "username": "03{{rn}}{{rs}}username2",
    "name": "Test name 1",
    "birthday": "2024-02-22"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "03{{rn}}{{rs}}username2"
jsonpath "$.name" == "Test name 1"
jsonpath "$.birthday" contains "22"

PATCH {{API_BASE}}/api/users/{{userId}}
Authorization: Bearer {{jwt}}
Content-Type: application/json
{
    "name": "Test name 2"
}

HTTP 200
[Asserts]
jsonpath "$.name" == "Test name 2"

PATCH {{API_BASE}}/api/users/{{userId}}
Authorization: Bearer {{jwt}}
Content-Type: application/json
{
    "name": null
}

HTTP 422

PATCH {{API_BASE}}/api/users/{{userId}}
Content-Type: application/json
{
    "name": "Test"
}

HTTP 401
