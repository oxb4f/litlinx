POST {{API_BASE}}/api/users
Content-Type: application/json
{
    "username": "02{{rn}}{{rs}}username1",
    "password": "02{{rn}}{{rs}}pass1",
    "name": "Test name",
    "birthday": "2024-02-23"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "02{{rn}}{{rs}}username1"
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
jsonpath "$.name" isString
jsonpath "$.birthday" exists

POST {{API_BASE}}/api/users/login
Content-Type: application/json
{
    "username": "02{{rn}}{{rs}}username1",
    "password": "02{{rn}}{{rs}}pass1"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "02{{rn}}{{rs}}username1"
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
jsonpath "$.name" isString
jsonpath "$.birthday" exists
