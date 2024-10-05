package com.shingu.openapi.DDD;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data @Entity
@Table(name = "parking") //데이블 이름
@NoArgsConstructor
@AllArgsConstructor
public class Parking {
    @Id
    private String prkplceNo; // 주차장 번호를 ID로 사용

    private String prkplceNm; // 주차장 이름
    private String prkplceSe; // 주차장 종류 (공영/민영)
    private String prkplceType; // 주차장 유형 (노상/노외)
    private String rdnmadr; // 도로명 주소 (없을 수 있음)
    private String lnmadr; // 지번 주소 (없을 수 있음)
    private String prkcmprt; // 주차 가능 대수
    private String operDay;       // 운영 요일 (평일/토요일/공휴일)
    private String weekdayOperOpenHhmm;   // 평일 운영 시작 시간
    private String weekdayOperCloseHhmm;  // 평일 운영 종료 시간
    private String satOperOpenHhmm;       // 토요일 운영 시작 시간
    private String satOperCloseHhmm;      // 토요일 운영 종료 시간
    private String holidayOperOpenHhmm;   // 공휴일 운영 시작 시간
    private String holidayCloseHhmm;      // 공휴일 운영 종료 시간
    private String parkingchrgeInfo;      // 주차 요금 정보 (유료/무료)
    private String basicTime;            // 기본 주차 시간 (분)
    private String basicCharge;          // 기본 요금 (원)
    private String addUnitTime;          // 추가 단위 시간 (분)
    private String addUnitCharge;        // 추가 단위 요금 (원)
    private String monthCmmtkt;          // 월 정기권 요금 (원)
    private String metpay;                // 결제 방식 (없을 수 있음)
    private String spcmnt;                // 특이 사항 (없을 수 있음)
    private String institutionNm;         // 관리 기관 이름
    private String phoneNumber;           // 전화번호 (없을 수 있음)
    private String latitude;              // 위도 (없을 수 있음)
    private String longitude;             // 경도 (없을 수 있음)
}
