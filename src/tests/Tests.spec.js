import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

export const getContactsDuration = new Trend('get_contacts', true);
export const RateContentOK = new Rate('content_OK');

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.30'],
    get_contacts: ['p(99)<500'],
    content_OK: ['rate>0.95']
  },
  stages: [
    { duration: '15s', target: 10 },
    { duration: '15s', target: 10 },
    { duration: '30s', target: 40 },
    { duration: '30s', target: 40 },
    { duration: '30s', target: 40 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 200 },
    { duration: '30s', target: 200 },
    { duration: '30s', target: 300 }
  ]
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://api.kanye.rest';

  const OK = 200;

  const res = http.get(`${baseUrl}`);

  getContactsDuration.add(res.timings.duration);

  RateContentOK.add(res.status === OK);

  check(res, {
    'GET Kanye Quote - Status 200': () => res.status === OK,
    'Response has quote': () => JSON.parse(res.body).quote !== undefined,
    'Quote is not empty': () => JSON.parse(res.body).quote.trim().length > 0,
    'Quote is a string': () => typeof JSON.parse(res.body).quote === 'string',
    'Quote starts with "Kanye says: "': () =>
      JSON.parse(res.body).quote.startsWith('Kanye says: ')
  });
}
