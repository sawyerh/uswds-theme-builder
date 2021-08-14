export interface UpdateHTMLMessageData {
  body: string;
  name: "update_html";
}

export interface UpdateTokensMessageData {
  body: Record<string, string>;
  name: "update_tokens";
}

export type PreviewFrameMessageEventData =
  | UpdateHTMLMessageData
  | UpdateTokensMessageData;
