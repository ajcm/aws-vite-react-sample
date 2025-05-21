import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

// Define the shape of the API response data
interface PostData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// Define props for the component
interface MyButtonProps {
  token: string | undefined; // This will be the dynamic URL passed as a prop
}

const MyButton: React.FC<MyButtonProps> = ({ token }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [data, setData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setClicked(!clicked);
    setLoading(true);
    setError(null);

    try {
     const response: AxiosResponse<PostData> = await axios.get("https://cognito.xpto.kitboga.net/rest/auth", {
      headers: {
        'Access-Control-Allow-Origin': '*',  // This is a custom header, may not work in many cases
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  token, // Use the token prop here
      },
    });

      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        {clicked ? 'Clicked!' : 'Click Me'}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h3>Fetched Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MyButton;
