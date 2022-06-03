/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Schema for CREATE_WALLET_TRANSACTION transactions
 */
export interface CreateWalletTransaction {
  /**
   * Wallet business number
   */
  walletId: string;
  /**
   * Transaction business number
   */
  transactionId: string;
  /**
   * Session business number
   */
  sessionId: string;
  /**
   * Transaction amount
   */
  amount: number;
  /**
   * Type of transaction
   */
  transactionType: "Bet" | "Withdraw";
}