/**
 * Created by wayne.shi on 10/19/2018.
 */
import React from 'react';

const Html = ({ list }) => <div><a href="http://localhost:8080/ssr">SSR (Server Side Rendering)</a>
          <h1>CSR (Client Side Rendering)</h1>
          {list ? <h1>List</h1> : <h1>Loading.. please wait!</h1>}
          {list ? (
                    <ul>
                      {list.map(i => <li key={i.name}>{i.name}</li>)}
                    </ul>
                  ) : null
          }
          </div>;

export default Html;
