package com.shingu.api.kakaoapi;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class kakaoapiController {
    private final kakaoapiService addressService;

    public kakaoapiController(kakaoapiService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/searchXY")
    public ResponseEntity<kakaoSearchDto> searchAddress(@RequestParam String address) {
        kakaoSearchDto result = addressService.searchAddress(address);
        return ResponseEntity.ok(result);
    }
}
