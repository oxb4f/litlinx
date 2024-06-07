POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "01{{rn}}{{rs}}login1",
    "password": "01{{rn}}{{rs}}pass1",
    "jwtPayload": {}
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "01{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString

POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "01{{rn}}{{rs}}login2",
    "password": "01{{rn}}{{rs}}pass2",
    "jwtPayload": { "a": 1, "b": 2 }
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "01{{rn}}{{rs}}login2"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
