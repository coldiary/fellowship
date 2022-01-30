import winston from 'winston';
import colors from 'colors';
import DailyRotateFile from 'winston-daily-rotate-file';

const nestLikeFormat = winston.format.printf(({ label, context, level, timestamp, message }) => {
    return `${colors.green(label)} ${new Date(timestamp).toLocaleString()}\t ${level} ${colors.yellow(`[${context}]`)} ${message}`;
});

const nestFormat = winston.format.combine(
    winston.format(info => {
        info.level = info.level.toUpperCase()
        return info;
    })(),
    winston.format.label({ label: `[Nest] ${process.pid}  -` }),
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    nestLikeFormat
);

export const WinstonLoggerOptions: winston.LoggerOptions = {
    level: 'info',
    format: nestFormat,
    transports: [
      new winston.transports.Console(),
      new DailyRotateFile({
        level: 'verbose',
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        createSymlink: true,
        dirname: 'dist/logs',
        symlinkName: 'application.log',
      }),
    ]
  }
