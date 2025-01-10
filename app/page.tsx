import UnifiedSearchForm from './components/UnifiedSearchForm';

export default function Home() {
  return (
    <div className="green_container">
      <h1 className="heading">Welcome to Bookcase</h1>
      <p className="sub-heading">
        Discover and share your favorite books with the community
      </p>
      <UnifiedSearchForm />
    </div>
  );
}

