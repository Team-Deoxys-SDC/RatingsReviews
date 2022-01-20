import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('https_reqs');

export const options = {
  stages: [
    { duration: '5s', target: 1000 },
  ],
  // vus: 1000,
  // duration: '20s'
};

const url = 'http://localhost:3000/reviews/?product_id=1';

export default function () {
  const res = http.get(url);
  sleep(0.1);
  check(res, {
    'is status 200': r => r.status === 200,
    'transaction time < 500ms': r=> r.timings.duration < 200,
    'transaction time < 500ms': r=> r.timings.duration < 500,
    'transaction time < 1000ms': r=> r.timings.duration < 1000,
    'transaction time < 2000ms': r=> r.timings.duration < 2000
  })
}