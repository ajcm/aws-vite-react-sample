import { useEffect, useState } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession, AuthSession } from "@aws-amplify/auth";
import MyButton from './TestGet';

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetchAuthSession({ forceRefresh: true });
        console.log(response.tokens?.accessToken?.toString());
        setSession(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getSession();
  }, []);

  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <h2>{user?.signInDetails?.loginId}</h2>
            <button onClick={signOut}>Sign out</button>
            <div>
              {session?.tokens?.accessToken
                ? JSON.stringify(session.tokens.accessToken.toString())
                : 'Loading...'}
            </div>
            <div>
              <MyButton token={session?.tokens?.accessToken?.toString() || ''} />
            </div>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

