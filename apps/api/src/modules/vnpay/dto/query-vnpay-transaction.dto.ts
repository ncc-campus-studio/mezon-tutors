import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class QueryVnpayTransactionDto {
  @IsString()
  @IsNotEmpty()
  txnRef!: string

  @Type(() => Number)
  @IsInt()
  @Min(1)
  transactionDate!: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  transactionNo!: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  createDate?: number

  @IsString()
  @IsOptional()
  orderInfo?: string

  @IsString()
  @IsOptional()
  ipAddr?: string
}
