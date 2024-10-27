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

    // 확인용
    @GetMapping("/searchXY")
    public ResponseEntity<kakaoSearchDto> searchAddressXY(@RequestParam String address) {
        kakaoSearchDto result = addressService.searchAddressXY(address);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/MoveLocation")
    public ResponseEntity<kakaoSearchDto> moveLocationMap(@RequestParam String searchWord) {
        kakaoSearchDto result = addressService.moveLocationMap(searchWord);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/UserLocation")
    public ResponseEntity<kakaoSearchDto> userLocation(@RequestParam Double Ylat, Double Xlon) {
        kakaoSearchDto result = addressService.userLocation(Ylat, Xlon);
        return ResponseEntity.ok(result);
    }
}
