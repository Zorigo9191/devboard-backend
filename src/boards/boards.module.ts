import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { BoardsController } from './boards.controller.js';
import { SupabaseProviderModule } from '../common/provider/supabase/supabase.module.js';

@Module({
  imports: [SupabaseProviderModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
