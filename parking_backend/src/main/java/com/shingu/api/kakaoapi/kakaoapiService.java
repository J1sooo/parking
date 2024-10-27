package com.shingu.api.kakaoapi;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class kakaoapiService {
    @Value("${rest_api}") private String restapiKey;

    public kakaoSearchDto kakaoApiRequest(String apiUrl) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", restapiKey);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<kakaoSearchDto> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, kakaoSearchDto.class);
        return response.getBody();
    }

    // 좌표 없는 데이터 좌표 찾기
    public kakaoSearchDto searchAddressXY(String address) {
        if (address == null || address.isEmpty()) {
            return null;
        }
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query="+address;
        kakaoSearchDto result = kakaoApiRequest(apiUrl);

        // 검색 결과가 없을 경우 address를 줄여나가며 재검색
        if (result == null || result.getDocuments().isEmpty()) {
            address = address.replaceAll(" ",""); // 공백 제거
            // 주소에는 무조건 읍,면,동,리가 들어가므로 무한루프 X
            String finalAddress;
            System.out.println(address);
            if (address.endsWith("도") || address.endsWith("시") ||
                address.endsWith("군") || address.endsWith("구") ||
                address.endsWith("읍") || address.endsWith("면") ||
                address.endsWith("동") || address.endsWith("리")) {
                return searchAddressXY(null);
            } else {
                finalAddress = address.substring(0, address.length() - 1);
                return searchAddressXY(finalAddress);
            }
        }
        return result;
    }

    // 검색시 좌표 이동
    public kakaoSearchDto moveLocationMap(String searchWord) {
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query=" + searchWord;
        kakaoSearchDto result = kakaoApiRequest(apiUrl);

        if (result==null || result.getDocuments().isEmpty()){
            apiUrl = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + searchWord;
            result = kakaoApiRequest(apiUrl);
        }
        return result;
    }

    public kakaoSearchDto userLocation(Double Ylat, Double Xlon){
        String apiUrl = "https://dapi.kakao.com/v2/local/geo/coord2address.json?y="+Ylat+"&x="+Xlon;
        return kakaoApiRequest(apiUrl);
    }
}
