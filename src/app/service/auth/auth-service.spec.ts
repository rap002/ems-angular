import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthService, isLoggedIn, TokenResponse } from './auth-service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const BASE_URL = environment.baseUrl + '/api/v1/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // -----------------------------
  // Service Creation Test
  // -----------------------------
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -----------------------------
  // Login API Test
  // -----------------------------
  it('should call login API and store token in sessionStorage', () => {
    const mockResponse: TokenResponse = {
      token: 'fake-jwt-token',
      tokenType: 'Bearer',
      expiresIn: 3600000,
      username: 'admin',
    };

    service.login('admin', 'password123').subscribe((response) => {
      expect(response).toEqual(mockResponse);

      // Check token stored in sessionStorage
      expect(sessionStorage.getItem('auth')).toBe('fake-jwt-token');
    });

    // Expect API request
    const req = httpMock.expectOne(`${BASE_URL}/login`);

    // Check request method
    expect(req.request.method).toBe('POST');

    // Check request body
    expect(req.request.body).toEqual({
      username: 'admin',
      password: 'password123',
    });

    // Send fake response
    req.flush(mockResponse);
  });

  // -----------------------------
  // Logout Test
  // -----------------------------
  it('should remove token from sessionStorage on logout', () => {
    sessionStorage.setItem('auth', 'fake-token');

    service.logout();

    expect(sessionStorage.getItem('auth')).toBeNull();
  });

  // -----------------------------
  // isLoggedIn TRUE Test
  // -----------------------------
// -----------------------------
// isLoggedIn TRUE Test
// -----------------------------
it('should return true if auth token exists', () => {
  sessionStorage.setItem('auth', 'fake-token');

  expect(isLoggedIn()).toBe(true);
});

// -----------------------------
// isLoggedIn FALSE Test
// -----------------------------
it('should return false if auth token does not exist', () => {
  sessionStorage.removeItem('auth');

  expect(isLoggedIn()).toBe(false);
});
});