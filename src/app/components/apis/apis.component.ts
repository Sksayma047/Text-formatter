import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/** All 6 JSONPlaceholder resources */
type EndpointType = 'posts' | 'comments' | 'albums' | 'photos' | 'todos' | 'users';

/** Nested route definitions per resource */
interface NestedRoute {
  label: string;
  path: string;       // e.g. 'comments', 'photos'
}

/** Per-endpoint sample POST/PUT bodies from the real API docs */
const SAMPLE_BODIES: Record<EndpointType, string> = {
  posts:    '{\n  "title": "My Post Title",\n  "body": "Post body content here.",\n  "userId": 1\n}',
  comments: '{\n  "postId": 1,\n  "name": "Commenter Name",\n  "email": "user@example.com",\n  "body": "Great post!"\n}',
  albums:   '{\n  "userId": 1,\n  "title": "My Album"\n}',
  photos:   '{\n  "albumId": 1,\n  "title": "A Photo",\n  "url": "https://via.placeholder.com/600/92c952",\n  "thumbnailUrl": "https://via.placeholder.com/150/92c952"\n}',
  todos:    '{\n  "userId": 1,\n  "title": "Buy groceries",\n  "completed": false\n}',
  users:    '{\n  "name": "John Doe",\n  "username": "johndoe",\n  "email": "john@example.com",\n  "phone": "1-800-000-0000",\n  "website": "johndoe.com"\n}'
};

/** Nested routes available per endpoint */
const NESTED_ROUTES: Partial<Record<EndpointType, NestedRoute[]>> = {
  posts:  [{ label: 'Comments of Post', path: 'comments' }],
  albums: [{ label: 'Photos of Album',  path: 'photos'   }],
  users:  [
    { label: 'Albums of User',  path: 'albums' },
    { label: 'Todos of User',   path: 'todos'  },
    { label: 'Posts of User',   path: 'posts'  }
  ]
};

/** Endpoint metadata — resource count from official docs */
const ENDPOINT_INFO: Record<EndpointType, { count: number; desc: string }> = {
  posts:    { count: 100,  desc: 'Blog posts with title and body' },
  comments: { count: 500,  desc: 'Comments linked to posts' },
  albums:   { count: 100,  desc: 'Photo albums linked to users' },
  photos:   { count: 5000, desc: 'Photos with image URLs' },
  todos:    { count: 200,  desc: 'Todo items with completion status' },
  users:    { count: 10,   desc: 'Users with address and company info' }
};

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.css']
})
export class ApisComponent {

  private readonly BASE = 'https://jsonplaceholder.typicode.com';
  private readonly HEADERS = new HttpHeaders({ 'Content-type': 'application/json; charset=UTF-8' });

  // ── Dropdown data ─────────────────────────────────────────
  endpoints: EndpointType[]   = ['posts', 'comments', 'albums', 'photos', 'todos', 'users'];
  selectedEndpoint: EndpointType = 'posts';

  // ── Input fields ──────────────────────────────────────────
  resourceId: string   = '';           // ID field (Resource / User ID)
  filterParam: string  = '';           // e.g. userId=1
  selectedNested: string = '';         // nested route path e.g. 'comments'
  inputBody: string    = SAMPLE_BODIES['posts'];

  // ── Response state ────────────────────────────────────────
  responseData: any         = null;
  errorMsg: string          = '';
  validationMsg: string     = '';
  isLoading: boolean        = false;
  lastMethod: string        = '';
  lastUrl: string           = '';
  responseStatus: number | null = null;
  errorTime: string         = '';

  // ── Expose lookup objects to template ─────────────────────
  endpointInfo  = ENDPOINT_INFO;
  nestedRoutes  = NESTED_ROUTES;
  sampleBodies  = SAMPLE_BODIES;

  constructor(private http: HttpClient) {}

  // ── Computed ──────────────────────────────────────────────

  get currentInfo() { return ENDPOINT_INFO[this.selectedEndpoint]; }

  get currentNested(): NestedRoute[] {
    return NESTED_ROUTES[this.selectedEndpoint] || [];
  }

  get isPhotoEndpoint(): boolean {
    return this.selectedEndpoint === 'photos';
  }

  /** Flatten a single object to key/value rows for the table */
  get flatResponse(): { key: string; value: any }[] {
    if (!this.responseData) return [];
    const src = Array.isArray(this.responseData)
      ? this.responseData[0]
      : this.responseData;
    if (!src || typeof src !== 'object') return [];
    return Object.entries(src).map(([key, value]) => ({ key, value }));
  }

  /** If response is an array, return the array; else wrap in array */
  get responseList(): any[] {
    if (!this.responseData) return [];
    return Array.isArray(this.responseData) ? this.responseData : [this.responseData];
  }

  /** True when response is an array with more than 1 item */
  get isListResponse(): boolean {
    return Array.isArray(this.responseData) && this.responseData.length > 1;
  }

  // ── Endpoint change ───────────────────────────────────────

