export type SassTokens = Record<string, string>;

export interface UpdateHTMLMessageData {
  body: string;
  name: "update_html";
}

export interface UpdateTokensMessageData {
  body: SassTokens;
  name: "update_tokens";
}

export type PreviewFrameMessageEventData =
  | UpdateHTMLMessageData
  | UpdateTokensMessageData;
