import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function KakaoMap() {
    const { keyword } = useParams();
    const { latitude, longitude } = useSelector((state) => state.location);
    const { detailLatitude, detailLongitude } = useSelector((state) => state.locationDetail);
    const { result } = useSelector((state) => state.parkingResults);

    const mapRef = useRef(null);
    const currentOverlay = useRef(null);

    useEffect(() => {
        if (!mapRef.current) {
            const container = document.getElementById("kakaomap");
            const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 4,
            };
            mapRef.current = new window.kakao.maps.Map(container, options);
        } else {
            const center = new window.kakao.maps.LatLng(latitude, longitude);
            mapRef.current.setCenter(center);
        }

        const map = mapRef.current;
        const markers = [];
        const overlays = [];

        result.forEach((location) => {
            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(location.latitude, location.longitude),
            });
            markers.push(marker);

            const content = `
                <div class="custom-overlay" style="padding: 5px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 5px; border: 1px solid #ddd;">
                    <div style="font-weight: bold; font-size: 12px; margin-bottom: 4px;">${location.prkplceNm}</div>
                    <div style="font-size: 11px; color: #666;">${location.rdnmadr || location.lnmadr}</div>
                    <a 
                        href="/parking/${location.prkplceNo}"
                        style="display: inline-block; font-size: 11px; color: #2563eb; text-decoration: none; cursor: pointer;">
                        상세보기
                    </a>
                </div>
            `;

            const overlay = new window.kakao.maps.CustomOverlay({
                content: content,
                position: marker.getPosition(),
                yAnchor: 1.5,
            });
            overlays.push(overlay);

            window.kakao.maps.event.addListener(marker, "click", () => {
                if (currentOverlay.current === overlay) {
                    overlay.setMap(null);
                    currentOverlay.current = null;
                } else {
                    if (currentOverlay.current) {
                        currentOverlay.current.setMap(null);
                    }
                    overlay.setMap(map);
                    currentOverlay.current = overlay;
                }
            });

            if (location.latitude === detailLatitude && location.longitude === detailLongitude) {
                if (currentOverlay.current) {
                    currentOverlay.current.setMap(null);
                }
                overlay.setMap(map);
                currentOverlay.current = overlay;
            }

            marker.setMap(map.getLevel() < 5 ? map : null);
        });

        const zoomHandler = () => {
            console.log("zoomHandler called");
            markers.forEach((marker) => marker.setMap(map.getLevel() < 5 ? map : null));
            overlays.forEach((overlay) => map.getLevel() > 4 && overlay.setMap(null));
            const warningDiv = document.getElementById("zoom-warning");
            if (warningDiv) {
                warningDiv.style.display = map.getLevel() > 4 ? "block" : "none";
            }
        };

        // 이벤트 핸들러 등록
        const zoomChangedListener = window.kakao.maps.event.addListener(map, "zoom_changed", zoomHandler);

        // Cleanup에서 정리
        return () => {
            markers.forEach((marker) => marker.setMap(null));
            overlays.forEach((overlay) => overlay.setMap(null));
            if (zoomChangedListener) {
                window.kakao.maps.event.removeListener(zoomChangedListener);
            }
        };
    }, [latitude, longitude, keyword, result, detailLatitude, detailLongitude]);

    useEffect(() => {
        if (mapRef.current && detailLatitude && detailLongitude) {
            const moveLatLng = new window.kakao.maps.LatLng(detailLatitude, detailLongitude);
            mapRef.current.panTo(moveLatLng);

            setTimeout(() => {
                mapRef.current.setLevel(3);
            }, 50);
        }
    }, [detailLatitude, detailLongitude]);

    return (
        <div>
            <div className="absolute inset-y-0 right-0 w-2/3">
                <div id="kakaomap" style={{ width: "100%", height: "100vh" }}></div>
                <div
                    id="zoom-warning"
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
                    style={{ display: mapRef.current?.getLevel() > 5 ? "block" : "none" }}
                >
                    <div className="bg-gray-700/90 px-4 py-2 rounded-lg shadow-lg text-center">
                        <div className="text-white font-medium">보고있는 지역이 넓습니다</div>
                        <div className="text-white">확대하면 주차장이 보입니다</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KakaoMap;
