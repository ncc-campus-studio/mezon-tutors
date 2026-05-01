import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { VNPay } from "vnpay";
import type { BuildPaymentUrl, ReturnQueryFromVNPay } from "vnpay/dist/types";
import { AppConfigService } from "../../shared/services/app-config.service";

@Injectable()
export class VnpayService {
  constructor(private readonly appConfig: AppConfigService) {}

  isConfigured(): boolean {
    const config = this.appConfig.vnpayConfig;
    return Boolean(config.tmnCode && config.secureSecret && config.vnpayHost);
  }

  createPaymentUrl(input: BuildPaymentUrl) {
    const client = this.getClient();
    return client.buildPaymentUrl(input);
  }

  verifyReturnUrl(query: Record<string, string | string[] | undefined>) {
    const client = this.getClient();
    return client.verifyReturnUrl(this.normalizeQuery(query));
  }

  verifyIpnCall(query: Record<string, string | string[] | undefined>) {
    const client = this.getClient();
    return client.verifyIpnCall(this.normalizeQuery(query));
  }

  async queryTransaction(query: {
    txnRef: string;
    transactionDate: number;
    transactionNo: number;
    createDate?: number;
    orderInfo?: string;
    ipAddr?: string;
  }) {
    const client = this.getClient();
    const now = this.toVnpayDate(new Date());
    return client.queryDr({
      vnp_TxnRef: query.txnRef,
      vnp_RequestId: `${query.txnRef}-${Date.now()}`,
      vnp_OrderInfo: query.orderInfo || `Query transaction ${query.txnRef}`,
      vnp_TransactionDate: query.transactionDate,
      vnp_TransactionNo: query.transactionNo,
      vnp_CreateDate: query.createDate || now,
      vnp_IpAddr: query.ipAddr || "127.0.0.1",
    });
  }

  private getClient() {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException("VNPay is not configured");
    }

    const config = this.appConfig.vnpayConfig;
    return new VNPay({
      tmnCode: config.tmnCode,
      secureSecret: config.secureSecret,
      vnpayHost: config.vnpayHost,
      testMode: config.testMode,
    });
  }

  private normalizeQuery(
    query: Record<string, string | string[] | undefined>
  ): ReturnQueryFromVNPay {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        if (value.length > 0 && value[0] !== undefined) {
          normalized[key] = value[0];
        }
      } else if (value !== undefined) {
        normalized[key] = value;
      }
    }
    return normalized as unknown as ReturnQueryFromVNPay;
  }

  private toVnpayDate(date: Date): number {
    const pad2 = (n: number) => `${n}`.padStart(2, "0");
    return Number(
      `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`
    );
  }
}
