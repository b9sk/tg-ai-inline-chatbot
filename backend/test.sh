#!/bin/bash

# Замените <YOUR_REMOTE_HOST_URL> на URL вашего развернутого обработчика
URL="https://tg-ai-inline-bot.vercel.app/api/flowise" # Замените <YOUR_VERCEL_DEPLOYMENT_URL> на URL вашего развернутого обработчика

if [ "$URL" == "https://<YOUR_VERCEL_DEPLOYMENT_URL>/api/flowise" ]; then
  echo "Пожалуйста, отредактируйте файл test.sh и замените <YOUR_VERCEL_DEPLOYMENT_URL> на ваш реальный URL."
  exit 1
fi

test_inline_query() {
  echo "--- Тестирование с inline_query ---"

  # Тестовые данные для inline_query
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

  # Отправка запроса с inline_query и вывод ответа
  echo "Отправка запроса:"
  echo "$INLINE_QUERY_PAYLOAD"
  echo "Ответ сервера:"
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "$INLINE_QUERY_PAYLOAD" \
    $URL

  echo -e "\n"
}

test_message() {
  echo -e "\n\n--- Тестирование с message ---"

  # Тестовые данные для message
  MESSAGE_PAYLOAD='{
    "message": {
      "from": {
        "id": 54321,
        "is_bot": false,
        "first_name": "Another",
        "last_name": "User",
        "username": "anotheruser",
        "language_code": "ru"
      },
      "text": "Какой сегодня день?"
    }
  }'

  # Отправка запроса с message и вывод ответа
  echo "Отправка запроса:"
  echo "$MESSAGE_PAYLOAD"
  echo "Ответ сервера:"
  curl -X POST \
    -H "Content-Type: application/json" \
    -d "$MESSAGE_PAYLOAD" \
    $URL

  echo -e "\n"
}

case "$1" in
  inline_query)
    test_inline_query
    ;;
  message)
    test_message
    ;;
  all)
    test_inline_query
    test_message
    ;;
  *)
    echo "Неверный аргумент. Используйте один из следующих:"
    echo "  inline_query - для тестирования обработки inline-запросов"
    echo "  message      - для тестирования обработки обычных сообщений"
    echo "  all          - для запуска обоих тестов"
    exit 1
    ;;
esac
