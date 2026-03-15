import { UserMockService } from './user-mock.service';
import { Register } from '../models/Register';

describe('UserMockService', () => {
  let service: UserMockService;

  beforeEach(() => {
    service = new UserMockService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('register should return an observable', () => {
    const user: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'johndoe',
      password: 'secret',
    };
    let received: unknown;
    service.register(user).subscribe((result) => {
      received = result;
    });
    expect(received).toBeUndefined();
  });
});
