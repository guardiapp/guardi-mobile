import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  // Access Token methods

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    const token = localStorage.getItem('token') || '';

    return token;
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  // Refresh Token methods

  saveRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken() {
    const token = localStorage.getItem('refreshToken') || '';
    return token;
  }

  removeRefreshToken() {
    localStorage.removeItem('refreshToken');
  }

  /**
   * The function `isValidToken` checks if a token is valid by decoding it and comparing its expiration
   * time with the current time.
   * @returns The `isValidToken()` function is returning a boolean value. It returns `true` if the token
   * is valid (i.e., not expired) based on the expiration time (`exp`) decoded from the JWT token, and
   * `false` otherwise.
   */
  isValidToken() {
    const token = this.getToken();

    if (!token) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

  /**
   * The function `isValidRefreshToken` checks if a refresh token is valid based on its expiration time.
   * @returns The `isValidRefreshToken()` function returns a boolean value indicating whether the
   * refresh token is valid or not. It returns `true` if the refresh token is valid (i.e., not expired)
   * and `false` if the refresh token is either missing or expired.
   */
  isValidRefreshToken() {
    const token = this.getRefreshToken();

    if (!token) {
      return false;
    }

    const decodeToken = jwtDecode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}
