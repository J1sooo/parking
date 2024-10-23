package com.shingu.api.openapi;

import com.shingu.api.kakaoapi.kakaoSearchDto;
import com.shingu.api.kakaoapi.kakaoapiService;
import com.shingu.api.openapi.DDD.Parking;
import com.shingu.api.openapi.DDD.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ParkingService {
    private final ParkingRepository parkingRepository;

    @Autowired
    public ParkingService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    // 주차장 정보를 데이터베이스에 저장
    public Parking save(Parking parking) {
        return parkingRepository.save(parking);
    }

    // 모든 주차장 가져오기
    public List<Parking> getAllParking() {
        return parkingRepository.findAll();
    }

    // 검색기능(제목 주소 도로명주소)
    public List<Parking> searchparkplace(String parkplace){
        return parkingRepository.searchByAddressOrName(parkplace);
    }

    // 지도 범위 계산
    private static final double EARTH_RADIUS = 6371; // 지구의 반지름
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        lat1 = Math.toRadians(lat1);
        lat2 = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c; // 두 지점 간의 거리 km단위
    }

    public List<Parking> find1kmInParking(float inputLat, float inputLon){
        List<Parking> find1kmParking = new ArrayList<>();
        List<Parking> allParking = parkingRepository.findAll(); // 모든 주차장 조회

        for (Parking parking : allParking) {
            if (!parking.getLatitude().isEmpty() && !parking.getLongitude().isEmpty()) {
                float dbLatitude = Float.parseFloat(parking.getLatitude());
                float dbLongitude = Float.parseFloat(parking.getLongitude());

                double distance = calculateDistance(inputLat, inputLon, dbLatitude, dbLongitude);
                if (distance <= 1.0) { // 1km 이내
                    find1kmParking.add(parking); // 1km 이내의 주차장 추가
                }
            }
        }
        return find1kmParking;
    }
}
