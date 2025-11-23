URL="http://localhost:3000/api/flowise"

INLINE_QUERY_PAYLOAD='{
  "inline_query": {
    "from": {
      "id": 12345,
      "is_bot": false,
      "first_name": "Test",
      "last_name": "User",
      "username": "testuser",
      "language_code": "en"
    },
    "query": "Какая сегодня погода?"
  }
}'

curl -X POST \
  -H "Content-Type: application/json" \
  -d "$INLINE_QUERY_PAYLOAD" \
  $URL