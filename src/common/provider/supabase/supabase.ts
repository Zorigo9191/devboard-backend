import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types.js';

@Injectable()
export class SupabaseProvider {
  private readonly supabaseClient: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {
    this.supabaseClient = createClient<Database>(
      this.config.getOrThrow<string>('SUPABASE_URL'),
      this.config.getOrThrow<string>('SUPABASE_SERVICE_KEY'),
    );
  }

  getSupabaseClient(): SupabaseClient<Database> {
    return this.supabaseClient;
  }
}
