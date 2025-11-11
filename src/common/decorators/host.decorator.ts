import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 1. ده بيعمل "ديكوريتور" جديد اسمه Host
export const Host = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 2. الكود ده بيجيب الطلب (request)
    const request = ctx.switchToHttp().getRequest();
    // 3. وبيرجع الـ "host" اللي جاي منه الطلب
    return request.headers['host'];
  },
);  