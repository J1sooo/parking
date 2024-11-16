package com.shingu.api.openapi;

import com.shingu.api.kakaoapi.kakaoSearchDto;
import com.shingu.api.kakaoapi.kakaoapiService;
import com.shingu.api.openapi.DDD.Parking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class openapiController { //openapi를 json호출해서 jsonsimple로 db 저장
    private final ParkingService parkingService;
    @Autowired
    public openapiController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    //환경변수에서 serviceKey를 가져옴
    @Value("${serviceKey}") private String serviceKey;
    @Value("${openapiUrl}") private String openapiUrl;

    //api 요청 후 db 저장
    @GetMapping("/parking")
    public Parking loadSaveParkingApi(Parking parking) {
        return parkingService.save(parking);
    }

    // 검색기능(제목 주소 도로명주소)
    @GetMapping("/search")
    public List<Parking> searchParkplace(@RequestParam String parkplace){
        return parkingService.searchparkplace(parkplace);
    }

    @GetMapping("/find1kmInParking")
    public List<Parking> find1kmInParking(@RequestParam Float lat, @RequestParam Float lon){
        return parkingService.find1kmInParking(lat, lon);
    }

    @GetMapping("/allParking")
    public List<Parking> getAllParking() {
        return parkingService.getAllParking();
    }
}
