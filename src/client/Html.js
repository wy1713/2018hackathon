/**
 * Created by wayne.shi on 10/19/2018.
 */
import React from 'react';

const Html = ({ list }) => <div>
          <h1>CSR (Client Side Rendering)</h1><h2>- React, Next, Express, Node.js, FAAS</h2>
          {list ? <h2>List (20,000 Items from Serverless Cloud FAAS)</h2> : <h1>Loading.. please wait!</h1>}
          {list ? (
                    <ul>
                      {list.map(i => <li key={i.name}>{i.name}</li>)}
                    </ul>
                  ) : null
          }
          </div>;

export default Html;
