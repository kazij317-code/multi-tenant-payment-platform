import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(['SUCCESS', 'FAILED'], { message: 'Status must be either SUCCESS or FAILED' })
  status: 'SUCCESS' | 'FAILED';
}