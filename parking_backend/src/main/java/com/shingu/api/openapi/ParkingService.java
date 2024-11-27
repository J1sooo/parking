package com.shingu.api.openapi;

import com.shingu.api.kakaoapi.kakaoSearchDto;
import com.shingu.api.kakaoapi.kakaoapiService;
import com.shingu.api.openapi.DDD.Parking;
import com.shingu.api.openapi.DDD.ParkingRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@Service
public class ParkingService {
    private final ParkingRepository parkingRepository;
    private final kakaoapiService kakaoapiService;

    @Autowired
    public ParkingService(ParkingRepository parkingRepository,
            com.shingu.api.kakaoapi.kakaoapiService kakaoapiService) {
        this.parkingRepository = parkingRepository;
        this.kakaoapiService = kakaoapiService;
    }

    // 환경변수에서 serviceKey를 가져옴
    @Value("${serviceKey}")
    private String serviceKey;
    @Value("${openapiUrl}")
    private String openapiUrl;

    // 주차장 정보를 데이터베이스에 저장
    public Parking save(Parking parking) {
        String result = "";
        try {
            // 총 데이터가 16062개라 /6 = 2677 해서 모두다 가져오기
            for(int page=1;page<50;page++) {
                // API URL 설정
                URL url = new URL(openapiUrl + "&serviceKey=" + serviceKey +
                        "&pageNo=" + page + "&numOfRows=20" + "&type=json");

                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setRequestProperty("Content-type", "application/json");

                BufferedReader bf = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
                result = bf.readLine();

                // JSON 파싱
                JSONParser jsonParser = new JSONParser();
                JSONObject jsonObject = (JSONObject) jsonParser.parse(result);
                JSONObject response = (JSONObject) jsonObject.get("response");
                JSONObject body = (JSONObject) response.get("body");
                // xml은 item안에 담겨 있지만 json은 items에 담겨있어서 items로 array
                JSONArray items = (JSONArray) body.get("items");

                // 데이터베이스에 저장하는 과정
                for(int i=0;i<items.size();i++) {
                    JSONObject data = (JSONObject) items.get(i);
                    String latitude = (String) data.get("latitude");
                    String longitude = (String) data.get("longitude");

                    if (latitude == null || longitude == null || latitude.isEmpty() || longitude.isEmpty()) {
                        kakaoSearchDto kakaoResult;

                        // rdnmadr, lnmadr으로 위도 경도 검색
                        String[] addressFields = {"rdnmadr", "lnmadr"};
                        for (String field : addressFields) {
                            String address = (String) data.get(field);
                            kakaoResult = kakaoapiService.searchAddressXY(address);

                            if (kakaoResult != null && kakaoResult.getDocuments() != null && !kakaoResult.getDocuments().isEmpty()) {
                                latitude = kakaoResult.getDocuments().getFirst().getY();
                                longitude = kakaoResult.getDocuments().getFirst().getX();
                                break;
                            }
                        }
                    }
                    Parking parkingInfo = new Parking(
                            (String) data.get("prkplceNo"), // 주차장 번호
                            (String) data.get("prkplceNm"), // 주차장 이름
                            (String) data.get("prkplceSe"), // 주차장 종류 (공영/민영)
                            (String) data.get("prkplceType"), // 주차장 유형 (노상/노외)
                            (String) data.get("rdnmadr"), // 도로명 주소
                            (String) data.get("lnmadr"), // 지번 주소
                            (String) data.get("prkcmprt"), // 주차 가능 대수
                            (String) data.get("operDay"), // 운영 요일
                            (String) data.get("weekdayOperOpenHhmm"), // 평일 운영 시작 시간
                            (String) data.get("weekdayOperCloseHhmm"), // 평일 운영 종료 시간
                            (String) data.get("satOperOpenHhmm"), // 토요일 운영 시작 시간
                            (String) data.get("satOperCloseHhmm"), // 토요일 운영 종료 시간
                            (String) data.get("holidayOperOpenHhmm"), // 공휴일 운영 시작 시간
                            (String) data.get("holidayCloseHhmm"), // 공휴일 운영 종료 시간
                            (String) data.get("parkingchrgeInfo"), // 주차 요금 정보
                            (String) data.get("basicTime"), // 기본 주차 시간
                            (String) data.get("basicCharge"), // 기본 요금
                            (String) data.get("addUnitTime"), // 추가 단위 시간
                            (String) data.get("addUnitCharge"), // 추가 단위 요금
                            (String) data.get("monthCmmtkt"), // 월 정기권 요금
                            (String) data.get("metpay"), // 결제 방식
                            (String) data.get("spcmnt"), // 특이 사항
                            (String) data.get("institutionNm"), // 관리 기관 이름
                            (String) data.get("phoneNumber"), // 전화번호
                            latitude, // 수정된 위도
                            longitude // 수정된 경도
                    );
                    parkingRepository.save(parkingInfo);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return parking;
    }

    // 모든 주차장 가져오기
    public List<Parking> getAllParking() {
        return parkingRepository.findAll();
    }

    // 검색기능(제목 주소 도로명주소)
    public List<Parking> searchparkplace(String parkplace) {
        return parkingRepository.searchByAddressOrName(parkplace);
    }

    public List<Parking> find1kmInParking(float inputLat, float inputLon)  {
        return parkingRepository.findParkingWithinDistance(inputLat, inputLon, 5.0);
    }
}
