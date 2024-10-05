package com.shingu.openapi.DDD;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParkingRepository extends JpaRepository<Parking,String> {
    @Query("SELECT p FROM Parking p WHERE p.rdnmadr LIKE %:parkplace% OR p.lnmadr LIKE %:parkplace% OR p.prkplceNm LIKE %:parkplace%")
    List<Parking> searchByAddressOrName(@Param("parkplace") String parkplace);
}
