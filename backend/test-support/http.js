const http = require('http');
const { Duplex } = require('stream');

class MockSocket extends Duplex {
  constructor() {
    super();
    this.chunks = [];
    this.remoteAddress = '127.0.0.1';
    this.writable = true;
    this.readable = true;
  }

  _read() {}

  _write(chunk, _encoding, callback) {
    this.chunks.push(Buffer.from(chunk));
    callback();
  }

  _final(callback) {
    callback();
  }

  setTimeout() {}
  setNoDelay() {}
  setKeepAlive() {}
  destroy() {
    this.emit('close');
  }
}

async function request(app, path, options = {}) {
  const socket = new MockSocket();
  const bodyChunks = [];
  const requestBody = options.body || null;
  const headers = Object.fromEntries(
    Object.entries(options.headers || {}).map(([key, value]) => [key.toLowerCase(), value]),
  );

  if (requestBody && !headers['content-length']) {
    headers['content-length'] = String(Buffer.byteLength(requestBody));
  }

  const req = new http.IncomingMessage(socket);
  req.method = options.method || 'GET';
  req.url = path;
  req.headers = headers;
  req.connection = socket;
  req.socket = socket;
  req.httpVersion = '1.1';

  const res = new http.ServerResponse(req);
  res.assignSocket(socket);
  const originalWrite = res.write.bind(res);
  const originalEnd = res.end.bind(res);

  res.write = (chunk, encoding, callback) => {
    if (chunk) bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    return originalWrite(chunk, encoding, callback);
  };

  res.end = (chunk, encoding, callback) => {
    if (chunk) bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
    return originalEnd(chunk, encoding, callback);
  };

  const response = await new Promise((resolve, reject) => {
    res.on('finish', () => {
      const rawBody = Buffer.concat(bodyChunks).toString('utf8');
      const contentType = res.getHeader('content-type') || '';
      const body = String(contentType).includes('application/json')
        ? JSON.parse(rawBody || '{}')
        : rawBody;

      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        body,
      });
    });

    res.on('error', reject);

    app.handle(req, res, reject);

    process.nextTick(() => {
      if (requestBody) req.push(requestBody);
      req.push(null);
    });
  });

  res.detachSocket(socket);
  return response;
}

module.exports = {
  request,
};
