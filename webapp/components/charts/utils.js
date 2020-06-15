export function createChart(options = {}) {
  const {
    initData,
    dataName,
    title,
    renderTo
  } = options
  return new window.Highcharts.StockChart({
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    },
    chart: {
      renderTo
    },
    rangeSelector: {
      buttons: [{
        count: 1,
        type: 'minute',
        text: '1M'
      },
      // {
      //   count: 5,
      //   type: 'minute',
      //   text: '5M'
      // },
      {
        count: 15,
        type: 'minute',
        text: '15M'
      },
      {
        count: 30,
        type: 'minute',
        text: '30M'
      },
      {
        count: 1,
        type: 'hour',
        text: '1H'
      },
      {
        count: 6,
        type: 'hour',
        text: '6H'
      },
      {
        count: 12,
        type: 'hour',
        text: '12H'
      },
      {
        count: 24,
        type: 'hour',
        text: '24H'
      },
      {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 0
    },

    title: {
      text: title
    },

    exporting: {
      enabled: false
    },
    series: [{
      name: dataName,
      data: initData
    }]
  })
}
