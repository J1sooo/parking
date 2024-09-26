package com.shingu.openapi;

import com.shingu.openapi.DDD.Parking;
import com.shingu.openapi.DDD.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
