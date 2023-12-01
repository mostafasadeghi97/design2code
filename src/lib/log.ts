import * as log4js from 'log4js';

const logger = log4js.getLogger();

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'mark';

function pad(number: number, length: number) {
  let str = String(number);
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

function log(message: string, level: LogLevel = 'info') {
  const date = new Date();
  const filename = `log/messages_${date.getFullYear()}${pad(
    date.getMonth() + 1,
    2
  )}${pad(date.getDate(), 2)}_${pad(date.getHours(), 2)}${pad(
    date.getMinutes(),
    2
  )}${pad(date.getSeconds(), 2)}.json`;

  log4js.configure({
    appenders: {
      file: {
        type: 'file',
        filename,
        layout: { type: 'messagePassThrough' }
      },
    },
    categories: {
      default: { 
        appenders: ['file'], level } 
    }
  })

  logger[level](message);
}

export default log
