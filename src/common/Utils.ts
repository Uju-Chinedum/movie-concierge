import { Document, Model } from "mongoose";
import { HttpStatus } from "@nestjs/common";

import { AppResponse } from "./types";
import { successResponse } from "./app";

export class AppUtils {
  static pickAttributes<T, K extends keyof T>(
    obj: T,
    keys: readonly K[],
  ): Pick<T, K> {
    return keys.reduce(
      (acc, key) => {
        acc[key] = obj[key];
        return acc;
      },
      {} as Pick<T, K>,
    );
  }
}

export class DBUtils {
  static async createEntity<T extends Document, Dto, K extends keyof T>(
    model: Model<T>,
    dto: Dto,
    attributes: readonly K[],
    message: string,
  ): Promise<AppResponse<Pick<T, K>>> {
    const instance = new model(dto);
    const saved = await instance.save();

    const plain = saved.toObject() as T;

    return successResponse(
      message,
      AppUtils.pickAttributes(plain, attributes),
      HttpStatus.CREATED,
    );
  }
}