import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { encodePassword } from 'src/utils/bcrypt';
import { UserDto } from 'src/dto/User.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@Inject('USER_MODEL') private readonly userModel: Model<User>) {}

  async findOne(username: string): Promise<User | undefined> {
    try {
      const user = await this.userModel.findOne({ username }).exec();
      console.log('User found:', user);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  async createUser(body: UserDto): Promise<User> {
    const password = encodePassword(body.password);
    try {
      return await this.userModel.create({ ...body, password });
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException('username or email exist ! ');
      } else {
        throw new BadRequestException(
          'An error occurred while creating the user',
        );
      }
    }
  }
  async fetchUsers(skip, limit): Promise<User[]> {
    try {
      return await this.userModel
        .find({}, { password: 0 })
        .skip(parseInt(skip))
        .limit(parseInt(limit));
    } catch (error) {
      throw new HttpException('could not fetch users', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      throw new HttpException('could not delete user', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  async updateUser(id: string, body: UserDto): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(
        { _id: id },
        { $set: body },
        { new: true },
      );
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('username or email exist ! ');
      } else {
        throw new BadRequestException(
          'An error occurred while updating the user',
        );
      }
    }
  }

  async searchUser(key: string, skip: string, limit: string) {
    try {
      return await this.userModel
        .find(
          {
            $or: [
              { username: { $regex: new RegExp(key, 'i') } },
              { email: { $regex: new RegExp(key, 'i') } },
              { roles: { $regex: new RegExp(key, 'i') } },
            ],
          },
          { password: 0 },
        )
        .skip(parseInt(skip))
        .limit(parseInt(limit));
    } catch (error) {
      throw new HttpException('could not delete user', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
