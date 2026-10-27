import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    console.log('Guard: SUPABASE_URL =', process.env.SUPABASE_URL);
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;

    console.log('Guard: Anfrage', request.method, request.url);
    console.log('Guard: Header =', authHeader?.slice(0, 20));

    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      throw new UnauthorizedException('Kein Token mitgeschickt.');
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      console.error('Guard-Fehler:', error?.message);
      throw new UnauthorizedException('Token ungültig oder abgelaufen.');
    }

    request.user = data.user;
    return true;
  }
}
