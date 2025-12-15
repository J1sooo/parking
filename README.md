# 🚗 PARKING
운전자가 주변 주차장을 쉽고 빠르게 찾을 수 있게 도와주는 웹 서비스입니다.

## 📌 프로젝트 소개
공공데이터를 활용해서 주차장 위치, 가격, 정보를 한눈에 알아보고 검색을 통해 원하는 주차장을 찾을 수 있는 서비스입니다. </br>
(모두의 주차장 어플 클론 코딩)
- 작업 기간: 2023.09.24 - 2023.12.03
- 인원: 1명

## 😎 Stack
### 💻 프론트엔드
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)

### 🔧 백엔드
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JPA](https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white)

### 🛢️ 데이터베이스
![MySQL](https://img.shields.io/badge/AWS_RDS_MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![H2](https://img.shields.io/badge/H2-006699?style=for-the-badge&logo=h2&logoColor=white)

### 🧪 기타
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white)

## 🔑 핵심 기능
### 🌍 실시간 사용자 위치 기반 탐색
- 브라우저 GPS를 통해 현재 위치 자동 감지
- 사용자 위치 기반 주변 주차장 실시간 표시

### 🗺️ 카카오 지도 활용
- Kakao Maps API 연동
- 주차장 위치 마커 표시
- 마우스 오버 시 상세 정보창 표시

### 🔍 다양한 검색 기능
- 주차장 이름 검색
- 지역 검색
- 랜드마크 검색 (예: 롯데월드, 강남역 등)

### 📋 주차장의 상세 정보 제공
- 주차장 이름 및 주소 (도로명/지번)
- 운영 정보 (평일/토요일/공휴일 운영 시간)
- 주차 구획수 (주차 가능 대수)
- 주차 요금 정보 (기본 요금, 추가 요금, 월 정기권)
- 결제 방식
- 관리 기관 및 연락처

## ⚙️ PARKING 시스템 다이어그램
<img width="2340" height="1856" alt="parking 시스템 다이어그램" src="https://github.com/user-attachments/assets/a4ff50cd-5be9-4652-ac86-a85386869964" />

## 🔗 PARKING 시퀀스 다이어그램
- 공공 데이터 주차장 저장 시퀀스
<img width="3332" height="2244" alt="parking 시퀀스 다이어그램 1" src="https://github.com/user-attachments/assets/de521d79-b4f5-42e3-81dd-41e4386f552d" />

- 주차장 검색 기능 시퀀스
<img width="3288" height="3000" alt="parking 시퀀스 다이어그램 2" src="https://github.com/user-attachments/assets/07fb18d2-a3ba-432a-9580-af1122681d42" />

## 🖼️ 핵심 기능 스크린샷
### 메인 화면
<img width="2353" height="1257" alt="parking 메인 화면" src="https://github.com/user-attachments/assets/7ad53dcb-3085-44af-9760-5e1e3db9cee6" />

### 검색 화면
<img width="2353" height="1256" alt="parking 검색 화면" src="https://github.com/user-attachments/assets/4e49cd89-84e5-4a6a-8e21-c17489b887a6" />

### 상세 화면
<img width="2353" height="1256" alt="parking 상세 화면" src="https://github.com/user-attachments/assets/188e81bb-9349-4bdc-9b49-aeb6afa7c2fd" />

### 공공데이터 정보 저장 화면
<img width="745" height="1276" alt="open api 사진" src="https://github.com/user-attachments/assets/75bc5b16-23d0-420d-a305-2fcf89f9c3b8" />

### pastman 결과 화면
<img width="768" height="1094" alt="postman 결과 사진" src="https://github.com/user-attachments/assets/fd1de7b6-5133-4187-93b4-db529216685e" />

## PARKING 테이블

| Column | Type | Description |
|--------|------|-------------|
| prkplceNo | string | 주차장 번호 (PK) |
| prkplceNm | string | 주차장 이름 |
| prkplceSe | string | 주차장 종류(공영/민영) |
| prkplceType | string | 주차장 유형(노상/노외) |
| rdnmadr | string | 도로명 주소 |
| lnmadr | string | 지번 주소 |
| prkcmprt | string | 주차 가능 대수 |
| operDay | string | 운영 요일 |
| weekdayOperOpenHhmm | string | 평일 운영 시작시간 |
| weekdayOperCloseHhmm | string | 평일 운영 종료시간 |
| satOperOpenHhmm | string | 토요일 운영 시작시간 |
| satOperCloseHhmm | string | 토요일 운영 종료시간 |
| holidayOperOpenHhmm | string | 공휴일 운영 시작시간 |
| holidayCloseHhmm | string | 공휴일 운영 종료시간 |
| parkingchrgeInfo | string | 주차 요금 정보(유료/무료) |
| basicTime | string | 기본 주차 시간(분) |
| basicCharge | string | 기본 요금(원) |
| addUnitTime | string | 추가 단위 시간(분) |
| addUnitCharge | string | 추가 단위 요금(원) |
| monthCmmtkt | string | 월 정기권 요금(원) |
| metpay | string | 결제 방식 |
| spcmnt | string | 특이 사항 |
| institutionNm | string | 관리 기관 이름 |
| phoneNumber | string | 전화번호 |
| latitude | string | 위도 |
| longitude | string | 경도 |
