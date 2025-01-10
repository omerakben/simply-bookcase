export interface Author {
  firebaseKey: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  uid: string;
  favorite: boolean;
}

export interface Book {
  firebaseKey: string;
  title: string;
  author_id: string;
  description: string;
  image: string;
  price: number;
  sale: boolean;
  uid: string;
}

export interface SearchResults {
  books: (Book & { type: 'book' })[];
  authors: (Author & { type: 'author' })[];
  query: string;
}

export interface SearchParams {
  uid: string;
  q: string;
}
