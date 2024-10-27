package com.shingu.api.kakaoapi;

import lombok.Data;
import java.util.List;

@Data
public class kakaoSearchDto {
    private Meta meta;
    private List<Document> documents;

    @Data
    public static class Meta {
        private int total_count;
    }
    @Data
    public static class Document {
        private address address;
        private String address_name; // 주소 이름 확인용
        private String place_name; // 장소 이름 확인용
        private String x;
        private String y;
    }

    @Data
    public static class address{
        private String address_name; // 주소 이름 확인용
        private String region_3depth_name; // 좌표로 찾은 사용자 주소
    }
}
