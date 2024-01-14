import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data:unknown,ctx:ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user
})