import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator'

export class CreateVnpayPaymentDto {
  @IsInt()
  @Min(1)
  amount!: number

  @IsString()
  @IsNotEmpty()
  orderInfo!: string

  @IsString()
  @IsNotEmpty()
  txnRef!: string

  @IsString()
  @IsOptional()
  bankCode?: string

  @IsUrl()
  returnUrl!: string
}
