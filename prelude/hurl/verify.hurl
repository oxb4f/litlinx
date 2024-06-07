POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "04{{rn}}{{rs}}login1",
    "password": "04{{rn}}{{rs}}pass1",
    "jwtPayload": {}
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "04{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
[Captures]
jwtAccess: jsonpath "$.jwtAccess"

POST {{API_BASE}}/accesses/verify
Content-Type: application/json
{
    "jwtAccess": "{{jwtAccess}}"
}

HTTP 200
