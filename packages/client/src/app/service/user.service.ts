import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IVideo} from './library.service';

const BASE_URL = 'http://127.0.0.1:8080/v1/auth';

interface IUser {

  /**
   * The users Nickname.
   */
  displayName: string;

  /**
   * The users first name
   */
  firstName: string;

  /**
   * The users last name
   */
  lastName: string;

  /**
   * The picture / avatar of the user
   */
  avatar: string;

  /**
   * The Google ID received when using google for authentication.
   */
  googleId: string;

  /**
   * Field to check if this user was validated by a third party IDP.
   */
  isValidated: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {
  }
}
