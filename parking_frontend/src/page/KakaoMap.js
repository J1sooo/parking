import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

function KakaoMap() {
    const {latitude, longitude} = useSelector((state) => state.location);


    useEffect(() => {
        const container = document.getElementById('kakaomap');

        // 지도 초기화 옵션
        const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 6 // 지도의 확대 레벨
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

    }, [latitude, longitude]);

    return (
        <div>
            <div className="absolute inset-y-0 right-0 w-2/3 ...">
                <div id="kakaomap" style={{width: "100%", height: "100vh"}}></div>
                {/* 카카오 맵을 렌더링할 영역 */}
            </div>
        </div>
    )
}

export default KakaoMap;
