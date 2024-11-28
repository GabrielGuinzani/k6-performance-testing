import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const baseUrl = 'https://api.kanye.rest';

  const OK = 200;

  const res = http.get(`${baseUrl}`);

  check(res, {
    'GET Kanye Quote - Status 200': () => res.status === OK,
    'Response has quote': () => JSON.parse(res.body).quote !== undefined,
    'Quote is not empty': () => JSON.parse(res.body).quote.trim().length > 0,
    'Quote is a string': () => typeof JSON.parse(res.body).quote === 'string',
    'Quote starts with "Kanye says: "': () =>
      JSON.parse(res.body).quote.startsWith('Kanye says: ')
  });
}
