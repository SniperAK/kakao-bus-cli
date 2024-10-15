# Kakao Bus CLI

![npm version](https://img.shields.io/npm/v/kakao-bus-cli.svg)
![license](https://img.shields.io/npm/l/kakao-bus-cli.svg)
![downloads](https://img.shields.io/npm/dt/kakao-bus-cli.svg)


카카오 API를 활용하여 버스 정류장 버스 도착 정보를 조회하는 CLI 도구입니다. 이 도구를 사용하면 특정 버스 정류장에 대한 남은 도착 시간을 쉽게 확인할 수 있습니다.

## 설치

이 프로젝트를 전역적으로 설치하려면, 다음 명령어를 사용하세요:

``` bash
npm install -g kakao-bus-cli
```

## 사용법

CLI를 실행하려면 다음과 같은 형식으로 명령어를 입력하세요:

```bash
bus [busStopId] [busNumber] [loop]
```

- `busStopId`: 조회할 버스 정류장 ID (기본값: `11140721021`)
- `busNumber`: 조회할 버스 번호 (쉼표로 구분하여 여러 개 입력 가능, 기본값: 모든 버스 조회)
- `loop`: 호출 횟수 (기본값: 1, 30초 주기로 조회)

### 예시

#### 특정 버스 정류장 ID에 대한 모든 버스 도착 시간을 조회하려면:

```bash
bus 11140721021
```

#### 특정 버스 번호에 대한 도착 시간을 조회하려면:

```bash
bus 11140721021 7016,7711
```

#### 30초 간격으로 5회 조회하려면:

```bash
bus 11140721021 7016 5
```

## 의존성

이 프로젝트는 다음과 같은 패키지에 의존합니다:

- `axios`: HTTP 요청을 위한 라이브러리
- `commander`: CLI 명령어를 쉽게 작성할 수 있도록 도와주는 라이브러리

## 기여

기여를 원하신다면, 이 저장소를 포크하고 변경 사항을 제안해 주세요. Pull Request는 언제든지 환영합니다!

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.