import {useNavigate, useParams, useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLocation} from '../redux/locationSlice';
import {fetchParkingPlaces, NearbyParkingPlaces} from '../redux/parkingResultsSlice';
import {setDetailLocation, DetailLocation} from '../redux/locationDetailSlice';

function LeftBar() {
    const {keyword} = useParams(); // URL에서 초기 검색어를 가져옵니다.
    const [reKeyword, setReKeyword] = useState(keyword || "");
    const [UserLocation, setUserLocation] = useState([])
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {latitude, longitude} = useSelector((state) => state.location);
    const {result, loading} = useSelector((state) => state.parkingResults);
    const [firstPage, setFirstPage] = useState(1);
    const itemsPage = 10;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const fromParkingNo = queryParams.get('from');

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
                    (e) => {
                        // 위치를 못 받으면 기본 좌표 저장
                        dispatch(setLocation({
                            latitude: 33.450701,
                            longitude: 126.570667,
                            source: 'default'
                        }));
                        console.error(e)
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
            // 주차장 상세에서 넘어온 경우 moveMapPoint 실행하지 않음
            if (!fromParkingNo) {
                moveMapPoint();
            }
        }
    }, [keyword, dispatch, latitude, longitude, fromParkingNo]);

    useEffect(() => {
        dispatch(fetchParkingPlaces(keyword));

        if (latitude && longitude) {
            const timer = setTimeout(() => {
                dispatch(NearbyParkingPlaces({ latitude, longitude }));
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [latitude, longitude, keyword, dispatch]);

    const reSearch = async () => {
        if (!reKeyword || reKeyword.length < 2) return alert("2글자 이상 검색하세요"); // keyword가 없으면 함수 종료
        navigate(`/search/${reKeyword}`); // 검색 후 해당 페이지로 이동
    };

    // 현재 페이지의 아이템들만 선택
    const getCurrentItems = () => {
        const indexOfLastItem = firstPage * itemsPage;
        const indexOfFirstItem = indexOfLastItem - itemsPage;
        return result.slice(indexOfFirstItem, indexOfLastItem);
    };

    // keyword가 바뀔 때마다 페이지를 1로 리셋
    useEffect(() => {
        setFirstPage(1);
        dispatch(DetailLocation());
    }, [keyword]);

    const totalPages = Math.ceil(result.length / itemsPage);

    return (
        <div>
            <div className="absolute inset-y-0 left-0 w-1/3 flex flex-col h-screen">
                <div className="p-4 border-b">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => {navigate('/'); setReKeyword("");}}
                            className="text-4xl font-bold text-blue-400 hover:text-blue-500 transition-colors"
                        >
                            P
                        </button>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="주차장 이름 또는 주소 검색"
                                value={reKeyword}
                                onChange={(e) => setReKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && reSearch()}
                                className="w-full px-4 py-2 pr-12 rounded-full border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                            />
                            <button
                                onClick={reSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {UserLocation && (
                        <div className="text-base font-semibold text-gray-600">
                            {UserLocation}
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <span className="loading loading-spinner loading-lg text-blue-400"></span>
                        </div>
                    ) : result.length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {getCurrentItems().map((result) => (
                                    <div key={result.prkplceNo} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                        <div className="card-body p-3">
                                            <div className="flex justify-between items-start">
                                                <h2 className="card-title text-base">
                                                    {result.prkplceNm}
                                                    <span className="text-sm text-gray-600 ml-2">
                                                        {result.prkplceSep === "공영" ? "공영" : "민영"}
                                                    </span>
                                                </h2>
                                                <button
                                                    onClick={() => dispatch(setDetailLocation({
                                                        latitude: result.latitude,
                                                        longitude: result.longitude
                                                    }))}
                                                    className="btn btn-xs btn-ghost"
                                                >
                                                    위치보기
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-1 mt-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="badge badge-sm badge-outline">{result.prkplceType}</span>
                                                    <span className="text-sm">{result.parkingchargeInfo}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">
                                                        {result.rdnmadr || result.lnmadr}
                                                    </span>
                                                    <button
                                                        onClick={() => navigate(`/parking/${result.prkplceNo}`)}
                                                        className="btn btn-xs btn-ghost"
                                                    >
                                                        상세정보
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-4 pb-4">
                                    <div className="join">
                                        <button
                                            className="join-item btn btn-sm"
                                            onClick={() => setFirstPage(prev => Math.max(prev - 1, 1))}
                                            disabled={firstPage === 1}
                                        >
                                            «
                                        </button>
                                        <button className="join-item btn btn-sm">
                                            {firstPage} / {totalPages}
                                        </button>
                                        <button
                                            className="join-item btn btn-sm"
                                            onClick={() => setFirstPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={firstPage === totalPages}
                                        >
                                            »
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex justify-center mt-4">
                            <div className="text-blue-400 font-bold text-lg">
                                <span>근처 주차장이 없습니다.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeftBar;