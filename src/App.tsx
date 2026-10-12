import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

// Posts pull in KaTeX, Mafs and the syntax highlighter, so load them only when a post is opened
const Post = lazy(() => import('./pages/Post').then(m => ({ default: m.Post })));

function App() {
  return (
    <Router basename="/machine-learning-building-blocks">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":year/:month/:day/:id" element={<Suspense><Post /></Suspense>} />
          <Route path="post/:id" element={<Suspense><Post /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
