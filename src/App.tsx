import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from "@aws-amplify/auth";
import axios from 'axios';

import MyButton from './TestGet';

const client = generateClient<Schema>();

const fetchSession = async () => {
  const session = await fetchAuthSession();
  console.log(session.tokens);
  return session
};


function App_() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);


  const x =

    useEffect(() => {
      client.models.Todo.observeQuery().subscribe({
        next: (data) => setTodos([...data.items]),
      });

      console.log(x)


    }, []);



  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>

    </main>
  );
}

export default function App() {
  const [data, setData] = useState<import("@aws-amplify/auth").AuthSession | null>(null);


  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAuthSession({ forceRefresh: true });
        const accessToken = response.tokens?.accessToken;
        const idToken = response.tokens?.idToken;
        console.log(accessToken?.toString());
        //console.log('ID Token:', idToken?.toString());

        setData(response);


      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); 


  



  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => {

          //  console.log(user);
          return (
            <main>
              <h1>Hello {user?.username}</h1>
              <h2>{user?.signInDetails?.loginId}</h2>
              <button onClick={signOut}>Sign out</button>
              <div>{data ? JSON.stringify(data.tokens?.accessToken.toString()) : 'Loading...'}</div>

              <div>
               <MyButton token={data ? data?.tokens?.accessToken?.toString() : ''} />
              </div>

            </main>
          )
        }
        }
      </Authenticator>
    </div>
  );
};

