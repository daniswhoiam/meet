import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function EventGenre({ events }) {
  const [data, setData] = useState([]);
  const colors = [
    '#103103',
    '#9fcc00',
    '#a3c266',
    '#001800',
    '#86b300',
    '#8aa94d'
  ];

  useEffect(() => {
    const getData = () => {
      const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];
      const data = genres.map(genre => {
        const value = events.filter(event => {
          let wordArray = event.summary.split(' ');
          return wordArray.includes(genre);
        }).length;
        return { name: genre, value };
      });
      /* Remove genres that do not appear */
      return data.filter(genre => genre.value > 0);
    };
    setData(getData());
  }, [events]);

  return (
    <ResponsiveContainer height={400}>
      <PieChart className="pieChart">
        <Pie
          data={data}
          cy={200}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {
            data.map((entry, index) => {
              return <Cell key={`cell-${index}`} fill={colors[index]} />
            })
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
