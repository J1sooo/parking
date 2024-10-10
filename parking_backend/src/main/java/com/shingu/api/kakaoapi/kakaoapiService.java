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

    public kakaoSearchDto searchAddress(String address) {
        String apiUrl = "https://dapi.kakao.com/v2/local/search/address.json?query="+address;
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", restapiKey);
        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<kakaoSearchDto> response = restTemplate.exchange(apiUrl , HttpMethod.GET, entity, kakaoSearchDto.class);
        return response.getBody();
    }
}
