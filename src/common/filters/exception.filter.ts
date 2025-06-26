import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose from 'mongoose';

import { ErrorData } from '../types';
import { errorResponse } from '../app';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let name = 'Internal Server Error';
    let message = 'Something went wrong! Please try again.';
    let stack = exception.stack?.toString() ?? '';

    // Handle NotFoundException
    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      name = 'Not Found';
      message = 'The requested resource was not found.';
    }

    // Handle general HttpException
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      status = exception.getStatus();
      name = exceptionResponse?.name || exception.name;
      message = exceptionResponse?.message || exception.message;
    }

    // Handle Mongoose Validation Error
    if (exception.name === 'ValidationError' && exception.errors) {
      status = HttpStatus.BAD_REQUEST;
      name = 'Validation Error';
      message = Object.values(exception.errors)
        .map((err: any) => err.message)
        .join(', ');
    }

    // Handle Duplicate Key Error (e.g., err.code === 11000)
    if (exception.code && exception.code === 11000) {
      status = HttpStatus.BAD_REQUEST;
      name = 'Duplicate Values';
      const field = Object.keys(exception.keyValue).join(', ');
      message = `This ${field} is already used by a user. Please use another ${field}.`;
    }

    // Handle CastError (invalid MongoDB ObjectId)
    if (exception.name === 'CastError') {
      status = HttpStatus.NOT_FOUND;
      name = 'Not Found';
      message = `No item found with id: ${exception.value}`;
    }

    let context = 'unknown';
    try {
      const match = stack.match(/at (\w+\.\w+)/);
      context = match?.[1] ?? context;
    } catch {}

    console.log({
      name,
      message,
      stack,
      context,
    });

    const errorData: ErrorData = {
      name,
      message,
      timestamp: new Date().toISOString(),
    };
    const error = errorResponse(errorData, status);

    response.status(status).json(error);
  }
}
