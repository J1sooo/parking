package com.shingu.api.kakaoapi;

import lombok.Data;
import java.util.List;

@Data
public class kakaoSearchDto {
    private List<Document> documents;
    @Data
    public static class Document {
        private String address_name; // 포스트맨 주소 이름 확인용
        private String place_name; // 장소 이름 확인용
        private String x;
        private String y;
    }
}
