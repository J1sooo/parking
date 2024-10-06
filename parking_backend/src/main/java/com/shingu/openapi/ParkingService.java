package com.shingu.openapi;

import com.shingu.openapi.DDD.Parking;
import com.shingu.openapi.DDD.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ParkingService {
    @Autowired
    private final ParkingRepository parkingRepository;

    public ParkingService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    // 주차장 정보를 데이터베이스에 저장
    public Parking save(Parking parking) {
        return parkingRepository.save(parking);
    }

    // 검색기능(제목 주소 도로명주소)
    public List<Parking> searchparkplace(String parkplace){
        return parkingRepository.searchByAddressOrName(parkplace);
    }
}
