import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class WebhookDto {
  @IsNotEmpty({ message: 'Reference is required' })
  @IsString()
  reference: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(['SUCCESS', 'FAILED'], { message: 'Status must be either SUCCESS or FAILED' })
  status: 'SUCCESS' | 'FAILED';
}