package com.shingu.api.openapi;

import com.shingu.api.kakaoapi.kakaoSearchDto;
import com.shingu.api.kakaoapi.kakaoapiService;
import com.shingu.api.openapi.DDD.Parking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class openapiController { //openapi를 json호출해서 jsonsimple로 db 저장
    private final ParkingService parkingService;
    @Autowired
    public openapiController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

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

    @GetMapping("/findKmInParking")
    public List<Parking> findKmInParking(@RequestParam Float lat, @RequestParam Float lon){
        return parkingService.findKmInParking(lat, lon);
    }

    @GetMapping("/parking/{prkplceNo}")
    public Optional<Parking> getParkingByPrkplceNo(@PathVariable String prkplceNo) {
        return parkingService.findByPrkplceNo(prkplceNo);
    }
}
