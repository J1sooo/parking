import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setLocation, setLocationError} from '../redux/locationSlice';

function LeftBar() {
    const {keyword} = useParams(); // URL에서 초기 검색어를 가져옵니다.
    const [reKeyword, setReKeyword] = useState(keyword || "");
    const [result, setResult] = useState([]); // 검색 결과
    const [find1kmResult, setFind1kmResult] = useState([])
    const [UserLocation, setUserLocation] = useState([])
    const [XYmap, setXYmap] = useState([]); // 검색 위도
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {latitude, longitude} = useSelector((state) => state.location);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // 성공적으로 위치를 가져왔을 때 위치 저장
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    dispatch(setLocation({ latitude, longitude }));  // 위치 상태에 저장
                },
                (error) => {
                    // 오류 발생 시 오류 상태 저장
                    dispatch(setLocationError(error.message));
                }
            );
        }
        const find1kmInParking = async () => {
            const find1kmresp = await fetch(`/api/find1kmInParking?lat=${latitude}&lon=${longitude}`);
            const find1kmdata = await find1kmresp.json();
            setFind1kmResult(find1kmdata);
        }
        find1kmInParking();
        const userLocation = async () => {
            const userresp = await fetch(`UserLocation?Ylat=${latitude}&Xlon=${longitude}`);
            const userlocationdata = await userresp.json();

            const region2 = userlocationdata.documents[0]?.address?.region_2depth_name || "";
            const region3 = userlocationdata.documents[0]?.address?.region_3depth_name || "";

            const ULocation = `${region2} ${region3}`
            setUserLocation(ULocation);
        }
        userLocation();
    },[dispatch]);

    useEffect(() => {
        const parkplaceSearch = async () => {
            try {
                const parkresponse = await fetch(`/api/search?parkplace=${keyword}`);
                const parkdata = await parkresponse.json();
                setResult(parkdata);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        parkplaceSearch();
    }, [keyword]);
    const reSearch = async () => {
        if (!reKeyword || reKeyword.length < 2) return alert("2글자 이상 검색하세요"); // keyword가 없으면 함수 종료
        navigate(`/search/${reKeyword}`); // 검색 후 해당 페이지로 이동
    };

    return (
        <div>
            <div className="absolute inset-y-0 left-0 w-1/3 ...">
                <input
                    type="text"
                    placeholder="주차장 이름 또는 주소 검색"
                    value={reKeyword}
                    onChange={(e) => setReKeyword(e.target.value)} // 입력 값 변경 시 상태 업데이트
                    onKeyDown={(e) => e.key === 'Enter' && reSearch()}
                />
                <button onClick={reSearch}>검색</button>
                <>
                    {XYmap && XYmap.documents && XYmap.documents.length > 0 ? (
                        <ul>
                            {XYmap.documents.map((xy, index) => (
                                <li key={index}>
                                    {xy.address_name}{xy.x}-{xy.y}
                                </li>
                            ))}
                        </ul>
                    ) : (
                    <p>현재 위치 {UserLocation}</p>
                    )}
                </>
                <div>
                    {result.length > 0 ? (
                        <ul>
                            {result.map((parking) => (
                                <li key={parking.prkplceNo}>
                                    {parking.prkplceNm} - {parking.rdnmadr} {parking.lnmadr && `(${parking.lnmadr})`}
                                </li>
                            ))}
                        </ul>
                    ) : result.length === 0 && keyword ? ( // 검색 결과가 없을 때 메시지 표시
                        <div>결과가 없습니다.</div>
                    ) : find1kmResult.length > 0 ? ( // 초기 상태에서 근처 주차장을 표시
                        <ul>
                            {find1kmResult.map((find1km) => (
                                <li key={find1km.prkplceNo}>
                                    {find1km.prkplceNm} - {find1km.rdnmadr} {find1km.lnmadr && `(${find1km.lnmadr})`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>근처 주차장이 없습니다.</div> // find1kmResult가 비어 있을 때 메시지 표시
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeftBar;