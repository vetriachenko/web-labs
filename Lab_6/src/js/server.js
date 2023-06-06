const jsonServer = require("json-server");

const server = jsonServer.create();
server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.post("/teacher", (req, res) => {
  const teacher = req.body;
  console.log({ teacher });
  res.status(200).json(teacher);
});

server.listen(3000);