  onEndpointChange(): void {
    this.inputBody     = SAMPLE_BODIES[this.selectedEndpoint];
    this.selectedNested = '';
    this.filterParam   = '';
    this.reset();
  }

  // ── Helpers ───────────────────────────────────────────────

  private reset(): void {
    this.responseData   = null;
    this.errorMsg       = '';
    this.validationMsg  = '';
    this.responseStatus = null;
    this.lastUrl        = '';
  }

  private validateId(): boolean {
    if (!this.resourceId || this.resourceId.trim() === '') {
      this.validationMsg = 'Resource ID is required. Please enter a valid numeric ID.';
      return false;
    }
    this.validationMsg = '';
    return true;
  }

  private parseBody(): any {
    try {
      return JSON.parse(this.inputBody);
    } catch {
      this.errorMsg  = 'Invalid JSON in request body. Fix the format and try again.';
      this.errorTime = new Date().toLocaleTimeString();
      return null;
    }
  }

  private handleError(err: any): void {
    this.errorMsg  = `Error ${err.status || 0}: ${err.statusText || 'Network error — check your connection.'}`;
    this.errorTime = new Date().toLocaleTimeString();
    this.isLoading = false;
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  methodColor(method: string): string {
    const map: Record<string, string> = {
      GET: '#5b6af0', POST: '#c8f135', PUT: '#f0a035',
      PATCH: '#a855f7', DELETE: '#ff5f5f'
    };
    return map[method] || '#7a7a9a';
  }

  // ── BUILD URL helpers ─────────────────────────────────────

  private buildGetUrl(): string {
    const id     = this.resourceId.trim();
    const ep     = this.selectedEndpoint;
    const nested = this.selectedNested;
    const filter = this.filterParam.trim();

    if (id && nested) return `${this.BASE}/${ep}/${id}/${nested}`;
    if (id)           return `${this.BASE}/${ep}/${id}`;
    if (filter)       return `${this.BASE}/${ep}?${filter}`;
    return `${this.BASE}/${ep}`;
  }

  // ══════════════════════════════════════════════════════════
  //  API CALLS — matching official JSONPlaceholder guide
  // ══════════════════════════════════════════════════════════

  /** GET /resource  OR  GET /resource/:id  OR  GET /resource/:id/nested */
  onGet(): void {
    this.reset();
    // For GET-all (list), ID is optional
    // For GET by ID, validate
    if (!this.resourceId && !this.filterParam && !this.selectedNested) {
      // GET all — allowed without ID
    } else if (this.selectedNested || this.resourceId) {
      if (!this.validateId()) return;
    }

    this.isLoading  = true;
    this.lastMethod = 'GET';
    this.lastUrl    = this.buildGetUrl();

    this.http.get(this.lastUrl, { observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** POST /resource — Create a new resource */
  onPost(): void {
    this.reset();
    if (!this.validateId()) return;
    const body = this.parseBody();
    if (!body) return;

    this.isLoading  = true;
    this.lastMethod = 'POST';
    this.lastUrl    = `${this.BASE}/${this.selectedEndpoint}`;

    // Attach the ID from the field as userId if not already present
    const payload = { ...body };

    this.http.post(this.lastUrl, payload, { headers: this.HEADERS, observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** PUT /resource/:id — Full update (replace entire resource) */
  onPut(): void {
    this.reset();
    if (!this.validateId()) return;
    const body = this.parseBody();
    if (!body) return;

    this.isLoading  = true;
    this.lastMethod = 'PUT';
    this.lastUrl    = `${this.BASE}/${this.selectedEndpoint}/${this.resourceId.trim()}`;

    // Official guide: include id in body for PUT
    const payload = { ...body, id: Number(this.resourceId) };

    this.http.put(this.lastUrl, payload, { headers: this.HEADERS, observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** PATCH /resource/:id — Partial update (only send changed fields) */
  onPatch(): void {
    this.reset();
    if (!this.validateId()) return;
    const body = this.parseBody();
    if (!body) return;

    this.isLoading  = true;
    this.lastMethod = 'PATCH';
    this.lastUrl    = `${this.BASE}/${this.selectedEndpoint}/${this.resourceId.trim()}`;

    this.http.patch(this.lastUrl, body, { headers: this.HEADERS, observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** DELETE /resource/:id */
  onDelete(): void {
    this.reset();
    if (!this.validateId()) return;

    this.isLoading  = true;
    this.lastMethod = 'DELETE';
    this.lastUrl    = `${this.BASE}/${this.selectedEndpoint}/${this.resourceId.trim()}`;

    this.http.delete(this.lastUrl, { observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        // API returns {} on success
        this.responseData = {
          status:  res.status,
          message: `Resource /${this.selectedEndpoint}/${this.resourceId} deleted successfully (simulated).`,
          id:      this.resourceId
        };
        this.isLoading = false;
      },
      error: err => this.handleError(err)
    });
  }
}
