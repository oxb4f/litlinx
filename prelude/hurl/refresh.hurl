POST {{API_BASE}}/accesses
Content-Type: application/json
{
    "login": "03{{rn}}{{rs}}login1",
    "password": "03{{rn}}{{rs}}pass1",
    "jwtPayload": {}
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "03{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString
[Captures]
refreshToken: jsonpath "$.refreshToken"
accessId: jsonpath "$.id"

POST {{API_BASE}}/accesses/{{accessId}}/refresh
Content-Type: application/json
{
    "refreshToken": "{{refreshToken}}"
}

HTTP 200
[Asserts]
jsonpath "$.id" isInteger
jsonpath "$.login" == "03{{rn}}{{rs}}login1"
jsonpath "$.refreshToken" isString
jsonpath "$.jwtAccess" isString

POST {{API_BASE}}/accesses/{{accessId}}/refresh
Content-Type: application/json
{
    "refreshToken": "{{refreshToken}}"
}

HTTP 422
