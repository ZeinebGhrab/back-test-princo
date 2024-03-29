import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/User.dto';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { ParseIntPipe } from 'src/pipe/parse-int.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.Admin)
  add(@Body() body: UserDto) {
    return this.service.createUser(body);
  }

  @Get()
  @Roles(Role.Admin)
  fetch(
    @Query('skip', new ParseIntPipe()) skip,
    @Query('limit', new ParseIntPipe(), new DefaultValuePipe(4)) limit,
  ) {
    return this.service.fetchUsers(skip, limit);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  delete(@Param('id') id: string) {
    return this.service.deleteUser(id);
  }

  @Put('/:id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() body: UserDto) {
    return this.service.updateUser(id, body);
  }

  @Get('/search')
  @Roles(Role.Admin)
  search(
    @Query('key') key: string,
    @Query('skip', new ParseIntPipe()) skip,
    @Query('limit', new ParseIntPipe(), new DefaultValuePipe(4)) limit,
  ) {
    return this.service.searchUser(key, skip, limit);
  }
}
