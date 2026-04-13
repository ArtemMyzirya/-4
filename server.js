const http = require('http');
const url = require('url');

let users = [];

function send(res, status, data, type='application/json'){
  res.writeHead(status, {'Content-Type': type});
  res.end(typeof data === 'string' ? data : JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const method = req.method;
  const path = parsed.pathname;

  // Exercise 4.1: GET /hello
  if(method === 'GET' && path === '/hello'){
    return send(res, 200, {message: "Hello from Node"});
  }

  // Exercise 4.2: POST /users (JSON body)
  if(method === 'POST' && path === '/users'){
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try{
        const user = JSON.parse(body);
        user.id = users.length + 1;
        users.push(user);
        send(res, 201, user);
      }catch{
        send(res, 400, {error: "Invalid JSON"});
      }
    });
    return;
  }

  // Exercise 4.3: GET /users
  if(method === 'GET' && path === '/users'){
    return send(res, 200, users);
  }

  // Exercise 4.4: DELETE /users/:id
  const userMatch = path.match(/^\/users\/(\d+)$/);
  if(method === 'DELETE' && userMatch){
    const id = parseInt(userMatch[1]);
    users = users.filter(u => u.id !== id);
    return send(res, 204, '');
  }

  // Exercise 4.5: Streams demo GET /file
  if(method === 'GET' && path === '/file'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    for(let i=0;i<5;i++){
      res.write("Line " + i + "\n");
    }
    return res.end();
  }

  send(res, 404, {error: "Not found"});
});

server.listen(3000, ()=>console.log("Server running on http://localhost:3000"));
