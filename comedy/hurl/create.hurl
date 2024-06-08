POST {{API_BASE}}/api/users
Content-Type: application/json
{
    "username": "01{{rn}}{{rs}}username1",
    "password": "01{{rn}}{{rs}}pass1",
    "name": "Test name",
    "birthday": "2024-02-23"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.username" == "01{{rn}}{{rs}}username1"
jsonpath "$.jwtAccess" isString
jsonpath "$.refreshToken" isString
jsonpath "$.name" isString
jsonpath "$.birthday" exists
