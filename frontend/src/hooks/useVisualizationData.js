import { useState, useEffect } from 'react';
import api from '../api/authApi';

const useVisualizationData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/data/yearly');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Failed to fetch visualization data'
        );
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useVisualizationData;
