export interface EthResult {
  error: string;
  success: boolean;
  value: string;
}

export interface CallResult {
  provider: string;
  result: EthResult;
}
