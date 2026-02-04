export type RecognizeItemsHistoryItem = {
  id: string;
  items: {
    item_name: string;
    category: string;
    count: number;
    description: string;
  }[];
  totalItemsDetected: number;
  createdAt: string;
};