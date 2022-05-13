import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {Logic} from './logic';

const port = 5001;

const app = express();
app.use(bodyParser.json());

app.get('/', (request: Request, response: Response) => {
  response.type('text/plain');
  response.send('Homepage');
});

app.put('/update', async (request: Request, response: Response) => {
  const app = new Logic();

  const result = await app.update(request, request.body);

  response.send(result);
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:5000`);
});
