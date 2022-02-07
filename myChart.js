// Chart 객체에 넘겨줄 차트에 대한 정보들을 정의한 객체. 명품 html5의 7장 프로토타입 참고
var config = {
  // 초음파 센서 값을 그릴 차트
  // type은 차트 종류 지정
  type: "line" /* line 등으로 바꿀 수 있음 */,

  // data는 차트에 출력될 전체 데이터 표현
  data: {
    // labels는 배열로 데이터의 레이블들
    labels: [],

    // datasets 배열로 이 차트에 그려질 모든 데이터 셋 표현. 아래는 그래프 1개만 있는 경우
    datasets: [
      {
        label: "실시간 초음파센서 흐름",
        backgroundColor: "yellow",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        data: [] /* 각 레이블에 해당하는 데이터 */,
        fill: false /* 그래프 아래가 채워진 상태로 그려집니다. 해보세요 */,
      },
    ],
  },

  //  차트의 속성 지정
  options: {
    responsive: false, // 크기 조절 금지
    scales: {
      /* x축과 y축 정보 */
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "시간" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "거리(cm)" },
        },
      ],
    },
  },
};
var config2 = {
  // 조도센서 값을 그릴 차트
  // type은 차트 종류 지정
  type: "line" /* line 등으로 바꿀 수 있음 */,

  // data는 차트에 출력될 전체 데이터 표현
  data: {
    // labels는 배열로 데이터의 레이블들
    labels: [],

    // datasets 배열로 이 차트에 그려질 모든 데이터 셋 표현. 아래는 그래프 1개만 있는 경우
    datasets: [
      {
        label: "실시간 밝기",
        backgroundColor: "blue",
        borderColor: "rgb(36, 120, 255)",
        borderWidth: 2,
        data: [],
        fill: false,
      },
    ],
  },

  //  차트의 속성 지정
  options: {
    responsive: false, // 크기 조절 금지
    scales: {
      /* x축과 y축 정보 */
      xAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "시간" },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: { display: true, labelString: "조도센서 값" },
        },
      ],
    },
  },
};
var ctx = null;
var ctx2 = null;
var chart = null;
var chart2 = null;
var LABEL_SIZE = 20; // 차트에 그려지는 데이터의 개수
var tick = 0; // 도착한 데이터의 개수임, tick의 범위는 0에서 99까지만
var tick2 = 0;
function drawChart() {
  ctx = document.getElementById("canvas").getContext("2d");
  ctx2 = document.getElementById("canvas2").getContext("2d");
  chart = new Chart(ctx, config); // 초음파 센서 차트
  chart2 = new Chart(ctx2, config2); // 조도센서 차트
  init();
} // end of drawChart()

// chart의 차트에 labels의 크기를 LABEL_SIZE로 만들고 0~19까지 레이블 붙이기
function init() {
  for (let i = 0; i < LABEL_SIZE; i++) {
    chart.data.labels[i] = i;
    chart2.data.labels[i] = i;
  }
  chart.update();
  chart2.update();
}

function addDistanceData(value) {
  tick++; // 도착한 데이터의 개수 증가
  tick %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n = chart.data.datasets[0].data.length; // 현재 데이터의 개수
  if (n < LABEL_SIZE) {
    chart.data.datasets[0].data.push(value);
  } else {
    // 새 데이터 value 삽입
    chart.data.datasets[0].data.push(value);
    chart.data.datasets[0].data.shift();
    // 레이블 삽입
    chart.data.labels.push(tick);
    chart.data.labels.shift();
  }
  chart.update();
}
function addLightData(value) {
  tick2++; // 도착한 데이터의 개수 증가
  tick2 %= 100; // tick의 범위는 0에서 99까지만. 100보다 크면 다시 0부터 시작
  let n2 = chart2.data.datasets[0].data.length;
  if (n2 < LABEL_SIZE) chart2.data.datasets[0].data.push(value);
  else {
    // 새 데이터 value 삽입
    chart2.data.datasets[0].data.push(value);
    chart2.data.datasets[0].data.shift();
    // 레이블 삽입
    chart2.data.labels.push(tick2);
    chart2.data.labels.shift();
  }
  chart2.update();
}

function hideDistanceshow() {
  // 캔버스 보이기 숨기기
  const canvas = document.getElementById("canvas");
  if (canvas.style.display == "none") canvas.style.display = "block";
  else canvas.style.display = "none";
}
function hideLightshow() {
  const canvas2 = document.getElementById("canvas2");
  if (canvas2.style.display == "none") canvas2.style.display = "block";
  else canvas2.style.display = "none";
}

window.addEventListener("load", drawChart); // load 이벤트가 발생하면 drawChart() 호출하도록 등록
