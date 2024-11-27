import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

function KakaoMap() {
    const {keyword} = useParams(); // URL에서 초기 검색어를 가져옵니다.
    const {latitude, longitude} = useSelector((state) => state.location);
    const { result } = useSelector((state) => state.parkingResults);

    useEffect(() => {
        const container = document.getElementById('kakaomap');
        const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 6 // 지도의 확대 레벨
        };
        const map = new window.kakao.maps.Map(container, options);

    }, [latitude, longitude, keyword]);

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
