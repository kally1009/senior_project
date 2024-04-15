const data = [
    { team: 'Red Jaguars', score: 8 },
    { team: 'Blue Barracudas', score: 23 },
    { team: 'Green Monkeys', score: 3 },
    { team: 'Orange Iguanas', score: 15 },
    { team: 'Purple Parrots', score: 7 },
    { team: 'Silver Snakes', score: 1 },
  ];

  new Chart(document.getElementById('moodChart'), {
    type: 'bar',
    options: {
      animation: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
    data: {
      labels: data.map((row) => row.team),
      datasets: [
        {
          label: 'Legends of the Hidden Temple Team Scores',
          data: data.map((row) => row.score),
          backgroundColor: [
            'rgb(255, 0, 0)',
            'rgb(0, 0, 255)',
            'rgb(0, 255, 0)',
            'rgb(255, 87, 51)',
            'rgb(208, 51, 255)',
            'rgb(185, 185, 185)',
          ],
        },
      ],
    },
  });