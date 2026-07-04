import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobForm from './pages/JobForm';
import JobDetail from './pages/JobDetail';
import Templates from './pages/Templates';
import Tags from './pages/Tags';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/tags" element={<Tags />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
