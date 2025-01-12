import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { CheckLogService } from './services/check-log.service';

export const authGuard: CanActivateFn = (route, state) => {
  const checkLogService = inject(CheckLogService)
  checkLogService.checkLoginStatus()
  return checkLogService.isLoggedIn();
};
