// Mock Next.js server modules for testing
export class NextRequest {
  headers: Headers;
  url: string;
  method: string;
  body?: any;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
    this.body = init?.body;
  }

  async json() {
    return JSON.parse(this.body as string || '{}');
  }

  async text() {
    return this.body as string || '';
  }
}

export class NextResponse {
  static json(body: any, init?: ResponseInit) {
    return {
      status: init?.status || 200,
      headers: new Headers(init?.headers),
      json: async () => body,
      text: async () => JSON.stringify(body),
    };
  }
}
