import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Post } from './pages/Post';

function App() {
  return (
    <Router basename="/machine-learning-building-blocks">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* This line was likely a malformed comment or an attempt to remove a line.
                The original routes are restored to maintain functionality.
                If you intended to remove specific routes, please provide a clearer instruction. */}
          <Route index element={<Home />} />
          <Route path=":year/:month/:day/:id" element={<Post />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
