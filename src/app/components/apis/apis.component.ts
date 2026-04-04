import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

type ResourceType = 'comments' | 'albums' | 'photos' | 'todos';

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.css']
})
export class ApisComponent {

  private readonly BASE    = 'https://jsonplaceholder.typicode.com';
  private readonly HEADERS = new HttpHeaders({ 'Content-type': 'application/json; charset=UTF-8' });

  // ── Inputs ────────────────────────────────────────────────
  userId: number | null   = null;
  inputBody: string       = '';
  selectedResource: ResourceType = 'comments';

  resources: ResourceType[] = ['comments', 'albums', 'photos', 'todos'];

  // ── Response state ────────────────────────────────────────
  responseData: any         = null;
  errorMsg: string          = '';
  validationMsg: string     = '';
  isLoading: boolean        = false;
  lastMethod: string        = '';
  responseStatus: number | null = null;

  constructor(private http: HttpClient) {}

  // ── Helpers ───────────────────────────────────────────────

  private reset(): void {
    this.responseData   = null;
    this.errorMsg       = '';
    this.validationMsg  = '';
    this.responseStatus = null;
  }

  private hasId(): boolean {
    return this.userId !== null &&
           this.userId !== undefined &&
           !isNaN(Number(this.userId));
  }

  private validateId(): boolean {
    if (!this.hasId()) {
      this.validationMsg = 'User ID is required.';
      return false;
    }
    this.validationMsg = '';
    return true;
  }

  private parseBody(): any {
    if (!this.inputBody.trim()) {
      this.errorMsg = 'Input body is empty.';
      return null;
    }
    try {
      return JSON.parse(this.inputBody);
    } catch {
      this.errorMsg = 'Invalid JSON in input body.';
      return null;
    }
  }

  private handleError(err: any): void {
    const status = err.status ?? 0;
    if      (status === 404) this.errorMsg = `Error ${status}: Not Found — resource does not exist.`;
    else if (status === 0)   this.errorMsg = `Error ${status}: Network error — cannot reach the server.`;
    else if (status === 400) this.errorMsg = `Error ${status}: Bad Request — check your input.`;
    else                     this.errorMsg = `Error ${status}: ${err.message || 'Request failed.'}`;
    this.isLoading = false;
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  get flatResponse(): { key: string; value: any }[] {
    if (!this.responseData) return [];
    const src = Array.isArray(this.responseData)
      ? this.responseData[0]
      : this.responseData;
    if (!src || typeof src !== 'object') return [];
    return Object.entries(src).map(([key, value]) => ({ key, value }));
  }

  get responseList(): any[] {
    if (!this.responseData) return [];
    return Array.isArray(this.responseData) ? this.responseData : [this.responseData];
  }

  get isListResponse(): boolean {
    return Array.isArray(this.responseData) && this.responseData.length > 0;
  }

  getEntries(obj: any): { key: string; value: any }[] {
    if (!obj || typeof obj !== "object") return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  get isPhotoResource(): boolean {
    return this.selectedResource === 'photos';
  }

  // ── API CALLS ─────────────────────────────────────────────

  /** GET — fetch user's resource by userId */
  onFetch(): void {
    this.reset();
    if (!this.validateId()) return;

    this.isLoading  = true;
    this.lastMethod = 'GET';

    // Fetch /users/:id/resource (nested route)
    const url = `${this.BASE}/users/${this.userId}/${this.selectedResource}`;

    this.http.get(url, { observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** DELETE */
  onDelete(): void {
    this.reset();
    if (!this.validateId()) return;

    this.isLoading  = true;
    this.lastMethod = 'DELETE';

    const url = `${this.BASE}/${this.selectedResource}/${this.userId}`;

    this.http.delete(url, { observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = {
          status:  res.status,
          message: `Deleted ${this.selectedResource}/${this.userId} successfully (simulated).`
        };
        this.isLoading = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** UPDATE (PUT) */
  onUpdate(): void {
    this.reset();
    if (!this.validateId()) return;
    const body = this.parseBody();
    if (body === null) return;

    this.isLoading  = true;
    this.lastMethod = 'PUT';

    const url     = `${this.BASE}/${this.selectedResource}/${this.userId}`;
    const payload = { ...body, id: Number(this.userId) };

    this.http.put(url, payload, { headers: this.HEADERS, observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }

  /** CREATE (POST) */
  onCreate(): void {
    this.reset();
    if (!this.validateId()) return;
    const body = this.parseBody();
    if (body === null) return;

    this.isLoading  = true;
    this.lastMethod = 'POST';

    const url     = `${this.BASE}/${this.selectedResource}`;
    const payload = { ...body, userId: Number(this.userId) };

    this.http.post(url, payload, { headers: this.HEADERS, observe: 'response' }).subscribe({
      next: res => {
        this.responseStatus = res.status;
        this.responseData   = res.body;
        this.isLoading      = false;
      },
      error: err => this.handleError(err)
    });
  }
}
