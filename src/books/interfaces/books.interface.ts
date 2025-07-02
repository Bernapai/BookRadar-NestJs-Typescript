export interface GoogleBooksResponse {
  items: GoogleBook[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    description?: string;
  };
}
