import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLocation, setLocationError} from '../redux/locationSlice';
import { fetchParkingPlaces, fetchNearbyParkingPlaces } from '../redux/parkingResultsSlice';

function LeftBar() {
    const {keyword} = useParams(); // URL에서 초기 검색어를 가져옵니다.
    const [reKeyword, setReKeyword] = useState(keyword || "");
    const [UserLocation, setUserLocation] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {latitude, longitude} = useSelector((state) => state.location);
    const { result } = useSelector((state) => state.parkingResults);

    useEffect(() => {
        if (!keyword) {
            // keyword가 없을 때 사용자 위치 가져오기
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        dispatch(setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            source: 'user'
                        }));
                    },
                    (error) => {
                        // 위치를 못 받으면 기본 좌표 저장
                        dispatch(setLocation({
                            latitude: 33.450701,
                            longitude: 126.570667,
                            source: 'default'
                        }));
                        dispatch(setLocationError(error.message));
                    }
                );
                const userLocation = async () => {
                    try {
                        // 유저 위치 가져오기
                        const userresp = await fetch(`UserLocation?Ylat=${latitude}&Xlon=${longitude}`);
                        const userlocationdata = await userresp.json();

                        if (userlocationdata.documents && userlocationdata.documents.length > 0) {
                            const region2 = userlocationdata.documents[0]?.address?.region_2depth_name || "";
                            const region3 = userlocationdata.documents[0]?.address?.region_3depth_name || "";
                            const ULocation = `${region2} ${region3}`;
                            setUserLocation(ULocation);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                };
                const timer = setTimeout(() => {
                    userLocation();
                }, 500);
                return () => clearTimeout(timer);
            }
        } else {
            const moveMapPoint = async () => {
                try {
                    const xy = await fetch(`/MoveLocation?searchWord=${keyword}`);
                    const xydata = await xy.json();
                    const firstXY = xydata.documents[0];
                    dispatch(setLocation({
                        latitude: firstXY.y,
                        longitude: firstXY.x,
                        source: 'search'
                    }));
                } catch (error) {
                    console.error(error);
                }
            };
            moveMapPoint();
        }
    }, [keyword, dispatch, latitude, longitude]);

    useEffect(() => {
        dispatch(fetchParkingPlaces(keyword));

        if (latitude && longitude) {
            const timer = setTimeout(() => {
                dispatch(fetchNearbyParkingPlaces({ latitude, longitude }));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [latitude, longitude, keyword, dispatch]);

    const reSearch = async () => {
        if (!reKeyword || reKeyword.length < 2) return alert("2글자 이상 검색하세요"); // keyword가 없으면 함수 종료
        navigate(`/search/${reKeyword}`); // 검색 후 해당 페이지로 이동
    };

    return (
        <div>
            <div className="absolute inset-y-0 left-0 w-1/3 flex flex-col h-screen">
                <div className="p-2">
                    <input
                        type="text"
                        placeholder="주차장 이름 또는 주소 검색"
                        value={reKeyword}
                        onChange={(e) => setReKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && reSearch()}
                    />
                    <button onClick={reSearch}>검색</button>
                    <>
                        <p>현재 위치 {UserLocation} {latitude} {longitude}</p>
                    </>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {result.length > 0 ? (
                        <ul>
                            {result.map((result) => (
                                <li key={result.prkplceNo}>
                                    {result.prkplceNm} - {result.rdnmadr} {result.lnmadr && `(${result.lnmadr})`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>근처 주차장이 없습니다.</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeftBar;