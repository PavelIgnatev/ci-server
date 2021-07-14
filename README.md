# ci-server

## Действия для запуска сервера

1. Клонировать репозиторий

   ```sh
   git clone https://github.com/PavelIgnatev/ci-server.git
   cd ci-server
   ```
   
2. Для запуска сервера:

   Переходим в дерикторию сервера:
   
   ```sh
   cd sever
   ```
   
   Вводим свой apiToken в файл  ```server-conf.json```

   Делаем сборку Docker-образа сервера:
   
   ```sh
   npm run build-docker-image
   ```
   
   Запускаем Docker-образ:
   
   ```sh
   npm start
   ```

3. Для запуска агента:

   Переходим в дерикторию агента:
   
   ```sh
   cd agent
   ```

   Делаем сборку Docker-образа агента:
   
   ```sh
   npm run build-docker-image
   ```
   
   Запускаем Docker-образ (введя данную команду агент запустится на порте 12345):
   
   ```sh
   npm start
   ```
   
## Действия для запуска Docker-образов сервера и агента вручную
 
1. Для сервера (приватный порт 8080 менять запрещено):
  
   ```sh
   docker run -d -p 8080:8080 server
   ```
2. Для агента (приватный порт можно указать любой, но главное указать его и в переменной окружения AGENT_PORT):
  
   ```sh
   docker run -d -e 'AGENT_PORT=12345' -p 12345:12345 agent
   ```
   
## Требования

- Сервер должен максимально утилизировать имеющихся агентов :heavy_check_mark:

- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать между сборками :heavy_check_mark:

  Данную ситуацию сервер обрабатывает корректно, если агент прекратил работать между сборками, то сервер, конечно, 
  отправит post запрос агенту, чтобы запустить сборку, но так как агент прекратил работу и больше не существует на порту, 
  сборка будет завершена неудачно { success: false }, после чего пользователь сможет увидеть лог ошибки на клиенте, в данном случае :
  "Sorry, the server has crashed"
   
- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать в процессе выполнения сборки :heavy_check_mark:

  Если агент прекратит работу во время сборки, то сервер через какое-то время попробует пропинговать порты всех агентов, 
  если какого-то из них не существует, то задача, которую должен был выполнить данный агент, будет повторно добавлена в
  pendingAssemblyList (лист ожидания перед началом сборок), после чего при появлении свободных агентов сборка будет выполняться повторно
  
- Агент должен корректно обрабатывать ситуацию, когда при старте не смог соединиться с сервером  :heavy_check_mark:

  Если при старте агент не смог соединиться с сервером, то агент будет пытаться делать это каждые 10 секунд.
  
- Агент должен корректно обрабатывать ситуацию, когда при отправке результатов сборки не смог соединиться с сервером  :heavy_check_mark:
  
  Если при старте агент не смог соединиться с сервером для отправки результата сборки, то агент будет пытаться делать это каждые 10 секунд.
  
## Связь с автором

Если что-то пойдет не так - я всегда доступен в телеграм @IgnatevPavel
  
