#!/usr/bin/env node

import axios from 'axios';
import { Command, Argument } from 'commander';

const program = new Command();

const zeroPadding = (num, length, char = '0') => {
  return num.toString().padStart(length, char);
}

const zp = (num, length, char = '0') => zeroPadding(num, length, char);
const p = (num, length, char = ' ') => num.toString().padStart(length, char);

const findBusStop = async (busStopId) => {
  const response = await axios.get(`https://search.map.kakao.com/mapsearch/map.daum?q=${busStopId}`);
  const busData = response.data;
  return busData;
}

const timeString = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (minutes > 0) return `${p(minutes, 2)}분 ${p(seconds, 2)}초`;
  if (seconds > 0) return `${p(0, 2)}분 ${p(seconds, 2)}초`;
  return '도착';
}

const getBusArrivalTimes = async (busStopId, busNumber, i, loop) => {
  const busNumbers = busNumber?.split(',').map(n => n.trim()) ?? [];
  try {
    const response = await axios.get(`https://map.kakao.com/bus/stop.json?busstopid=${busStopId}`);
    const busData = response.data;

    // 각 버스 노선의 도착 시간 정보 추출
    const arrivalTimes = busData.lines.map(line => {
      if ((busNumbers.length > 0 && !busNumbers.includes(line.name))) return [];
      if (line.arrival) {
        return [{
          busNumber: line.name,
          time: line.arrival.arrivalTime,
          time2: line.arrival.arrivalTime2,
          busStopCount: line.arrival.busStopCount,
          busStopCount2: line.arrival.busStopCount2,
        }];
      }
      return [];
    }).flat();
    
    console.log(
      [
        ' - ',
        loop > 1 && `[${i + 1}/${loop}]`,
        busData.name,
      ].filter(Boolean).join(' ')
    );
    
    // 결과 출력
    arrivalTimes.forEach(({ busNumber, time, time2, busStopCount, busStopCount2 }) => {
      console.log(`${p(busNumber, 4)} : ${timeString(time)} ${time2 ? `/ ${timeString(time2)}` : ''}`);
      console.log(`    남은 정류장: ${busStopCount ?? '-'} / ${busStopCount2 ?? '-'}`);
    });
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// CLI 설정
program
  .version('1.0.0')
  .description('버스 도착 시간 조회 CLI')
  .argument('[busStopId]', '버스 정류장 ID를 입력하세요. 카카오 맵 웹에서 획득 가능', '11140721021')
  .addArgument(new Argument('[busNumber]', '버스 번호를 쉼표로 구분해서 입력하세요. 빈칸으로 두면 모든 버스 조회'))
  .addArgument(new Argument('[loop]', '호출 횟수를 입력하세요. 30초 주기로 조회 합니다.').default(1))
  .helpCommand(true)
  .action(async (_busStopId, busNumber, loop) => {
    if (loop < 0) loop = Number.MAX_SAFE_INTEGER;
    const busStopIds = _busStopId.split(',').map(n => n.trim());
    for (let i = 0; i < loop; i++) {
      console.log(`\n[${i + 1}] ${new Date().toLocaleTimeString()}\n`);
      for (let j = 0; j < busStopIds.length; j++) {
        const busStopId = busStopIds[j];
        await getBusArrivalTimes(busStopId, busNumber, i, loop);
      }
      if (loop > 1 && i < loop - 1) await delay(30 * 1000);
    }
  })
  .parse(process.argv);
