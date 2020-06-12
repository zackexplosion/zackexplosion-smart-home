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
      }, {
        count: 5,
        type: 'minute',
        text: '5M'
      }, {
        count: 15,
        type: 'minute',
        text: '15M'
      }, {
        count: 30,
        type: 'minute',
        text: '30M'
      },
      {
        count: 59,
        type: 'minute',
        text: '1H'
      }
      // {
      //   type: 'all',
      //   text: 'All'
      // }
      ],
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
