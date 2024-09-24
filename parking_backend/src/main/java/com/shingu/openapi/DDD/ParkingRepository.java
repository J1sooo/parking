package com.shingu.openapi.DDD;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ParkingRepository extends JpaRepository<Parking,String> {
}
