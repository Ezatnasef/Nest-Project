import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <-- 1. استدعي "map"

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // next.handle() هو الرد اللي راجع من الـ Controller
    return next.handle().pipe(
      // 2. استخدم "map" عشان تعدل الداتا اللي راجعة
      map((data) => {
        // 3. غلّف الداتا جوه "data" object
        return { data: data };
      })
    );
  }
}