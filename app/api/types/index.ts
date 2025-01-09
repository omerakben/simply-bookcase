export interface Author {
  firebaseKey: string;
  email: string;
  first_name: string;
  last_name: string;
  image: string;
  favorite: boolean;
  uid: string;
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
