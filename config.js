import dotenv from 'dotenv';
dotenv.config();

const cookie = process.env.THREADS_COOKIE;
const userAgent = process.env.THREADS_USER_AGENT;
const appId = process.env.THREADS_APP_ID || '238260118697367';
const lsd = process.env.THREADS_LSD;

if (!cookie) {
  console.error('Error: THREADS_COOKIE is missing in the .env file!');

  process.exit(1);
};

const csrfMatch = cookie.match(/csrftoken=([^;]+)/);
const csrftoken = csrfMatch ? csrfMatch[1] : '';

const userIdMatch = cookie ? cookie.match(/ds_user_id=([^;]+)/) : null;
const ds_user_id = userIdMatch ? userIdMatch[1] : '';

export function getHeaders(customReferer = 'https://www.threads.com/') {
  return {
    'accept': '*/*',
    'accept-language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': cookie,
    'origin': 'https://www.threads.com',
    'referer': customReferer,
    'sec-ch-ua': '"Brave";v="149", "Chromium";v="149", "Not)A;Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': userAgent,
    'x-asbd-id': '359341',
    'x-csrftoken': csrftoken,
    'x-ig-app-id': appId,
    'x-fb-lsd': lsd
  };
}

export const config = {
  cookie,
  userAgent,
  appId,
  lsd,
  csrftoken,
  ds_user_id
};