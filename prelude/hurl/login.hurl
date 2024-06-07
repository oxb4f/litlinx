POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "02{{rn}}{{rs}}login1",
    "password": "02{{rn}}{{rs}}pass1",
    "jwtPayload": {}
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "02{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString

POST {{API_BASE}}/accesses/login
Content-Type: application/json
{
    "login": "02{{rn}}{{rs}}login1",
    "password": "02{{rn}}{{rs}}pass1"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "02{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
