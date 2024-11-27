package com.shingu.api.openapi.DDD;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParkingRepository extends JpaRepository<Parking, String> {
    // 검색기능(제목 주소 도로명주소)
    @Query("SELECT p FROM Parking p WHERE p.rdnmadr LIKE %:parkplace% OR p.lnmadr LIKE %:parkplace% OR p.prkplceNm LIKE %:parkplace%")
    List<Parking> searchByAddressOrName(@Param("parkplace") String parkplace);

    // 지도 범위 계산 KM안에 있는 주차장 가져오기
    @Query(value = """
            SELECT * FROM parking
            WHERE latitude != '' AND longitude != ''
            AND (6371 * acos(cos(radians(:latitude)) * cos(radians(CAST(latitude AS DOUBLE)))
            * cos(radians(CAST(longitude AS DOUBLE)) - radians(:longitude))
            + sin(radians(:latitude)) * sin(radians(CAST(latitude AS DOUBLE))))) <= :distance
            """, nativeQuery = true)
    public List<Parking> findParkingWithinDistance(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("distance") double distance);
}
