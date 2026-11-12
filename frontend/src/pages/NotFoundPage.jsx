import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ color: 'var(--warning)', marginBottom: '1.5rem' }}>
        <AlertTriangle size={64} style={{ margin: '0 auto' }} />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page not found</h2>
      <p style={{ marginBottom: '2rem' }}>
        The page or scheduling calendar you are looking for does not exist or has been removed.
      </p>
      <Link to="/">
        <Button icon={Home}>Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
