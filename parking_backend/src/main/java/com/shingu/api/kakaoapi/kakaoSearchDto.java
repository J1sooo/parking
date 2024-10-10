package com.shingu.api.kakaoapi;

import lombok.Data;
import java.util.List;

@Data
public class kakaoSearchDto {
    private List<Document> documents;
    @Data
    public static class Document {
        private String x;
        private String y;
    }
}
