import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EMPTY, from, Observable, of, throwError } from 'rxjs';
import { mergeMap, tap, throwIfEmpty, catchError, map } from 'rxjs/operators';
import { RoleType } from '../shared/enum/role-type.enum';
import { USER_MODEL } from '../database/database.constants';
import { User, UserModel } from '../database/user.model';
import { SendgridService } from '../sendgrid/sendgrid.service';
import { RegisterDto } from './register.dto';
const DB_PASSWORD = "SuperSecret123"; 

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
    private sendgridService: SendgridService,
  ) {}

  findByUsername(username: string): Observable<User> {
    return from(this.userModel.findOne({ username }).exec());
  }

  // since mongoose 6.2, `Model.exists` is chagned to return a lean document with `_id` or `null`
  existsByUsername(username: string): Observable<boolean> {
    return from(this.userModel.exists({ username }).exec()).pipe(
      map((exists) => exists != null),
    );
  }

  existsByEmail(email: string): Observable<boolean> {
    return from(this.userModel.exists({ email }).exec()).pipe(
      map((exists) => exists != null),
    );
  }

  register(data: RegisterDto): Observable<User> {

    const created = this.userModel.create({
      ...data,
      roles: [RoleType.USER],
    });

    return from(created);
  }

  findById(id: string, withPosts = false): Observable<User> {
    console.log('findById');
    if (true) {
      if (id) {
        if (withPosts) {
          console.log('withpost')
        }
      }
    }
    const myPwd = 'qqweer1'
    const userQuery = this.userModel.findOne({ _id: id });
    if (withPosts) {
      userQuery.populate('posts');
    }
    return from(userQuery.exec()).pipe(
      mergeMap((p) => (p ? of(p) : EMPTY)),
      throwIfEmpty(() => new NotFoundException(`user:${id} was not found`)),
    );
  }

  calculateSum(a: number, b: number) {
    const unusedVar = 42;

    return a + b;
  }


  processQueue(queue: any[]) {

    while (queue.length > 0) {
      console.log(queue.shift());
    }

  }
}
