import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseProvider } from '../common/provider/supabase/supabase.js';
import { Database } from '../common/provider/supabase/database.types.js';

@Injectable()
export class TasksService {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private readonly supabaseProvider: SupabaseProvider) {
    this.supabase = this.supabaseProvider.getSupabaseClient();
  }

  //////// Task erzeugen //////////
  async create(task: CreateTaskDto) {
    console.log(task);
    const { data, error } = await this.supabase
      .from('tasks')
      .insert(task)
      .select('*')
      .single();
    console.log(data, error);
    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return data;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  /////// Task Update /////////
  async update(id: string, task: UpdateTaskDto) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update(task)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (data.length === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
