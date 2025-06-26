import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from '../auth/guard/user.guard';

@Controller('api/v1/user')
@UseGuards(UserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@Req() req: Request) {
    return this.userService.findMe(req.user?.id!);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
