import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { UpdateBoardDto } from './dto/update-board.dto.js';
import { SupabaseProvider } from '../common/provider/supabase/supabase.js';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../common/provider/supabase/database.types.js';

@Injectable()
export class BoardsService {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private readonly supabaseProvider: SupabaseProvider) {
    this.supabase = this.supabaseProvider.getSupabaseClient();
  }
  // board erzeugen
  async create(createBoardDto: CreateBoardDto) {
    const { data, error } = await this.supabase
      .from('boards')
      .insert({ title: createBoardDto.title })
      .select('*, tasks(*)')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
  // Alle Boards laden
  async findAll() {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*, tasks(*)');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }
  // board durch id finden
  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('boards')
      .select('*,tasks(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Board ${id} not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  // Board update
  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const { data, error } = await this.supabase
      .from('boards')
      .update({ title: updateBoardDto.title })
      .eq('id', id)
      .select('*, tasks(*)')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Board ${id} not found`);
      }
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  async remove(id: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('boards')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data || data.length === 0) {
      throw new NotFoundException(`Board with ID:${id} not found`);
    }
  }
}
